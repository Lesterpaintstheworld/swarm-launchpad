'use client'

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/datatable/columnHeader";
import { IntlNumberFormat } from "@/lib/utils";
import { getSwarm } from "@/data/swarms/previews";
import { DividendPayment } from ".";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/shadcn/button";
import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// First define the ActionCell component outside and before the columns definition
interface RowData {
    amount: number;
    swarm_id: string;
    ubcAmount: number;
    timestamp: string;
}

interface ActionCellProps {
    row: {
        getValue: (key: keyof RowData) => RowData[keyof RowData];
        original: RowData;
    };
}

const ActionCell = ({ row }: ActionCellProps) => {
    const { publicKey } = useWallet();
    const computeAmount = row.getValue('amount') as number;
    const ubcAmount = row.original.ubcAmount;
    const swarmId = row.getValue('swarm_id') as string;
    const swarm = getSwarm(swarmId);
    const isDisabled = computeAmount < 10;

    return (
        <div className="w-full flex justify-end">
            <Button 
                variant="secondary" 
                size="sm"
                className="bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 hover:text-violet-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={true}
                title="Claim window is currently closed"
            >
                Claim Window Closed
            </Button>
        </div>
    );
};

export const columns: ColumnDef<DividendPayment>[] = [
    {
        accessorKey: 'swarm_id',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Swarm" />
        ),
        minSize: 250,
        cell: ({ row }) => {
            // Get swarm ID from the row
            const swarmId = row.getValue('swarm_id') as string;
            console.log('Looking up swarm with ID:', swarmId); // Debug log
            
            // Look up the swarm using the correct ID
            const swarm = getSwarm(swarmId);
            console.log('Found swarm:', swarm); // Debug log
            
            if (!swarm) {
                console.error('Swarm not found for ID:', swarmId);
                return (
                    <div className="flex items-center min-w-[200px] gap-4 py-1">
                        <div className="w-8 h-8 rounded-full bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-lg mb-0 leading-1 truncate text-white/60">
                                Unknown Swarm
                            </span>
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
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="font-bold">{IntlNumberFormat(row.original.ubcAmount)}</span>
                    <span className="metallic-text-ubc">$UBC</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-bold">{IntlNumberFormat(row.getValue('amount'))}</span>
                    <span className="metallic-text">$COMPUTE</span>
                </div>
            </div>
        )
    },
    {
        accessorKey: 'timestamp',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: () => (
            <p className="text-muted whitespace-nowrap">30/01/2025</p>
        )
    },
    {
        id: 'actions',
        header: () => null,
        cell: ActionCell
    }

];
