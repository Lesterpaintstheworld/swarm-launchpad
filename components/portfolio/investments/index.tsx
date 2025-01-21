import { Card } from "@/components/ui/card"
import { columns } from "./columns";
import { DataTable } from "@/components/ui/datatable";
import { cn } from "@/lib/utils";

type Investment = {
    swarm_id: string;
    number_of_shares: number;
    total_shares: number;
    last_dividend_payment: number;
}

interface InvestmentsProps {
    className?: string;
    investments: any[];
}

const Investments = ({ className, investments }: InvestmentsProps) => {

    return (
        <Card className={cn("w-full", className)}>
            <h4 className="mb-4">Your Investments</h4>
            <DataTable columns={columns} data={investments} />
        </Card>
    )

}

export { Investments }
export type { InvestmentsProps, Investment }
