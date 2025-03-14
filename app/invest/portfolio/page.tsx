'use client'

// Memory cache for investment data
let cachedData: {
    investments: Investment[];
    timestamp: number;
} | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

import { useState, useEffect } from "react";

interface ShareholderAccount {
    shares: {
        toNumber: () => number;
    };
}

interface PoolAccount {
    totalShares: {
        toNumber: () => number;
    };
    availableShares: {
        toNumber: () => number;
    };
}

interface ProgramAccounts {
    shareholder: {
        fetch(address: PublicKey): Promise<ShareholderAccount>;
    };
    pool: {
        fetch(address: PublicKey): Promise<PoolAccount>;
    };
}

interface ApiError extends Error {
    status?: number;
    message: string;
}

import { Investment } from '@/types/investments';
import { DividendPayments } from "@/components/portfolio/dividendPayments";
import { Investments } from "@/components/portfolio/investments";
import { PortfolioOverview } from "@/components/portfolio/overview";
import { useLaunchpadProgram } from "@/hooks/useLaunchpadProgram";
import { Program, Idl } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getShareholderPDA } from "@/hooks/useLaunchpadProgram/utils";

interface ProgramError extends Error {
    message: string;
}

interface SwarmData {
    id: string;
    name: string;
    pool?: string;
    image: string;
}

interface PositionData {
    swarm_id: string;
    number_of_shares: number;
    total_shares: number;
    last_dividend_payment: number;
}

interface SwarmData {
    id: string;
    pool?: string;
}

