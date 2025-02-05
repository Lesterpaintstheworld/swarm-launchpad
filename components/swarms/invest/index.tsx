'use client'

const COLORS = ['#ef4444', '#22c55e', '#3b82f6']; // red, green, blue

const getSwarmUsingPoolId = (poolId: string): { id: string; name: string; wallet?: string } | null => {
    const swarmMap: Record<string, { id: string; name: string; wallet: string }> = {
        'FwJfuUfrX91VH1Li4PJWCNXXRR4gUXLkqbEgQPo6t9fz': {
            id: 'kinkong',
            name: 'KinKong',
            wallet: 'BQxsFSHqkwxnhYwW1YqhS6eXvbDp6YUhqiWrGvnB3UBE'
        },
        'AaFvJBvjuCTs93EVNYqMcK5upiTaTh33SV7q4hjaPFNi': {
            id: 'xforge',
            name: 'XForge',
            wallet: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1'
        },
        '37u532qgHbjUHic6mQK51jkT3Do7qkWLEUQCx22MDBD8': {
            id: 'kinos',
            name: 'KinOS',
            wallet: '6MxUwQisBsEQKAWkXQPnVh3L2TZfQBFY3DXr8RaXDYet'
        }
    } as const;

    return (poolId in swarmMap) ? swarmMap[poolId as keyof typeof swarmMap] : null;
};

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/shadcn/button";
import { ConnectButton } from "@/components/solana/connectButton";
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Props as RechartsProps } from 'recharts/types/component/DefaultLegendContent';
import { Copy } from 'lucide-react';

interface CustomPayload {
    value: string;
    payload: {
        name: string;
        value: number;
        color: string;
        percentage?: string;
    };
}

interface LegendEntry {
    value: string;
    color: string;
    payload: {
        name: string;
        value: number;
        color: string;
        percentage?: string;
    };
}
import { calculateSharePrice, cn, IntlNumberFormat, IntlNumberFormatCompact } from "@/lib/utils";
import { toast } from 'sonner';
import { useWallet } from "@solana/wallet-adapter-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useLaunchpadProgramAccount } from "@/hooks/useLaunchpadProgram";

const getSwarmStage = (swarmType: string) => {
    console.log('Getting stage for swarm type:', swarmType);
    const stage = (() => {
        switch (swarmType?.toLowerCase()) {
            case 'partner': return 2;    // Partner Swarm (🤝)
            case 'early': return 1;      // Early Swarm (🚀) 
            case 'inception': return 0;  // Inception Swarm (🌱)
            default: return 0;
        }
    })();
    console.log('Calculated stage:', stage);
    return stage;
};

interface SwarmInvestCardProps {
    pool: string;
    className?: string;
    marketCapOnly?: boolean;
    amountRaisedOnly?: boolean;
    priceInUsd?: number;
    weeklyRevenuePerShare?: {
        compute: number;
        ubc: number;
    };
}

