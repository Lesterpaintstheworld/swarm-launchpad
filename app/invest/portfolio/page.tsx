'use client'

import { DividendPayments } from "@/components/portfolio/dividendPayments";
import { Investments } from "@/components/portfolio/investments";
import { PortfolioOverview } from "@/components/portfolio/overview";
import { useInvestProgram } from "@/hooks/useInvestProgram";

export default function Portfolio() {

    return (
        <main className="container view">
            <div className="h-80 flex flex-col items-center justify-center gap-1">
                <h2 className="text-center">Your Portfolio</h2>
                <p className="text-center text-balance text-muted text-lg">
                    Manage your AI swarm investments, and track returns
                </p>
            </div>
            <Investments className="mb-6" />
            <PortfolioOverview investments={mockInvestments} className="mb-6" />
            <DividendPayments className="mb-12" />
        </main>
    )
}
