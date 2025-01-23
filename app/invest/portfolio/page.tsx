'use client'

import { DividendPayments } from "@/components/portfolio/dividendPayments";
import { Investments } from "@/components/portfolio/investments";
import { PortfolioOverview } from "@/components/portfolio/overview";
import { useLaunchpadProgram } from "@/hooks/useLaunchpadProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { getSwarmUsingPoolId, SwarmData } from "@/data/swarms/info";
import { extractKey } from "@/lib/utils";
import { getShareholderPDA } from "@/hooks/useLaunchpadProgram/utils";
import { redirect } from "next/navigation";

type Investment = {
    swarm_id: string;
    number_of_shares: number;
    total_shares: number;
    last_dividend_payment: number;
}

export default function Portfolio() {

    const { connected, publicKey } = useWallet();
    const { program } = useLaunchpadProgram();
    const [investments, setInvestments] = useState<Investment[]>([]);

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
            // eslint-disable-next-line
            const positions: any[] = [];
            for(let i = 0; i < poolIds.length; i++) {
                const poolId = poolIds[i];
                const poolPubkey = new PublicKey(poolId);
                const position = await getPosition(publicKey as PublicKey, poolId);
                if(!position) {
                    continue;
                }
                const poolData = await program.account.pool.fetch(poolPubkey);
                positions.push({
                    swarm_id: getSwarmUsingPoolId(poolId).id,
                    number_of_shares: position?.shares.toNumber() || 0,
                    total_shares: poolData.totalShares.toNumber() || 0,
                    last_dividend_payment: 0
                });
            };
            setInvestments(positions);
            
        };

        fetchData();
    }, [publicKey, connected, poolIds, program.account.pool, program.account.shareholder, program.programId]);

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
