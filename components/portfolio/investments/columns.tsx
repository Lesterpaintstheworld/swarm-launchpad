'use client'

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/datatable/columnHeader";
import { Investment } from "@/components/portfolio/investments";
import Image from "next/image";
import { IntlNumberFormat } from "@/lib/utils";
import { Button } from "@/components/shadcn/button";
import { getSwarm } from "@/data/swarms/previews";

export const columns: ColumnDef<Investment>[] = [
    {
        accessorKey: 'swarm_id',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Swarm" />
        ),
        minSize: 200,
        cell: ({ row }) => {

            const swarm = getSwarm(row.getValue('swarm_id'));

            return (
                <div className="flex items-center gap-4 py-3">
                    <Image
                        src={swarm.image}
                        alt={`${swarm.name} avatar`}
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                    <div className="flex flex-col">
                        <p className="text-lg mb-0 leading-none truncate">{swarm.name}</p>
                        {swarm?.role && <p className="text-sm text-muted truncate">{swarm.role}</p>}
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: 'number_of_shares',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Number of shares" />
        ),
        cell: ({ row }) => (
            <p className="text-lg font-bold">{IntlNumberFormat(row.getValue('number_of_shares'))}</p>
        )
    },
    {
        accessorKey: 'total_shares',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Ownership %" />
        ),
        cell: ({ row }) => {
            return <p className="text-lg text-muted">{IntlNumberFormat(Number(row.original.number_of_shares) / Number(row.original.total_shares) * 100)}%</p>
        }
    },
    {
        accessorKey: 'last_dividend_payment',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last dividend payment" />
        ),
        cell: ({ row }) => {

            const date = new Date(Number(row.getValue('last_dividend_payment')) * 1000);

            return (
                <p className="text-lg text-muted whitespace-nowrap">{date.toLocaleString()}</p>
            )
        }
    },
    {
        accessorKey: 'id',
        header: () => <></>,
        cell: () => {
            return (
                <div className="w-full flex my-2">
                    <Button
                        variant='destructive'
                        className="ml-auto h-fit py-1 font-normal"
                        onClick={() => alert('Initiate sale flow for investment')}
                    >
                        SELL
                    </Button>
                </div>
            )
        }
    },
];
