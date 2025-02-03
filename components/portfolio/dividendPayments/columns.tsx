'use client'

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/datatable/columnHeader";
import { IntlNumberFormat } from "@/lib/utils";
async function getSwarm(id: string) {
  try {
    const response = await fetch(`/api/swarms/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching swarm:', error);
    return null;
  }
}
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
            const swarmId = row.getValue('swarm_id') as string;
            return <SwarmCell swarmId={swarmId} />;
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
