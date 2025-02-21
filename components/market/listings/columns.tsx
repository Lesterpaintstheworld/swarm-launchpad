/* eslint-disable */
'use client'

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/datatable/columnHeader";
import { formatPublicKey, IntlNumberFormat } from "@/lib/utils";
import { Button } from "@/components/shadcn/button";
import Image from "next/image";
import Link from "next/link";
import { Token } from "@/components/tokens/token";
import { MarketListing } from "@/types/listing";
import { useQuery } from "@tanstack/react-query";
import { supportedTokens } from "@/data/tokens/supported";
import { useState } from "react";
import { BuyListingModal } from "../buyListingModal";
import { useLaunchpadProgramAccount } from "@/hooks/useLaunchpadProgram";
import { PoolAccount } from "@/types/pool";

export const columns: ColumnDef<MarketListing>[] = [
    {
        accessorKey: 'pool',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Swarm" />
        ),
        minSize: 250,
        cell: ({ row }) => {

            const { data: swarm, isLoading } = useQuery({
                queryKey: ['swarm', row.original.pool.toBase58()],
                queryFn: async () => {
                    const response = await fetch(`/api/swarms/find-using-pool-id/${row.original.pool.toBase58()}`);
                    if (!response.ok) {
                        throw new Error('Could not fetch swarm');
                    }
                    return response.json();
                }
            })

            if (isLoading || !swarm) {
                return (
                    <div className="flex items-center min-w-[200px] gap-4 py-1">
                        <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                        <div className="flex flex-col gap-2">
                            <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                            <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                        </div>
                    </div>
                )
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
                        <Link className="text-lg mb-0 leading-1 truncate hover:underline" href={`/invest/${swarm.id}`}>
                            {swarm.name}
                        </Link>
                        {swarm.role && <p className="text-sm text-muted truncate">{swarm.role}</p>}
                    </div>
                </div>
            );

        }
    },
    {
        accessorKey: 'numberOfShares',
        accessorFn: row => Number(row.numberOfShares),
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="No. Shares" />
        ),
        cell: ({ row }) => (
            <p>{IntlNumberFormat(Number(row.original.numberOfShares))}</p>
        )
    },
    {
        accessorKey: 'seller',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Seller" />
        ),
        cell: ({ row }) => (
            <p className="w-fit rounded-sm truncate max-w-[17ch]">{formatPublicKey(row.original.seller.toBase58())}</p>
        )
    },
    {
        accessorKey: 'pricePerShare',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Price per share" />
        ),
        cell: ({ row }) => {


            const token = supportedTokens.find(t => t.mint == row.original.desiredToken.toBase58()) || supportedTokens[0];
            const value = Number(row.original.pricePerShare) / token.resolution;

            return (
                <p className="text-foreground/60">
                    {IntlNumberFormat(value, token.decimals)}
                </p>
            );
        }
    },
    {
        accessorKey: 'askingAmount',
        minSize: 250,
        accessorFn: row => Number(row.pricePerShare) * Number(row.numberOfShares),
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Asking amount" />
        ),
        cell: ({ row }) => {

            // @ts-ignore
            const token = supportedTokens.find(t => t.mint == row.original.desiredToken.toBase58()) || supportedTokens[0];
            const value = (Number(row.original.pricePerShare) / token.resolution) * Number(row.original.numberOfShares);

            return (
                <div className="flex flex-row items-center gap-2">
                    <p className="text-foreground/60 font-bold !text-foreground">
                        {IntlNumberFormat(value, token.decimals)}
                    </p>
                    <Token token={token} hover={false} />
                </div>
            )
        }
    },
    {
        accessorKey: 'id',
        header: () => <></>,
        cell: ({ row }) => {

            const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

            const { poolAccount } = useLaunchpadProgramAccount({ poolAddress: row.original.pool.toBase58() });

            const { data: swarm, isLoading, error } = useQuery({
                queryKey: ['swarm', row.original.pool.toBase58()],
                queryFn: async () => {
                    const response = await fetch(`/api/swarms/find-using-pool-id/${row.original.pool.toBase58()}`);
                    if (!response.ok) {
                        throw new Error('Could not fetch swarm');
                    }
                    return response.json();
                }
            })

            const { data: poolAccountData, isLoading: isLoadingPoolAccount } = poolAccount;

            return (
                <>
                    <div className="w-full flex my-2">
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="ml-auto"
                            variant='success'
                            disabled={isLoading || !!error}
                        >
                            BUY
                        </Button>
                    </div>
                    {!isLoading && !isLoadingPoolAccount &&
                        <BuyListingModal
                            isModalOpen={isModalOpen}
                            closeModal={() => setIsModalOpen(false)}
                            listing={row.original}
                            swarm={swarm}
                            poolAccount={poolAccountData as PoolAccount}
                        />
                    }
                </>
            )
        }
    },
];
