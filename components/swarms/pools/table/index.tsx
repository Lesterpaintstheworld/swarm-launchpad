'use client'

import { DataTable } from "@/components/ui/datatable";
import { useLaunchpadProgram } from "@/hooks/useLaunchpadProgram";
import { columns } from "./columns";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PoolTableProps {
    className?: string;
}

const PoolTable = ({ className }: PoolTableProps) => {

    const { pools } = useLaunchpadProgram();
    const { data, isLoading } = pools;

    return (
        <Card className={cn("w-full", className)}>
            <h4 className="mb-6">Swarm Pools</h4>
            <DataTable
                columns={columns}
                data={isLoading ? [] : data}
            />
        </Card>
    )
};

export { PoolTable };
export type { PoolTableProps };