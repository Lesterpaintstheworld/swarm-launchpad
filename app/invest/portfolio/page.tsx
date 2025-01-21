'use client'

import { DividendPayments } from "@/components/portfolio/dividendPayments";
import { Investments } from "@/components/portfolio/investments";
import { PortfolioOverview } from "@/components/portfolio/overview";
import { useInvestProgram } from "@/hooks/useInvestProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/shadcn/button";

// Add interface for account type
interface ShareholderAccount {
    account: {
        owner: {
            toBase58: () => string;
        };
    };
}

export default function Portfolio() {
    const { publicKey, connected } = useWallet();
    const { shareholders } = useInvestProgram();

    // Handle wallet not connected
    if (!connected) {
        return (
            <main className="container view">
                <div className="h-80 flex flex-col items-center justify-center gap-4">
                    <h2 className="text-center">Connect Your Wallet</h2>
                    <p className="text-center text-balance text-muted text-lg">
                        Connect your wallet to view your portfolio
                    </p>
                </div>
            </main>
        );
    }

    // Handle loading state
    if (shareholders.isLoading) {
        return (
            <main className="container view">
                <div className="h-80 flex flex-col items-center justify-center gap-1">
                    <h2 className="text-center">Loading Portfolio...</h2>
                </div>
            </main>
        );
    }

    // Handle error state
    if (shareholders.error) {
        return (
            <main className="container view">
                <div className="h-80 flex flex-col items-center justify-center gap-4">
                    <h2 className="text-center">Error Loading Portfolio</h2>
                    <p className="text-center text-balance text-muted text-lg">
                        {shareholders.error.message}
                    </p>
                    <Button onClick={() => shareholders.refetch()}>
                        Try Again
                    </Button>
                </div>
            </main>
        );
    }

    // Get user's investments from shareholders data
    const userInvestments = shareholders.data?.filter(
        (account: ShareholderAccount) => account.account.owner.toBase58() === publicKey?.toBase58()
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