const SwarmInvestCard = ({ 
    pool, 
    className, 
    marketCapOnly, 
    amountRaisedOnly,
    priceInUsd,
    weeklyRevenuePerShare 
}: SwarmInvestCardProps) => {
    const { connected } = useWallet();
    const [numShares, setNumShares] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    interface SwarmDetails {
        id: string;
        name: string;
        description?: string;
        launchDate?: string;
        team?: Array<{
            name: string;
            picture: string;
            telegram?: string;
            X?: string;
        }>;
        links?: Array<{
            name: string;
            url: string;
        }>;
        weeklyRevenue?: number;
        totalRevenue?: number;
        swarmType?: string;
        wallet?: string;
        X?: string;
    }

    const [swarm, setSwarm] = useState<SwarmDetails | null>(null);
    const isBeforeLaunch: boolean = !!(swarm?.launchDate && new Date(swarm.launchDate) > new Date());

    useEffect(() => {
        function fetchSwarm() {
            const swarmId = getSwarmUsingPoolId(pool)?.id;
            if (!swarmId) {
                console.error('Could not find swarm ID for pool:', pool);
                return;
            }
            
            fetch(`/api/swarms/${swarmId}`)
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch swarm');
                    return response.json();
                })
                .then(data => {
                    console.log('Fetched swarm data:', data);
                    setSwarm(data);
                })
                .catch(error => {
                    console.error('Error fetching swarm:', error);
                });
        }
        
        fetchSwarm();
    }, [pool]);
    const [data, setData] = useState({
        totalSupply: 0,
        remainingSupply: 0,
        pricePerShare: 0,
        frozen: true,
    });

    const { poolAccount, purchaseShares } = useLaunchpadProgramAccount({ poolAddress: pool });

    useEffect(() => {
        console.log('Pool Account Data:', poolAccount);
        
        if (poolAccount.error) {
            console.error('Pool Account Error:', poolAccount.error);
        }
        
        if (poolAccount.data) {
            try {
                const totalSupply = poolAccount.data.totalShares.toNumber();
                const remainingSupply = poolAccount.data.availableShares.toNumber();
                const soldShares = totalSupply - remainingSupply;
                const currentPrice = calculateSharePrice(soldShares);
                
                console.log('Price calculation:', {
                    totalSupply,
                    remainingSupply,
                    soldShares,
                    currentPrice
                });
                
                setData({
                    totalSupply: totalSupply,
                    remainingSupply: remainingSupply,
                    pricePerShare: currentPrice,
                    frozen: poolAccount.data.isFrozen || false,
                });
            } catch (error) {
                console.error('Error processing pool data:', error);
            }
        }
    }, [poolAccount]);

    const handleSharesInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value.replace(/,/g, ''));
        if (isNaN(value) || value < 0 || value > data.remainingSupply) return;
        
        const totalPrice = value * data.pricePerShare;
        console.log('Share input calculation:', {
            shares: value,
            pricePerShare: data.pricePerShare,
            totalPrice
        });
        
        setPrice(totalPrice);
        setNumShares(value);
    };

    const handleQuickAmount = (amount: number) => {
        if (amount > data.remainingSupply) return;
        const totalPrice = amount * data.pricePerShare;
        
        console.log('Quick amount calculation:', {
            amount,
            pricePerShare: data.pricePerShare,
            totalPrice
        });
        
        setNumShares(amount);
        setPrice(totalPrice);
    };

    const [revenueData, setRevenueData] = useState([
        { name: 'Revenue Burned', value: 50, color: '#ef4444' },  // red-500
        { name: 'Revenue Distributed', value: 10, color: '#22c55e' }, // green-500
        { name: 'Team', value: 40, color: '#3b82f6' }  // blue-500
    ]);

    useEffect(() => {
        async function fetchSwarmData() {
            try {
                const response = await fetch(`/api/swarms/${swarm?.id}`);
                if (response.ok) {
                    const swarmData = await response.json();
                    setRevenueData([
                        { name: 'Revenue Burned', value: 50, color: '#ef4444' },
                        { name: 'Revenue Distributed', value: swarmData.revenueShare || 10, color: '#22c55e' },
                        { name: 'Team', value: 50 - (swarmData.revenueShare || 10), color: '#3b82f6' }
                    ]);
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error('Error fetching swarm data:', error.message);
                } else {
                    console.error('Unknown error fetching swarm data');
                }
            }
        }

        if (swarm?.id) {
            fetchSwarmData();
        }
    }, [swarm?.id]);

    const handleBuy = async () => {
        if (!numShares || numShares <= 0) {
            toast.error("Please enter a valid number of shares");
            return;
        }

        setIsLoading(true);
        const calculatedCostInBaseUnits = Math.floor(price * Math.pow(10, 6));
            
        try {
            const result = await purchaseShares.mutateAsync({ 
                numberOfShares: numShares, 
                calculatedCost: calculatedCostInBaseUnits
            });

            // Webhook notification
            try {
                const swarmDetails = getSwarmUsingPoolId(pool);
                await fetch('https://nlr.app.n8n.cloud/webhook/buybot', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        swarmName: swarmDetails?.name || 'Unknown Swarm',
                        swarmId: swarmDetails?.id || 'unknown',
                        numberOfShares: numShares,
                        pricePerShare: data.pricePerShare,
                        totalCost: price,
                        poolAddress: pool,
                        timestamp: new Date().toISOString(),
                        transactionSignature: result
                    })
                });
                console.log('Buy notification sent successfully');
            } catch (webhookError) {
                console.error('Failed to send buy notification:', webhookError);
                // Don't throw here - we still want to complete the transaction flow
            }

            setNumShares(0);
            setPrice(0);
            toast.success(`Successfully purchased ${numShares} shares!`);
        } catch (error) {
            console.error('Purchase error:', error);
            toast.error(error instanceof Error ? error.message : 'Transaction failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (marketCapOnly) {
        const marketCap = (data.totalSupply - data.remainingSupply) * data.pricePerShare;
        if (priceInUsd) {
            // Explicitly show calculation for debugging
            console.log('Market Cap Calculation:', {
                marketCap,
                priceInUsd,
                result: marketCap * priceInUsd
            });
            return IntlNumberFormatCompact(marketCap * priceInUsd);
        }
        return IntlNumberFormatCompact(marketCap);
    }

    if (amountRaisedOnly) {
        const soldShares = data.totalSupply - data.remainingSupply;
        let totalRaised = 0;
        for (let i = 0; i < soldShares; i++) {
            const cycle = Math.floor(i / 5000);
            const base = Math.pow(1.35, cycle);
            totalRaised += base;
        }
        if (priceInUsd) {
            // Explicitly show calculation for debugging
            console.log('Amount Raised Calculation:', {
                totalRaised,
                priceInUsd,
                result: totalRaised * priceInUsd
            });
            return IntlNumberFormatCompact(totalRaised * priceInUsd);
        }
        return IntlNumberFormatCompact(Math.floor(totalRaised));
    }

    if (poolAccount.isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-8 bg-white/5 rounded" />
                <div className="h-32 bg-white/5 rounded" />
            </div>
        );
    }

    if (poolAccount.error) {
        return (
            <div className="text-red-400 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                Error loading pool data. Please try again later.
            </div>
        );
    }

    return (
        <div className={cn("space-y-6 w-full", className)}>
            {/* Buy UI Card */}
            <Card className={cn(
                "bg-[#0f172a] p-6 w-full",
                isBeforeLaunch && "opacity-40 pointer-events-none select-none"
            )}>
                {/* Header section */}
                <div className="flex justify-between items-start mb-8">
                    <h2 className="text-2xl font-bold text-white">Purchase Swarm Shares</h2>
                    <div className="text-right">
                        <p className="text-xs text-slate-400 mb-1">CURRENT PRICE</p>
                        <p className="text-2xl font-bold flex items-center gap-1">
                            <span className="text-violet-400">{IntlNumberFormat(data.pricePerShare, 1)}</span>
                            <span className="text-sm metallic-text">$COMPUTE</span>
                        </p>
                    </div>
                </div>
            <div className="space-y-6">
                {/* Supply information */}
                <div className="space-y-2">
                    <div className="relative h-4 rounded-full bg-slate-800/50 overflow-hidden">
                        <div 
                            className="absolute h-full bg-gradient-to-l from-blue-500 to-blue-400 rounded-full transition-all duration-300"
                            style={{ 
                                width: `${(data.remainingSupply / data.totalSupply) * 100}%`,
                                right: '0',
                                boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                            }} 
                        />
                        <div 
                            className="absolute h-full w-[2px] bg-white/30 blur-[2px] animate-pulse"
                            style={{ 
                                right: `${(data.remainingSupply / data.totalSupply) * 100}%`,
                                transform: 'translateX(50%)'
                            }}
                        />
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Total Supply</span>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">{IntlNumberFormat(data.totalSupply)}</span>
                            <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                                <span>{Math.round((data.remainingSupply / data.totalSupply) * 100)}%</span>
                                <span>remaining</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Share input section */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm text-slate-300">Amount of Shares</label>
                        <span className="text-sm text-slate-400">
                            Available: {IntlNumberFormat(data.remainingSupply)}
                        </span>
                    </div>
                    
                    <Input
                        type="number"
                        value={numShares || ''}
                        onChange={handleSharesInput}
                        className="w-full bg-slate-800/50 border-slate-700 text-white mb-3"
                        placeholder="0"
                    />

                    {/* Quick amount buttons */}
                    <div className="grid grid-cols-4 gap-2">
                        {[10, 100, 500, 1000].map((amount) => (
                            <Button
                                key={amount}
                                onClick={() => handleQuickAmount(amount)}
                                variant="secondary"
                                className="bg-slate-700 hover:bg-slate-600"
                                disabled={amount > data.remainingSupply}
                            >
                                {amount}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Cost breakdown */}
                <div className="space-y-4 bg-slate-800/50 p-6 rounded-lg">
                    {/* Cost per Share */}
                    <div className="flex justify-between mb-2">
                        <span className="text-slate-300">Cost per Share</span>
                        <div className="flex items-center gap-1">
                            <span>{IntlNumberFormat(data.pricePerShare)}</span>
                            <span className="metallic-text">$COMPUTE</span>
                        </div>
                    </div>

                    {/* Total Cost */}
                    <div className="flex justify-between items-baseline mb-2">
                        <span className="text-slate-300">Total Cost</span>
                        <div className="flex items-center gap-1">
                            <span className="text-2xl font-bold">{IntlNumberFormat(numShares * data.pricePerShare)}</span>
                            <span className="metallic-text text-lg">$COMPUTE</span>
                        </div>
                    </div>

                    {/* Tx Fee */}
                    <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                        <span className="text-slate-400">Tx Fee (5%)</span>
                        <div className="flex items-center gap-1">
                            <span className="text-slate-300">{IntlNumberFormat(numShares * data.pricePerShare * 0.05)}</span>
                            <span className="metallic-text-ubc">$UBC</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action button */}
            {connected ? (
                <Button
                    onClick={handleBuy}
                    className={cn(
                        "w-full mt-6 relative overflow-hidden",
                        "bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400",
                        "hover:from-yellow-300 hover:via-orange-300 to-yellow-300",
                        "border-none text-black font-semibold",
                        "transition-all duration-500",
                        "transform hover:scale-[1.02]",
                        "before:absolute before:inset-0",
                        "before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent",
                        "before:translate-x-[-200%] before:animate-[shine_6s_ease-in-out_infinite]",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                        "shadow-[0_0_15px_rgba(234,179,8,0.3)]",
                        "hover:shadow-[0_0_20px_rgba(234,179,8,0.5)]"
                    )}
                    disabled={!numShares || numShares <= 0 || isLoading || isBeforeLaunch}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <span className="animate-spin">⚪</span>
                            Processing...
                        </div>
                    ) : isBeforeLaunch ? (
                        'Launching Soon'
                    ) : (
                        'Purchase Shares'
                    )}
                </Button>
            ) : (
                <ConnectButton className="w-full mt-6" />
            )}

            </Card>

            {/* Swarm Information Card */}
            <Card className="bg-[#0f172a] p-6 w-full">
                <h3 className="text-lg font-semibold text-white mb-4">Swarm Information</h3>

                {/* Weekly Revenue per 1000 shares */}
                {weeklyRevenuePerShare && (
                    <div className="bg-slate-800/30 rounded-lg p-4 mt-4">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-sm text-slate-400">Weekly Revenue per 1000 shares</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white/60">{IntlNumberFormat(weeklyRevenuePerShare.compute)}</span>
                                <span className="text-sm metallic-text">$COMPUTE</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white/60">{IntlNumberFormat(weeklyRevenuePerShare.ubc)}</span>
                                <span className="text-sm metallic-text-ubc">$UBC</span>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Wallet Address */}
                <div className="bg-slate-800/30 rounded-lg p-4 mt-8">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-slate-400">Swarm Wallet</span>
                        <div className="flex items-center gap-2">
                            <a 
                                href={`https://solscan.io/account/${swarm?.wallet}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-slate-300 font-mono hover:text-blue-400 transition-colors"
                            >
                                {swarm?.wallet 
                                    ? `${swarm.wallet.slice(0, 4)}...${swarm.wallet.slice(-4)}`
                                    : "Not available"
                                }
                            </a>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                    const wallet = getSwarmUsingPoolId(pool)?.wallet;
                                    if (wallet) {
                                        navigator.clipboard.writeText(wallet);
                                        toast.success('Wallet address copied to clipboard');
                                    }
                                }}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* X (Twitter) Page */}
                {swarm?.X && (
                    <div className="bg-slate-800/30 rounded-lg p-4 mt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">X (Twitter) Page</span>
                            <Link 
                                href={`https://x.com/${swarm.X}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                @{swarm.X}
                            </Link>
                        </div>
                    </div>
                )}

                {/* Telegram Group */}
                <div className="bg-slate-800/30 rounded-lg p-4 mt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Telegram Group</span>
                        <a 
                            href={`https://t.me/${getSwarmUsingPoolId(pool)?.name.toLowerCase()}_ubc`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            t.me/{getSwarmUsingPoolId(pool)?.name.toLowerCase()}_ubc
                        </a>
                    </div>
                </div>

                {/* Additional stats */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {/* Revenue Distribution Chart */}
                    <div className="bg-slate-800/30 rounded-lg p-4 col-span-2">
                        <span className="text-sm text-slate-400 mb-2 block">Revenue Distribution</span>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={revenueData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={45}
                                        outerRadius={65}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {revenueData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.color}
                                                className="stroke-transparent hover:opacity-80 transition-opacity"
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-slate-900/95 border border-white/10 px-3 py-2 rounded-lg shadow-xl backdrop-blur-sm">
                                                        <p className="text-white font-medium">
                                                            {payload[0].name}
                                                        </p>
                                                        <p className="text-white/60">
                                                            {payload[0].value}%
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        height={36}
                                        content={(props: RechartsProps) => {
                                            const { payload } = props;
                                            if (!payload) return null;
                                            
                                            return (
                                                <ul className="flex flex-wrap gap-4 justify-center mt-4">
                                                    {((payload as unknown) as CustomPayload[]).map((entry, index) => (
                                                        <li key={`item-${index}`} className="flex items-center gap-2">
                                                            <div 
                                                                className="w-3 h-3 rounded-full" 
                                                                style={{ backgroundColor: entry.payload.color }}
                                                            />
                                                            <span className="text-sm">
                                                                {entry.value} ({entry.payload.percentage}%)
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            );
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    
                    {/* Weekly Revenue */}
                    <div className="bg-slate-800/30 rounded-lg p-4">
                        <span className="text-sm text-white/60">Weekly Revenue</span>
                        <div className="flex flex-col gap-2">
                            {/* Total amount */}
                            <div className="flex items-center gap-2">
                                {swarm?.weeklyRevenue ? (
                                    <>
                                        <p className="text-lg font-semibold text-white">
                                            {swarm.weeklyRevenue.toLocaleString()}
                                        </p>
                                        <span className="text-xs metallic-text">$COMPUTE</span>
                                    </>
                                ) : (
                                    <p className="text-lg font-semibold text-white">-</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Total Revenue */}
                    <div className="bg-slate-800/30 rounded-lg p-4">
                        <span className="text-sm text-white/60">Total Revenue</span>
                        <div className="flex flex-col gap-2">
                            {/* Total amount */}
                            <div className="flex items-center gap-2">
                                {swarm?.totalRevenue ? (
                                    <>
                                        <p className="text-lg font-semibold text-white">
                                            {swarm.totalRevenue.toLocaleString()}
                                        </p>
                                        <span className="text-xs metallic-text">$COMPUTE</span>
                                    </>
                                ) : (
                                    <p className="text-lg font-semibold text-white">-</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                {swarm?.team && swarm.team.length > 0 ? (
                    <div className="mt-4">
                        <div className="bg-slate-800/30 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-400">Team</span>
                            </div>
                            <div className="space-y-4">
                                {swarm.team.map((member, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-700">
                                            <Image
                                                src={member.picture}
                                                alt={member.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">{member.name}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                {member.telegram && (
                                                    <a
                                                        href={`https://t.me/${member.telegram}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 3.845-1.362 5.452-.168.676-.336 1.363-.48 1.957-.169.687-.318 1.288-.467 1.81-.151.527-.302.983-.468 1.362-.151.345-.259.527-.366.628-.108.101-.194.151-.259.151-.13 0-.26-.075-.39-.226-.13-.151-.26-.377-.39-.678-.13-.301-.26-.653-.39-1.057-.13-.404-.26-.854-.39-1.349-.13-.495-.26-1.019-.39-1.57-.13-.551-.26-1.127-.39-1.727-.13-.6-.26-1.214-.39-1.84-.13-.626-.26-1.253-.39-1.879-.13-.626-.26-1.24-.39-1.84-.13-.6-.26-1.165-.39-1.694-.13-.529-.26-1.006-.39-1.432-.13-.426-.26-.795-.39-1.108-.13-.313-.26-.551-.39-.714-.13-.163-.26-.244-.39-.244-.065 0-.13.025-.195.075-.065.05-.13.126-.195.226-.065.1-.13.226-.195.377-.065.151-.13.327-.195.527-.065.2-.13.426-.195.677-.065.251-.13.527-.195.828-.065.301-.13.628-.195.983-.065.355-.13.729-.195 1.121-.065.392-.13.804-.195 1.235-.065.431-.13.881-.195 1.349-.065.468-.13.954-.195 1.457-.065.503-.13 1.019-.195 1.547-.065.528-.13 1.069-.195 1.622-.065.553-.13 1.114-.195 1.684-.065.57-.13 1.146-.195 1.728-.065.582-.13 1.165-.195 1.748-.065.583-.13 1.159-.195 1.728-.065.569-.13 1.127-.195 1.674-.065.547-.13 1.082-.195 1.604-.065.522-.13 1.032-.195 1.529-.065.497-.13.982-.195 1.454-.065.472-.13.932-.195 1.38-.065.448-.13.884-.195 1.308-.065.424-.13.836-.195 1.235-.065.399-.13.786-.195 1.159-.065.373-.13.734-.195 1.083-.065.349-.13.686-.195 1.011-.065.325-.13.638-.195.939-.065.301-.13.59-.195.867-.065.277-.13.542-.195.795-.065.253-.13.494-.195.723-.065.229-.13.446-.195.651-.065.205-.13.398-.195.579-.065.181-.13.349-.195.505-.065.156-.13.301-.195.434-.065.133-.13.253-.195.361-.065.108-.13.205-.195.29-.065.085-.13.156-.195.214-.065.058-.13.104-.195.138-.065.034-.13.051-.195.051z"/>
                                                        </svg>
                                                    </a>
                                                )}
                                                {member.X && (
                                                    <a
                                                        href={`https://x.com/${member.X}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                                        </svg>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4">
                        <div className="bg-slate-800/30 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-400">Team</span>
                                <span className="text-xs text-slate-500">Coming Soon</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-700/50 animate-pulse" />
                                <div className="w-8 h-8 rounded-full bg-slate-700/50 animate-pulse" />
                                <div className="w-8 h-8 rounded-full bg-slate-700/50 animate-pulse" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Links Section */}
                {swarm?.links && swarm.links.length > 0 && (
                    <div className="mt-4">
                        <div className="bg-slate-800/30 rounded-lg p-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-sm text-slate-400">Additional Resources</span>
                                {swarm.links.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
                                    >
                                        <span className="text-sm text-blue-400 hover:text-blue-300">
                                            {link.name}
                                        </span>
                                        <svg
                                            className="w-4 h-4 text-slate-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-6">
                    <h4 className="text-sm text-slate-400 mb-4">Development Stage</h4>
                    <div className="relative flex flex-col gap-8">
                        {/* Timeline line */}
                        <div className="absolute left-[11px] top-[24px] bottom-4 w-[2px] bg-gradient-to-b from-blue-500/50 via-slate-700 to-slate-700/50" />
                            
                        {/* Timeline nodes */}
                        {[
                            { 
                                label: 'Inception Swarm', 
                                description: 'Initial concept and development',
                                emoji: '🌱'
                            },
                            { 
                                label: 'Early Swarm', 
                                description: 'Growing revenue and user base',
                                emoji: '🚀'
                            },
                            { 
                                label: 'Partner Swarm', 
                                description: 'Established and scaling',
                                emoji: '🤝'
                            }
                        ].map((stage, index) => {
                            console.log('Swarm data:', swarm);
                            const currentStage = getSwarmStage(swarm?.swarmType || 'inception');
                            console.log('Timeline node index:', index, 'Current stage:', currentStage);
                            const isActive = index <= currentStage;
                            const isCurrent = index === currentStage;

                            return (
                                <div key={stage.label} className="flex items-start gap-4">
                                    <div className="relative">
                                        {/* Background glow for active nodes */}
                                        {isActive && (
                                            <div className="absolute inset-0 bg-blue-500/20 blur-xl transform scale-150" />
                                        )}
                                        
                                        {/* Outer ring */}
                                        <div className={cn(
                                            "w-6 h-6 rounded-full border-2 z-10 relative",
                                            isCurrent ? "border-blue-500" : 
                                            isActive ? "border-slate-400" : 
                                            "border-slate-700",
                                            "bg-[#0f172a]" // Match card background
                                        )}>
                                            {/* Inner dot */}
                                            <div className={cn(
                                                "absolute inset-[4px] rounded-full",
                                                isCurrent ? "bg-blue-500" : 
                                                isActive ? "bg-slate-400" : 
                                                "bg-slate-700"
                                            )} />
                                            
                                            {/* Animated rings for current stage */}
                                            {isCurrent && (
                                                <>
                                                    <div className="absolute inset-0 rounded-full border-2 border-blue-500/50 animate-ping" />
                                                    <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-pulse" />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                        
                                    {/* Content with hover effect */}
                                    <div className={cn(
                                        "flex-1 p-2 rounded-lg transition-colors duration-200",
                                        isActive ? "text-slate-200 hover:bg-slate-800/30" : "text-slate-600 hover:bg-slate-800/10",
                                        "cursor-default"
                                    )}>
                                        <h5 className={cn(
                                            "text-sm font-medium mb-1",
                                            isCurrent && "text-blue-400"
                                        )}>{stage.emoji} {stage.label}</h5>
                                        <p className="text-xs opacity-80">{stage.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>

            {/* Risk Disclosures */}
            <Card className="bg-[#0f172a] p-4 w-full mt-4">
                <h3 className="text-sm font-semibold text-white mb-3">Important Risk Disclosures</h3>
                
                <div className="space-y-4">
                    {/* Market Risks */}
                    <div>
                        <h4 className="text-xs font-semibold text-white/80 mb-1">Market Risks</h4>
                        <ul className="space-y-0.5 text-xs text-white/60">
                            <li>• Share prices may be volatile and can fluctuate significantly</li>
                            <li>• Market liquidity may affect ability to buy or sell shares</li>
                            <li>• Past revenue performance does not guarantee future results</li>
                        </ul>
                    </div>

                    {/* Technical Risks */}
                    <div>
                        <h4 className="text-xs font-semibold text-white/80 mb-1">Technical Risks</h4>
                        <ul className="space-y-0.5 text-xs text-white/60">
                            <li>• System downtime may affect service delivery and revenue generation</li>
                            <li>• Technological changes could impact service competitiveness</li>
                            <li>• Cybersecurity incidents could affect system operations</li>
                        </ul>
                    </div>

                    {/* Regulatory Risks */}
                    <div>
                        <h4 className="text-xs font-semibold text-white/80 mb-1">Regulatory Risks</h4>
                        <ul className="space-y-0.5 text-xs text-white/60">
                            <li>• Changes in AI regulations may affect operations</li>
                            <li>• Cryptocurrency regulations may impact token value</li>
                            <li>• Tax treatment of revenue distributions may vary by jurisdiction</li>
                        </ul>
                    </div>

                    {/* Investment Terms */}
                    <div>
                        <h4 className="text-xs font-semibold text-white/80 mb-1">Investment Terms</h4>
                        <ul className="space-y-0.5 text-xs text-white/60">
                            <li>• 30-day minimum holding period for revenue distribution eligibility</li>
                            <li>• 5% transaction fee applies to all purchases and sales</li>
                            <li>• Revenue distributions subject to available liquidity</li>
                        </ul>
                    </div>
                </div>

                {/* Additional disclaimer */}
                <p className="mt-4 text-[10px] text-white/40 italic">
                    This is not an exhaustive list of risks. Please conduct your own research and consider consulting with financial and legal advisors before investing.
                </p>
            </Card>
        </div>
    )
}

export { SwarmInvestCard }
