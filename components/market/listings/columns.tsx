'use client'

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/datatable/columnHeader";
import { useState, useEffect } from "react";
import { formatPublicKey, IntlNumberFormat } from "@/lib/utils";
import { Button } from "@/components/shadcn/button";
import { MarketListing } from "../market.types";
import Image from "next/image";
import Link from "next/link";
import { Token } from "@/components/tokens/token";

export const columns: ColumnDef<MarketListing>[] = [
    {
        accessorKey: 'swarm_id',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Swarm" />
        ),
        minSize: 250,
        cell: ({ row }) => {

            interface SwarmData {
              id: string;
              name: string;
              image: string;
              role?: string;
            }

            const SwarmCell = ({ swarmId }: { swarmId: string }) => {
              const [swarm, setSwarm] = useState<SwarmData | null>(null);

              useEffect(() => {
                async function fetchSwarm() {
                  try {
                    const response = await fetch(`/api/swarms/${swarmId}`);
                    if (!response.ok) return;
                    const data = await response.json();
                    setSwarm(data);
                  } catch (error) {
                    console.error('Error fetching swarm:', error);
                  }
                }
                fetchSwarm();
              }, [swarmId]);

              if (!swarm) return null;

                return (
                    <div className="flex items-center min-w-[200px] gap-4 py-1">
                        <Image
                            src={swarm.image}
                            alt={`${swarm.name} avatar`}
                            width={32}
                            height={32}
                            className="rounded-full"
                            sizes="32px"
                        />
                        <div className="flex flex-col">
                            <Link className="text-lg mb-0 leading-1 truncate hover:underline" href={`/invest/${swarm.id}`}>
                                {swarm.name}
                            </Link>
                            {swarm.role && <p className="text-sm text-muted truncate">{swarm.role}</p>}
                        </div>
                    </div>
                );
            };

            return <SwarmCell swarmId={row.getValue('swarm_id')} />;
        }
    },
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
            <p className="w-fit rounded-sm truncate max-w-[17ch]">{formatPublicKey(row.getValue('seller'))}</p>
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
