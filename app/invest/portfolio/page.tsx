import { Investment, Investments } from "@/components/portfolio/investments";

const mockInvestments: Investment[] = [
    {
        agent_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        number_of_shares: 1500260,
        total_shares: 1000000000,
        last_dividend_payment: 1736721107
    },
    {
        agent_id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
        number_of_shares: 202150100,
        total_shares: 1000000000,
        last_dividend_payment: 1736421107
    },
    {
        agent_id: '988b16b4-6beb-4cc5-9a14-50f48ee47a22',
        number_of_shares: 58150100,
        total_shares: 800000000,
        last_dividend_payment: 1736421107
    },
    {
        agent_id: '03616e66-a21e-425b-a93b-16d6396e883f',
        number_of_shares: 2150100,
        total_shares: 500000000,
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
            <Investments investments={mockInvestments} />
        </main>
    )

}
