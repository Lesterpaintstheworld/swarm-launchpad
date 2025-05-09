'use client'

import { useState, useEffect } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/datatable/columnHeader";
import { IntlNumberFormat } from "@/lib/utils";
import { DividendPayment } from ".";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/shadcn/button";
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';

async function getSwarm(swarmId: string) {
  try {
    const response = await fetch(`/api/swarms/${swarmId}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching swarm:', error);
    return null;
  }
}

// Global swarm cache for dividend payments
const dividendSwarmCache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const SwarmCell = ({ swarmId }: { swarmId: string }) => {
    const [swarm, setSwarm] = useState<{ name: string; image: string; role?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        let timeoutId: NodeJS.Timeout;

        async function fetchSwarm() {
            try {
                // Check cache first
                const now = Date.now();
                if (dividendSwarmCache[swarmId] && (now - dividendSwarmCache[swarmId].timestamp < CACHE_DURATION)) {
                    if (isMounted) {
                        setSwarm(dividendSwarmCache[swarmId].data);
                        setIsLoading(false);
                    }
                    return;
                }

                // Set a timeout to prevent hanging requests
                const fetchPromise = fetch(`/api/swarms/${swarmId}`, {
                    signal: controller.signal
                });
                
                // Add a timeout to abort long-running requests
                timeoutId = setTimeout(() => controller.abort(), 5000);
                
                const response = await fetchPromise;
                clearTimeout(timeoutId);
                
                if (!response.ok) throw new Error('Failed to fetch swarm');
                const data = await response.json();
                
                // Update cache
                dividendSwarmCache[swarmId] = { data, timestamp: now };
                
                if (isMounted) {
                    setSwarm(data);
                    setIsLoading(false);
                }
            } catch (error) {
                clearTimeout(timeoutId);
                if (error instanceof Error && error.name === 'AbortError') {
                    return;
                }
                console.error('Error fetching swarm:', error);
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchSwarm();

        return () => {
            isMounted = false;
            controller.abort();
            clearTimeout(timeoutId);
        };
    }, [swarmId]); // Only depend on swarmId

    if (isLoading || !swarm) {
        return (
            <div className="flex items-center min-w-[200px] gap-4 py-1">
                <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                <div className="flex flex-col gap-2">
                    <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                    <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center min-w-[200px] gap-4 py-1">
            <Image
                src={swarm.image}
                alt={`${swarm.name} avatar`}
                width={32}
                height={32}
                className="rounded-full"
            />
            <div className="flex flex-col">
                <Link className="text-lg mb-0 leading-1 truncate hover:underline" href={`/invest/${swarmId}`}>
                    {swarm.name}
                </Link>
                {swarm.role && <p className="text-sm text-muted truncate">{swarm.role}</p>}
            </div>
        </div>
    );
};
// First define the ActionCell component outside and before the columns definition
interface RowData {
    amount: number;
    swarm_id: string;
    ubcAmount: number;
    timestamp: string;
}

interface ActionCellProps {
    row: {
        getValue: (key: keyof RowData) => RowData[keyof RowData];
        original: RowData;
    };
}

const ActionCell = ({ row }: ActionCellProps) => {
    const { publicKey } = useWallet();
    const [isClaimed, setIsClaimed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [swarm, setSwarm] = useState<any>(null);
    const computeAmount = row.getValue('amount') as number;
    const ubcAmount = row.original.ubcAmount;
    const swarmId = row.original.swarm_id;

    // Add check for existing claims
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        
        async function checkExistingClaim() {
            if (!publicKey || !swarmId) {
                if (isMounted) setIsLoading(false);
                return;
            }

            try {
                // Calculate the last Thursday as the start of the claim period
                const getLastThursday = () => {
                    const today = new Date();
                    const day = today.getDay(); // 0 is Sunday, 4 is Thursday
                    const diff = day <= 4 ? 4 - day - 7 : 4 - day; // Go back to previous Thursday
                    
                    const lastThursday = new Date(today);
                    lastThursday.setDate(today.getDate() + diff);
                    
                    // Format as YYYY-MM-DD
                    return lastThursday.toISOString().split('T')[0];
                };

                const claimStartDate = getLastThursday();

                const response = await fetch(
                    `/api/redistributions/check?wallet=${publicKey.toString()}&swarmId=${swarmId}&date=${claimStartDate}`,
                    { signal: controller.signal }
                );
                
                if (response.ok && isMounted) {
                    const data = await response.json();
                    setIsClaimed(data.exists);
                }
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    return;
                }
                console.error('Error checking existing claim:', error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        checkExistingClaim();
        
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [publicKey, swarmId]);

    // Add debug logging
    console.log('Row data:', {
        original: row.original,
        swarmId,
        computeAmount,
        ubcAmount
    });

    const isDisabled = ubcAmount < 10;

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        
        async function fetchSwarm() {
            // Check cache first
            const now = Date.now();
            if (dividendSwarmCache[swarmId] && (now - dividendSwarmCache[swarmId].timestamp < CACHE_DURATION)) {
                if (isMounted) {
                    setSwarm(dividendSwarmCache[swarmId].data);
                }
                return;
            }
            
            try {
                const response = await fetch(`/api/swarms/${swarmId}`, {
                    signal: controller.signal
                });
                if (!response.ok) return;
                const data = await response.json();
                
                // Update cache
                dividendSwarmCache[swarmId] = { data, timestamp: now };
                
                if (isMounted) {
                    setSwarm(data);
                }
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    return;
                }
                console.error('Error fetching swarm:', error);
            }
        }
        
        fetchSwarm();
        
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [swarmId]);

    const getLastThursday = () => {
        const today = new Date();
        const utcHours = today.getUTCHours();
        const day = today.getDay(); // 0 is Sunday, 4 is Thursday
        
        // If today is Thursday (day 4) and it's before 6pm UTC, 
        // go back one week to get the previous Thursday
        const diff = day === 4 && utcHours < 18 
            ? -7 // Go back a full week on Thursday before 6pm UTC
            : day <= 4 ? 4 - day - 7 : 4 - day; // Normal calculation for other days
        
        const lastThursday = new Date(today);
        lastThursday.setDate(today.getDate() + diff);
        
        // Format as YYYY-MM-DD
        return lastThursday.toISOString().split('T')[0];
    };
    
    const getWeekKey = () => {
        return getLastThursday();
    };
    
    const claimKey = `claimed_${swarmId}_${publicKey?.toString()}_week_${getWeekKey()}`;
    
    const handleClaim = async () => {
        if (!publicKey || !claimKey || !swarm) return;

        // Add debug logging
        console.log('Claim attempt with:', {
            wallet: publicKey.toString(),
            swarmId,
            computeAmount,
            ubcAmount,
            swarm
        });

        const message = `New Dividend Claim:\n\n` +
            `Wallet: ${publicKey.toString()}\n` +
            `Swarm: ${swarm.name}\n` +
            `Amount: ${computeAmount.toLocaleString()} $COMPUTE\n` +
            `UBC Amount: ${ubcAmount.toLocaleString()} $UBC\n` +
            `Week: ${getWeekKey()}`;

        try {
            // Format date as YYYY-MM-DD
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0]; // This will give us YYYY-MM-DD
            
            // Create COMPUTE redistribution record
            if (computeAmount > 0) {
                const computeResponse = await fetch('/api/redistributions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        wallet: publicKey.toString(),
                        token: 'COMPUTE',
                        amount: computeAmount,
                        date: formattedDate,
                        swarmId: swarmId
                    })
                });

                if (!computeResponse.ok) {
                    const error = await computeResponse.json();
                    throw new Error(`COMPUTE record creation failed: ${error.details || error.error}`);
                }
            }

            // Create UBC redistribution record
            if (ubcAmount > 0) {
                const ubcResponse = await fetch('/api/redistributions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        wallet: publicKey.toString(),
                        token: 'UBC',
                        amount: ubcAmount,
                        date: formattedDate,
                        swarmId: swarmId
                    })
                });

                if (!ubcResponse.ok) {
                    const error = await ubcResponse.json();
                    throw new Error(`UBC record creation failed: ${error.details || error.error}`);
                }
            }

            // Send Telegram notification
            await fetch(`https://api.telegram.org/bot7728404959:AAHoVX05vxCQgzxqAJa5Em8i5HCLs2hJleo/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: -4680349356,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

            toast.success(
                <div className="relative transform transition-all cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-pink-500/20 blur-xl animate-pulse" />
                    
                    <div className="relative p-4 space-y-4">
                        <div className="flex justify-center">
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                <svg 
                                    className="w-6 h-6 text-green-400 animate-[bounce_1s_ease-in-out_1]" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M5 13l4 4L19 7" 
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-white mb-1">
                                Claim Registered Successfully!
                            </h3>
                            <p className="text-white/60 text-sm">
                                for {swarm?.name}
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-lg p-3 space-y-2 backdrop-blur-sm border border-white/10">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white/60">$COMPUTE</span>
                                <span className="font-semibold text-green-400">
                                    {computeAmount.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white/60">$UBC</span>
                                <span className="font-semibold text-yellow-400">
                                    {ubcAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-center justify-center text-sm text-white/60 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                            <svg 
                                className="w-4 h-4 text-blue-400 animate-pulse" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                            <span>Transfer will arrive within 1 to 24 hours</span>
                        </div>
                    </div>
                </div>,
                {
                    duration: 8000,
                    className: "transform-gpu",
                    position: "top-center",
                    dismissible: true,
                    onDismiss: () => {
                        toast.dismiss();
                    },
                    style: {
                        background: "rgba(0, 0, 0, 0.8)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "1rem",
                        padding: "1rem",
                        minWidth: "380px",
                        animation: "custom-bounce 0.5s ease-out",
                        cursor: "pointer"
                    }
                }
            );

            sessionStorage.setItem(claimKey, 'true');
            setIsClaimed(true);

        } catch (error) {
            console.error('Error sending claim notification:', error);
            toast.error('Error submitting claim');
        }
    };

    return (
        <div className="w-full flex justify-end">
            <Button 
                variant="secondary" 
                size="sm"
                className="bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 hover:text-violet-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleClaim}
                disabled={isDisabled || isClaimed || isLoading}
                title={
                    isLoading ? "Checking claim status..." :
                    isDisabled ? "Minimum 10 $UBC required to claim" : 
                    isClaimed ? "Already claimed this week" : 
                    undefined
                }
            >
                {isLoading ? "Checking..." :
                 isDisabled ? "Below Minimum" : 
                 isClaimed ? "Claimed" : 
                 "Claim"}
            </Button>
        </div>
    );
};

export const columns: ColumnDef<DividendPayment>[] = [
    {
        accessorKey: 'swarm_id',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Swarm" />
        ),
        minSize: 250,
        cell: ({ row }) => {
            const swarmId = row.getValue('swarm_id') as string;
            return <SwarmCell swarmId={swarmId} />;
        }
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => (
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="font-bold">{IntlNumberFormat(row.original.ubcAmount)}</span>
                    <span className="metallic-text-ubc">$UBC</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-bold">{IntlNumberFormat(row.getValue('amount'))}</span>
                    <span className="metallic-text">$COMPUTE</span>
                </div>
            </div>
        )
    },
    {
        accessorKey: 'timestamp',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: () => {
            const getLastThursday = () => {
                const today = new Date();
                const utcHours = today.getUTCHours();
                const day = today.getDay(); // 0 is Sunday, 4 is Thursday
                
                // If today is Thursday (day 4) and it's before 6pm UTC, 
                // go back one week to get the previous Thursday
                const diff = day === 4 && utcHours < 18 
                    ? -7 // Go back a full week on Thursday before 6pm UTC
                    : day <= 4 ? 4 - day - 7 : 4 - day; // Normal calculation for other days
                
                const lastThursday = new Date(today);
                lastThursday.setDate(today.getDate() + diff);
                
                return lastThursday;
            };
            
            return (
                <p className="text-muted whitespace-nowrap">
                    {getLastThursday().toLocaleDateString()}
                </p>
            );
        }
    },
    {
        id: 'actions',
        header: () => null,
        cell: ActionCell
    }

];
