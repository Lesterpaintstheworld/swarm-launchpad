import { DividendPayments } from "@/components/portfolio/dividendPayments";
import { Investment, Investments } from "@/components/portfolio/investments";
import { PortfolioOverview } from "@/components/portfolio/overview";

const mockInvestments: Investment[] = [
    {
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        number_of_shares: 1500,
        total_shares: 10000,
        last_dividend_payment: 1736721107
    },
    {
        swarm_id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
        number_of_shares: 2021,
        total_shares: 10000,
        last_dividend_payment: 1736421107
    },
    {
        swarm_id: '988b16b4-6beb-4cc5-9a14-50f48ee47a22',
        number_of_shares: 581,
        total_shares: 10000,
        last_dividend_payment: 1736421107
    },
    {
        swarm_id: '03616e66-a21e-425b-a93b-16d6396e883f',
        number_of_shares: 21,
        total_shares: 10000,
        last_dividend_payment: 1736421107
    },
]

export default function Portfolio() {

    return (
        <main className="container">
            <div className="h-80 flex flex-col items-center justify-center gap-1">
                <h2 className="text-center">Your Portfolio</h2>
                <p className="text-center text-balance text-muted text-lg">Manage your AI swarm investments, and track returns</p>
            </div>
            <Investments investments={mockInvestments} className="mb-6" />
            <PortfolioOverview investments={mockInvestments} className="mb-6" />
            <DividendPayments className="mb-12" />
        </main>
    )

}
