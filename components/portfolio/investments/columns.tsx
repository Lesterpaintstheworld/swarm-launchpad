'use client'

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/datatable/columnHeader";
import { Investment } from "@/components/portfolio/investments";
import Image from "next/image";
import { IntlNumberFormat } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

// Create a cache object outside component to persist between renders
const swarmCache: Record<string, any> = {};

// Add a simple request queue to prevent too many simultaneous requests
const requestQueue: string[] = [];
let isProcessingQueue = false;
let queueProcessorTimeout: NodeJS.Timeout | null = null;

const processQueue = async () => {
    // If already processing or queue is empty, don't start a new process
    if (isProcessingQueue || requestQueue.length === 0) return;
    
    isProcessingQueue = true;
    const BATCH_SIZE = 3; // Process 3 requests at a time
    const DELAY = 1000; // 1 second delay between batches

    try {
        while (requestQueue.length > 0) {
            const batch = requestQueue.splice(0, BATCH_SIZE);
            await Promise.all(batch.map(async (swarmId) => {
                try {
                    if (!swarmCache[swarmId]) {
                        const response = await fetch(`/api/swarms/${swarmId}`);
                        if (response.ok) {
                            const data = await response.json();
                            swarmCache[swarmId] = data;
                        }
                    }
                } catch (error) {
                    console.error(`Error fetching swarm ${swarmId}:`, error);
                }
            }));

            if (requestQueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, DELAY));
            }
        }
    } catch (error) {
        console.error("Error processing queue:", error);
    } finally {
        isProcessingQueue = false;
    }
};

// Debounced queue processor to prevent multiple calls
const scheduleQueueProcessing = () => {
    if (queueProcessorTimeout) {
        clearTimeout(queueProcessorTimeout);
    }
    queueProcessorTimeout = setTimeout(() => {
        processQueue();
        queueProcessorTimeout = null;
    }, 100);
};

const SwarmCell = ({ swarmId }: { swarmId: string }) => {
    const [swarm, setSwarm] = useState<{ name: string; image: string; role?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchSwarm = async () => {
            // Check cache first
            if (swarmCache[swarmId]) {
                if (isMounted) {
                    setSwarm(swarmCache[swarmId]);
                    setIsLoading(false);
                }
                return;
            }

            // Add to queue if not in cache and not already in queue
            if (!requestQueue.includes(swarmId)) {
                requestQueue.push(swarmId);
                scheduleQueueProcessing();
            }

            // Poll cache until data is available, but with a maximum timeout
            const checkCache = setInterval(() => {
                if (swarmCache[swarmId] && isMounted) {
                    setSwarm(swarmCache[swarmId]);
                    setIsLoading(false);
                    clearInterval(checkCache);
                }
            }, 200); // Reduced polling frequency
            
            // Set a timeout to stop polling after 10 seconds to prevent infinite polling
            const maxWaitTimeout = setTimeout(() => {
                clearInterval(checkCache);
                if (isMounted) {
                    setIsLoading(false);
                }
            }, 10000);

            // Cleanup
            return () => {
                clearInterval(checkCache);
                clearTimeout(maxWaitTimeout);
            };
        };

        fetchSwarm();

        return () => {
            isMounted = false;
        };
    }, [swarmId]);

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

export const columns: ColumnDef<Investment>[] = [
    {
        accessorKey: 'swarm_id',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Swarm" />
        ),
        minSize: 200,
        cell: ({ row }) => <SwarmCell swarmId={row.getValue('swarm_id')} />
    },
    {
        accessorKey: 'number_of_shares',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Shares Owned" />
        ),
        cell: ({ row }) => (
            <p className="font-bold">{IntlNumberFormat(row.getValue('number_of_shares'))}</p>
        )
    },
    {
        accessorKey: 'ownership_percentage',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Ownership %" />
        ),
        cell: ({ row }) => {
            const percentage = (Number(row.original.number_of_shares) / Number(row.original.total_shares) * 100);
            
            let tierEmoji = '';
            let tierName = '';
            
            // Whale Tiers
            if (percentage > 5) {
                tierEmoji = '🐋';
                tierName = 'Mega Whale';
            } else if (percentage > 1) {
                tierEmoji = '🐳';
                tierName = 'Whale';
            } else if (percentage > 0.5) {
                tierEmoji = '🐋';
                tierName = 'Mini Whale';
            }
            // Mid Tiers
            else if (percentage > 0.1) {
                tierEmoji = '🐬';
                tierName = 'Dolphin';
            } else if (percentage > 0.01) {
                tierEmoji = '🐠';
                tierName = 'Fish';
            }
            // Small Tiers
            else {
                tierEmoji = '🦐';
                tierName = 'Shrimp';
            }

            return (
                <div className="flex flex-col">
                    <p className="text-muted">{percentage.toFixed(2)}%</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>{tierEmoji}</span>
                        <span>{tierName}</span>
                    </div>
                </div>
            )
        }
    }
];
