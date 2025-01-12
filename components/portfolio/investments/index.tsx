import { Card } from "@/components/ui/card"
import { columns } from "./columns";
import { DataTable } from "@/components/ui/datatable";

type Investment = {
    agent_id: string;
    number_of_shares: number;
    total_shares: number;
    last_dividend_payment: number;
}

interface InvestmentsProps {
    investments: Investment[];
}

const Investments = ({ investments }: InvestmentsProps) => {

    return (
        <Card className="w-full">
            <h4 className="mb-4">Your Investments</h4>
            <DataTable columns={columns} data={investments} />
        </Card>
    )

}

export { Investments }
export type { InvestmentsProps, Investment }