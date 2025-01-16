'use client'

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/datatable/columnHeader";
import { Investment } from "@/components/portfolio/investments";
import Image from "next/image";
import { IntlNumberFormat } from "@/lib/utils";
import { getSwarm } from "@/data/swarms/previews";
import Link from "next/link";
import { SellButton } from "./sellButton";

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
                <div className="flex items-center min-w-[200px] gap-4 py-1">
                    <Image
                        src={swarm?.image}
                        alt={`${swarm?.name} avatar`}
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                    <div className="flex flex-col">
                        <Link className="text-lg mb-0 leading-1 truncate hover:underline" href={`/invest/${swarm.id}`}>{swarm?.name}</Link>
                        {swarm?.role && <p className="text-sm text-muted truncate">{swarm?.role}</p>}
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
            <p className="font-bold">{IntlNumberFormat(row.getValue('number_of_shares'))}</p>
        )
    },
    {
        accessorKey: 'total_shares',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Ownership %" />
        ),
        cell: ({ row }) => {
            return <p className="text-muted">{IntlNumberFormat(Number(row.original.number_of_shares) / Number(row.original.total_shares) * 100)}%</p>
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
                <p className="text-muted whitespace-nowrap">{date.toLocaleString()}</p>
            )
        }
    },
    {
        accessorKey: 'swarm_id',
        header: () => <></>,
        minSize: 100,
        cell: ({ row }) => {
            return <SellButton swarmId={row.original.swarm_id} />;
        }
    },
];
