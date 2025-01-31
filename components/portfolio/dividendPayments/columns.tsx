'use client'

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/datatable/columnHeader";
import { IntlNumberFormat } from "@/lib/utils";
import { getSwarm } from "@/data/swarms/previews";
import { DividendPayment } from ".";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/shadcn/button";

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
                return (
                    <div className="flex items-center min-w-[200px] gap-4 py-1">
                        <div className="w-8 h-8 rounded-full bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-lg text-muted-foreground">Unknown Swarm</span>
                        </div>
                    </div>
                );
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
            <div className="flex items-center gap-2">
                <span className="font-bold">{IntlNumberFormat(row.getValue('amount'))}</span>
                <span className="metallic-text">$COMPUTE</span>
            </div>
        )
    },
    {
        accessorKey: 'timestamp',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue('timestamp'));
            return (
                <p className="text-muted whitespace-nowrap">{date.toLocaleString()}</p>
            )
        }
    },
    {
        id: 'actions',
        header: () => null,
        cell: ({ row }) => {
            return (
                <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400"
                    onClick={() => {
                        // Add claim functionality here
                        console.log('Claiming dividend:', row.original);
                    }}
                >
                    Claim
                </Button>
            )
        }
    }
];