export default function Portfolio() {
    const { connected, publicKey } = useWallet();
    const launchpadProgram = useLaunchpadProgram();
    const program = launchpadProgram.program as unknown as {
        account: ProgramAccounts;
        programId: PublicKey;
    };
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [swarmData, setSwarmData] = useState<Record<string, SwarmData>>({});
    const [poolIds, setPoolIds] = useState<string[]>([]);

    const refreshInvestments = () => {
        cachedData = null; // Clear the memory cache
        setIsLoading(true); // This will trigger a re-fetch
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        let timeoutId: NodeJS.Timeout;

        async function fetchSwarmData() {
            if (!isMounted) return;

            try {
                // Set a timeout to abort the request if it takes too long
                timeoutId = setTimeout(() => controller.abort(), 10000);
                
                const response = await fetch('/api/swarms', {
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) throw new Error('Failed to fetch swarm data');
                const data = await response.json();

                if (!isMounted) return;

                const swarmMap: Record<string, SwarmData> = {};
                const pools: string[] = [];

                data.forEach((swarm: SwarmData) => {
                    if (swarm.pool) {
                        swarmMap[swarm.pool] = swarm;
                        pools.push(swarm.pool);
                    }
                });

                setSwarmData(swarmMap);
                setPoolIds(pools);
            } catch (error: any) {
                clearTimeout(timeoutId);
                
                if (error.name === 'AbortError') {
                    console.log('Swarm data fetch aborted');
                    return;
                }
                
                console.error('Error fetching swarm data:', error);
                if (isMounted) {
                    setError(new Error('Failed to fetch swarm data'));
                }
            }
        }

        fetchSwarmData();
        
        return () => {
            isMounted = false;
            controller.abort();
            clearTimeout(timeoutId);
        };
    }, []); // Empty dependency array - only run once on mount

    useEffect(() => {
        let isMounted = true;

        if (!connected || !publicKey || !program || poolIds.length === 0) {
            setIsLoading(false);
            return;
        }

        // Destructure needed dependencies
        const { account: { shareholder, pool }, programId } = program;

        async function fetchPositions() {
            if (!isMounted) return;

            try {
                // Check memory cache first
                if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
                    setInvestments(cachedData.investments);
                    setIsLoading(false);
                    return;
                }

                setIsLoading(true);
                
                // Create a map to track in-progress requests to avoid duplicates
                const poolRequests = new Map();
                const shareholderRequests = new Map();
                
                const positions = await Promise.all(poolIds.map(async (poolId) => {
                    try {
                        const poolPubkey = new PublicKey(poolId);
                        const shareholderPda = getShareholderPDA(
                            programId,
                            publicKey as PublicKey, // Type assertion is safe here because we checked above
                            poolPubkey
                        );

                        if (!shareholderPda) {
                            console.log(`No PDA generated for pool ${poolId}`);
                            return null;
                        }

                        // Reuse pool data promise if we've already started fetching it
                        if (!poolRequests.has(poolId)) {
                            poolRequests.set(
                                poolId, 
                                pool.fetch(poolPubkey)
                                    .catch(err => {
                                        console.error(`Error fetching pool data for ${poolId}:`, err);
                                        return null;
                                    })
                            );
                        }
                        
                        // Reuse shareholder data promise if we've already started fetching it
                        const shareholderKey = shareholderPda.toString();
                        if (!shareholderRequests.has(shareholderKey)) {
                            shareholderRequests.set(
                                shareholderKey,
                                shareholder.fetch(shareholderPda)
                                    .catch((e: Error): ShareholderAccount | null => {
                                        if (e.message.includes('Account does not exist')) {
                                            return null;
                                        }
                                        console.error(`Error fetching shareholder data for ${shareholderKey}:`, e);
                                        return null;
                                    })
                            );
                        }

                        // Fetch both shareholder and pool data concurrently
                        const [shareholderData, poolData] = await Promise.all([
                            shareholderRequests.get(shareholderKey),
                            poolRequests.get(poolId)
                        ]);

                        // Skip if no shares owned or missing data
                        if (!shareholderData || !poolData || shareholderData.shares.toNumber() === 0) {
                            return null;
                        }

                        const swarm = swarmData[poolId];
                        if (!swarm) {
                            console.log(`No swarm data found for pool ${poolId}`);
                            return null;
                        }

                        const totalShares = poolData.totalShares.toNumber();
                        const availableShares = poolData.availableShares.toNumber();
                        const soldShares = totalShares - availableShares;

                        return {
                            swarm_id: swarm.id,
                            number_of_shares: shareholderData.shares.toNumber(),
                            total_shares: soldShares,
                            last_dividend_payment: 0
                        };
                    } catch (error) {
                        console.error(`Error processing pool ${poolId}:`, error);
                        return null;
                    }
                }));

                if (!isMounted) return;

                const validPositions = positions.filter((pos): pos is Investment =>
                    pos !== null && pos.number_of_shares > 0
                );

                // Update memory cache
                cachedData = {
                    investments: validPositions,
                    timestamp: Date.now()
                };

                setInvestments(validPositions);
            } catch (error) {
                console.error('Error fetching positions:', error);
                if (isMounted) {
                    setError(new Error('Failed to fetch investment positions'));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchPositions();

        // Use a more efficient approach for refreshing data
        // Instead of using setInterval which can cause overlapping calls,
        // we'll use setTimeout and only schedule the next refresh after the current one completes
        let refreshTimeout: NodeJS.Timeout;
        
        function scheduleNextRefresh() {
            refreshTimeout = setTimeout(() => {
                if (isMounted) {
                    fetchPositions().finally(() => {
                        if (isMounted) {
                            scheduleNextRefresh();
                        }
                    });
                }
            }, CACHE_DURATION);
        }
        
        // Schedule the first refresh
        scheduleNextRefresh();

        return () => {
            isMounted = false;
            clearTimeout(refreshTimeout);
        };
    }, [connected, poolIds, program, publicKey, swarmData]);

    if (!connected) return (
        <main className="container view">
            <div className="h-80 flex flex-col items-center justify-center gap-1">
                <h2 className="text-center">Please connect your wallet</h2>
            </div>
        </main>
    );

    if (isLoading && connected) return (
        <main className="container view">
            <div className="h-80 flex flex-col items-center justify-center gap-1">
                <h2 className="text-center">Loading portfolio...</h2>
            </div>
        </main>
    );

    if (error) return (
        <main className="container view">
            <div className="h-80 flex flex-col items-center justify-center gap-1">
                <h2 className="text-center">Error loading portfolio</h2>
                <p className="text-center text-balance text-muted text-lg">
                    {error.message}
                </p>
            </div>
        </main>
    );

    return (
        <main className="container view">
            <div className="h-80 flex flex-col items-center justify-center gap-1">
                <h2 className="text-center">Your Portfolio</h2>
                <p className="text-center text-balance text-muted text-lg">
                    Manage your AI swarm investments, and track returns
                </p>
            </div>
            <Investments
                className="mb-6"
                investments={investments}
            />
            <PortfolioOverview
                investments={investments.length > 0 ? investments : []}
                className="mb-6"
            />
            <DividendPayments className="mb-12" />
        </main>
    )
}
