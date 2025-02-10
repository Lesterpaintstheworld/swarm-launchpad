'use client'

// Memory cache for investment data
let cachedData: {
    investments: Investment[];
    timestamp: number;
} | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

import { useState, useEffect } from "react";

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

        async function fetchSwarmData() {
            if (!isMounted) return;
            
            try {
                const response = await fetch('/api/swarms');
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
                console.error('Error fetching swarm data:', error);
                if (isMounted) {
                    setError(new Error('Failed to fetch swarm data'));
                }
            }
        }

        fetchSwarmData();
        return () => {
            isMounted = false;
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

                        // Fetch both shareholder and pool data concurrently
                        const [shareholderData, poolData] = await Promise.all([
                            shareholder.fetch(shareholderPda)
                                .catch(e => {
                                    if (e.message.includes('Account does not exist')) {
                                        return null;
                                    }
                                    throw e;
                                }),
                            pool.fetch(poolPubkey)
                        ]);

                        // Skip if no shares owned
                        if (!shareholderData || shareholderData.shares.toNumber() === 0) {
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
        
        // Set up manual refresh interval
        const refreshInterval = setInterval(fetchPositions, CACHE_DURATION);

        return () => {
            isMounted = false;
            clearInterval(refreshInterval);
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
