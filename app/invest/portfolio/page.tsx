'use client'

import { DividendPayments } from "@/components/portfolio/dividendPayments";
import { Investments } from "@/components/portfolio/investments";
import { PortfolioOverview } from "@/components/portfolio/overview";
import { useLaunchpadProgram } from "@/hooks/useLaunchpadProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { SwarmData, getSwarmUsingId } from "@/data/swarms/info";
import { extractKey } from "@/lib/utils";
import { getShareholderPDA } from "@/hooks/useLaunchpadProgram/utils";

interface PositionData {
    swarm_id: string;
    number_of_shares: number;
    total_shares: number;
    last_dividend_payment: number;
}

type Investment = PositionData;

export default function Portfolio() {
    const { connected, publicKey } = useWallet();
    const { program } = useLaunchpadProgram();
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const poolIds: string[] = extractKey(SwarmData, 'pool') || [];

    useEffect(() => {
        if (!connected || !publicKey || poolIds.length < 1) {
            return;
        }

        const getPosition = async (ownerPublicKey: PublicKey, poolId: string) => {
            const poolPubkey = new PublicKey(poolId);
            const pda = getShareholderPDA(program.programId, ownerPublicKey, poolPubkey);
            
            try {
                const shareholderData = await program.account.shareholder.fetch(pda as PublicKey);
                return shareholderData;
            } catch (error) {
                if ((error as Error).message.includes('Account does not exist')) {
                    return null;
                }
                throw error;
            }
        };

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const positions: PositionData[] = [];
                
                for(let i = 0; i < poolIds.length; i++) {
                    const poolId = poolIds[i];
                    if(!poolId) { continue; }
                    
                    const position = await getPosition(publicKey as PublicKey, poolId);
                    if(!position) {
                        continue;
                    }
                    
                    const poolPubkey = new PublicKey(poolId);
                    const poolData = await program.account.pool.fetch(poolPubkey);
            
                    const swarm = getSwarmUsingPoolId(poolId);
                    if (!swarm) {
                        console.error(`No swarm found for pool ID: ${poolId}`);
                        continue;
                    }
            
                    positions.push({
                        swarm_id: swarm.id,
                        number_of_shares: position?.shares.toNumber() || 0,
                        total_shares: poolData.totalShares.toNumber() || 0,
                        last_dividend_payment: 0
                    });
                }
                
                setInvestments(positions);
            } catch (err) {
                setError(err as Error);
                console.error('Error fetching portfolio data:', err);
            } finally {
                setIsLoading(false);
            }
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
