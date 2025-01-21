'use client'

import { DividendPayments } from "@/components/portfolio/dividendPayments";
import { Investments } from "@/components/portfolio/investments";
import { PortfolioOverview } from "@/components/portfolio/overview";
import { useInvestProgram } from "@/hooks/useInvestProgram";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Portfolio() {
    const { publicKey } = useWallet();
    const { shareholders } = useInvestProgram();

    // Get user's investments from shareholders data
    const userInvestments = shareholders.data?.filter(
        account => account.account.owner.toBase58() === publicKey?.toBase58()
    ) || [];

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
                investments={userInvestments}
            />
            <PortfolioOverview 
                investments={userInvestments} 
                className="mb-6" 
            />
            <DividendPayments className="mb-12" />
        </main>
    )
}
