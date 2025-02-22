'use client'

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/datatable/columnHeader";
import { IntlNumberFormat } from "@/lib/utils";
import { Button } from "@/components/shadcn/button";
import { MarketListing } from "../market.types";
import { Token } from "@/components/tokens/token";

export const columns: ColumnDef<MarketListing>[] = [
    {
        accessorKey: 'number_of_shares',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="No. Shares" />
        ),
        cell: ({ row }) => (
            <p>{IntlNumberFormat(Number(row.getValue('number_of_shares')))}</p>
        )
    },
    {
        accessorKey: 'seller',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Seller" />
        ),
        cell: ({ row }) => (
            <p className="w-fit rounded-sm truncate max-w-[17ch]">{row.getValue('seller')}</p>
        )
    },
    {
        accessorKey: 'price_per_share',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Price per share" />
        ),
        cell: ({ row }) => {
            return <p className="text-foreground/60">{IntlNumberFormat(Number(row.getValue('price_per_share')))}</p>
        }
    },
    {
        accessorKey: 'token',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Asking amount" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex flex-row items-center gap-2">
                    <p className="text-foreground/60 font-bold !text-foreground">{IntlNumberFormat(Number(row.getValue('price_per_share')) * Number(row.getValue('number_of_shares')))}</p>
                    <Token token={row.getValue('token')} />
                </div>
            )
        }
    },
    {
        accessorKey: 'id',
        header: () => <></>,
        cell: ({ row }) => {
            return (
                <div className="w-full flex my-2">
                    <Button
                        variant='success'
                        className="ml-auto h-fit py-1"
                        onClick={() => alert(`Initiate payment flow for sale id: ${row.getValue('id')}`)}
                    >
                        Buy
                    </Button>
                </div>
            )
        }
    },
];