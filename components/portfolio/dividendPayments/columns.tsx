'use client'

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/datatable/columnHeader";
import { formatSignature, IntlNumberFormat } from "@/lib/utils";
import { getSwarm } from "@/data/swarms/previews";
import { Tag } from "@/components/ui/tag";
import { DividendPayment } from ".";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import Link from "next/link";
import { Copy } from "@/components/ui/copy";

export const columns: ColumnDef<DividendPayment>[] = [
    {
        accessorKey: 'swarm_id',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Swarm" />
        ),
        minSize: 250,
        cell: ({ row }) => {
            const swarm = getSwarm(row.getValue('swarm_id'));
            
            if (!swarm) {
                return <div>Unknown Swarm</div>;
            }

            return (
                <div className="flex items-center min-w-[200px] gap-4 py-1">
                    <Image
                        src={swarm.image}
                        alt={`${swarm.name} avatar`}
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                    <div className="flex flex-col">
                        <Link 
                            className="text-lg mb-0 leading-1 truncate hover:underline" 
                            href={`/invest/${swarm.id}`}
                        >
                            {swarm.name}
                        </Link>
                        {swarm.role && (
                            <p className="text-sm text-muted truncate">
                                {swarm.role}
                            </p>
                        )}
                    </div>
                </div>
            );
        }
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => (
            <div className="flex flex-row items-center gap-2">
                <p className="font-bold">{IntlNumberFormat(row.getValue('amount'))}</p>
                <Tag>{row.original.token}</Tag>
            </div>
        )
    },
    {
        accessorKey: 'timestamp',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ row }) => {

            const date = new Date(Number(row.getValue('timestamp')) * 1000);

            return (
                <p className="text-muted whitespace-nowrap">{date.toLocaleString()}</p>
            )
        }
    },
    {
        accessorKey: 'signature',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Signature" />
        ),
        cell: ({ row }) => {
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Copy label={formatSignature(row.getValue('signature'))} value={row.getValue('signature')} />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Copy</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        }
    },
];
