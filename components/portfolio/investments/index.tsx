'use client';

import { Card } from "@/components/ui/card"
import { columns } from "./columns";
import { DataTable } from "@/components/ui/datatable";
import { cn } from "@/lib/utils";
import { Investment } from "./types";

interface InvestmentsProps {
    investments: Investment[];
    className?: string;
}

const Investments = ({ investments, className }: InvestmentsProps) => {
    if (!investments) {
        return (
            <Card className={cn("w-full p-6", className)}>
                <h4 className="mb-4">Your Investments</h4>
                <p className="text-muted">No investments found</p>
            </Card>
        );
    }

    return (
        <Card className={cn("w-full p-6", className)}>
            <h4 className="mb-4">Your Investments</h4>
            <DataTable 
                columns={columns} 
                data={investments} 
            />
        </Card>
    )
}

export { Investments }
export type { InvestmentsProps, Investment }
