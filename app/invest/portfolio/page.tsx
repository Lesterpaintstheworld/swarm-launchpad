'use client'

import { Investment } from '@/types/investments';
import { DividendPayments } from "@/components/portfolio/dividendPayments";
import { Investments } from "@/components/portfolio/investments";
import { PortfolioOverview } from "@/components/portfolio/overview";
import { useLaunchpadProgram } from "@/hooks/useLaunchpadProgram";
import type { Ubclaunchpad } from "@/hooks/useLaunchpadProgram/ubclaunchpad";
import { Program } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { getShareholderPDA } from "@/hooks/useLaunchpadProgram/utils";

interface SwarmData {
    id: string;
    name: string;
    pool?: string;
    image: string;
}

interface PositionData {
    id: string;
    number_of_shares: number;
    total_shares: number;
    last_dividend_payment: number;
    swarm_id: string;
}

interface SwarmData {
    id: string;
    pool?: string;
}

export default function Portfolio() {
    const { connected, publicKey } = useWallet();
    const { program } = useLaunchpadProgram() as {
        program: Program<Ubclaunchpad>
    };
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [swarmData, setSwarmData] = useState<Record<string, SwarmData>>({});
    const [poolIds, setPoolIds] = useState<string[]>([]);

    useEffect(() => {
        async function fetchSwarmData() {
            try {
                const response = await fetch('/api/swarms');
                const data = await response.json();
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
            }
        }
        fetchSwarmData();
    }, []);

    useEffect(() => {
        if (!connected || !publicKey || poolIds.length < 1) {
            return;
        }

        const getPosition = async (ownerPublicKey: PublicKey, poolId: string) => {
            const poolPubkey = new PublicKey(poolId);
            const pda = getShareholderPDA(program.programId, ownerPublicKey, poolPubkey);
            
            try {
                const shareholderData = await program.account.shareholder.fetch(pda);
                return shareholderData;
            } catch (error: unknown) {
                if (error instanceof Error && error.message.includes('Account does not exist')) {
                    return null;
                }
                throw error;
            }
        };

        const fetchData = async () => {
            const MAX_RETRIES = 3;
            const RETRY_DELAY = 1000; // 1 second

            const fetchWithRetry = async (attempt = 0) => {
                try {
                    setIsLoading(true);
                    const positions: PositionData[] = [];
                    
                    for(let i = 0; i < poolIds.length; i++) {
                        const poolId = poolIds[i];
                        if(!poolId) { continue; }
                        
                        try {
                            const position = await getPosition(publicKey as PublicKey, poolId);
                            if(!position) {
                                continue;
                            }
                            
                            const poolPubkey = new PublicKey(poolId);
                            const poolData = await program.account.pool.fetch(poolPubkey);
                
                            const swarm = swarmData[poolId];
                            if (!swarm) {
                                console.error(`No swarm found for pool ID: ${poolId}`);
                                continue;
                            }
                
                            const soldShares = poolData.totalShares.toNumber() - poolData.availableShares.toNumber();

                            positions.push({
                                swarm_id: swarm.id,
                                number_of_shares: position?.shares.toNumber() || 0,
                                total_shares: soldShares,
                                last_dividend_payment: 0
                            });
                        } catch (err) {
                            // Check if it's a rate limit error
                            if (err.message?.includes('429') || err.message?.includes('exceeded limit')) {
                                if (attempt < MAX_RETRIES) {
                                    console.log(`Rate limit hit, retrying in ${RETRY_DELAY}ms...`);
                                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                                    return fetchWithRetry(attempt + 1);
                                }
                            }
                            throw err;
                        }
                    }
                    
                    setInvestments(positions);
                    setIsLoading(false);
                } catch (err) {
                    if (err.message?.includes('429') || err.message?.includes('exceeded limit')) {
                        if (attempt < MAX_RETRIES) {
                            console.log(`Rate limit hit, retrying in ${RETRY_DELAY}ms...`);
                            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                            return fetchWithRetry(attempt + 1);
                        }
                    }
                    console.error('Error fetching portfolio data:', err);
                    setError(new Error("Unable to load portfolio data. Please try again later."));
                    setIsLoading(false);
                }
            };

            await fetchWithRetry();
        };

        fetchData();
        // eslint-disable-next-line
    }, [publicKey, connected]);

    if (isLoading) return (
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
