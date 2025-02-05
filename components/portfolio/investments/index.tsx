'use client';

import { Card } from "@/components/ui/card"
import { columns } from "./columns";
import { DataTable } from "@/components/ui/datatable";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Investment = {
    swarm_id: string;
    number_of_shares: number;
    total_shares: number;
    last_dividend_payment: number;
}

interface InvestmentsProps {
    className?: string;
}

const Investments = ({ className }: InvestmentsProps) => {

    return (
        <Card className={cn("w-full p-6", className)}>
            <h4 className="mb-4">Your Investments</h4>
            <DataTable columns={columns} data={investments} />
        </Card>
    )
}

export { Investments }
export type { InvestmentsProps, Investment }
