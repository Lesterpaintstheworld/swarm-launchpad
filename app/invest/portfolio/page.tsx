'use client'

import { DividendPayments } from "@/components/portfolio/dividendPayments";
import { Investments } from "@/components/portfolio/investments";
import { PortfolioOverview } from "@/components/portfolio/overview";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from 'next/dynamic';
// import { PublicKey } from "@solana/web3.js";
// import { useLaunchpadProgram } from "@/hooks/useLaunchpadProgram";
// import { useEffect } from "react";

// // Define the shareholder account type
// interface ShareholderAccount {
//     account: {
//         owner: PublicKey;
//         shares: number;
//         pool: PublicKey;
//     };
//     publicKey: PublicKey;
// }

// Dynamically import components that use Web3
const DynamicPortfolio = dynamic(() => Promise.resolve(({ children }: { children: React.ReactNode }) => <>{children}</>), {
    ssr: false
});

export default function Portfolio() {
    // Move hooks inside dynamic component to prevent SSR
    return (
        <DynamicPortfolio>
            <PortfolioContent />
        </DynamicPortfolio>
    );
}

function PortfolioContent() {

    const { connected } = useWallet();

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
                investments={[]}
            />
            <PortfolioOverview 
                investments={[]} 
                className="mb-6" 
            />
            <DividendPayments className="mb-12" />
        </main>
    )
}
