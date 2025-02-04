'use client'

const getSwarmUsingPoolId = (poolId: string): { id: string; name: string; wallet?: string } | null => {
    const swarmMap: Record<string, { id: string; name: string; wallet: string }> = {
        'FwJfuUfrX91VH1Li4PJWCNXXRR4gUXLkqbEgQPo6t9fz': {
            id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
            name: 'KinKong',
            wallet: 'BQxsFSHqkwxnhYwW1YqhS6eXvbDp6YUhqiWrGvnB3UBE'
        },
        'AaFvJBvjuCTs93EVNYqMcK5upiTaTh33SV7q4hjaPFNi': {
            id: 'forge-partner-id',
            name: 'XForge',
            wallet: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1'
        },
        '37u532qgHbjUHic6mQK51jkT3Do7qkWLEUQCx22MDBD8': {
            id: 'kinos-partner-id',
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
import { useEffect, useState } from "react";
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
            const pda = getShareholderPDA(program.programId, ownerPublicKey, poolPubkey) as PublicKey;
    
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

            console.log('Starting RPC data fetch...');

            // Batch all position fetches into a single request
            const fetchWithRetry = async (attempt = 0) => {
                try {
                    setIsLoading(true);
                    const positions: PositionData[] = [];
                    
                    // Fetch all positions in parallel
                    const positionPromises = poolIds.map(async poolId => {
                        if (!poolId) return null;
                        
                        try {
                            const [position, poolData] = await Promise.all([
                                getPosition(publicKey as PublicKey, poolId),
                                program.account.pool.fetch(new PublicKey(poolId))
                            ]);

                            if (!position) return null;

                            const swarm = swarmData[poolId];
                            if (!swarm) return null;

                            const soldShares = poolData.totalShares.toNumber() - poolData.availableShares.toNumber();

                            return {
                                swarm_id: swarm.id,
                                number_of_shares: position.shares.toNumber(),
                                total_shares: soldShares,
                                last_dividend_payment: 0
                            };
                        } catch (error: unknown) {
                            console.error(`Error fetching data for pool ${poolId}:`, error);
                            return null;
                        }
                    });

                    // Wait for all position fetches to complete
                    const results = await Promise.all(positionPromises);
                    
                    // Filter out null results and set investments
                    setInvestments(results.filter((pos): pos is PositionData => pos !== null));
                    setIsLoading(false);
                } catch (error: unknown) {
                    if (error instanceof Error && 
                        (error.message?.includes('429') || error.message?.includes('exceeded limit'))) {
                        if (attempt < MAX_RETRIES) {
                            console.log(`Rate limit hit, retrying in ${RETRY_DELAY}ms...`);
                            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                            return fetchWithRetry(attempt + 1);
                        }
                    }
                    console.error('Error fetching portfolio data:', error instanceof Error ? error.message : 'Unknown error');
                    setError(new Error("Unable to load portfolio data. Please try again later."));
                    setIsLoading(false);
                }
            };

            await fetchWithRetry();
        };

        fetchData();
        // eslint-disable-next-line
    }, [publicKey, connected]);

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
