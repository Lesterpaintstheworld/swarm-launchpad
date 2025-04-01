/* eslint-disable */
'use client'

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/ui/datatable/columnHeader";
import { formatPublicKey, IntlNumberFormat } from "@/lib/utils";
import { Button } from "@/components/shadcn/button";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PoolAccount } from "@/types/pool";
import { ProgramAccount } from "@coral-xyz/anchor";
import { Tag } from "@/components/ui/tag";
import { Status } from "@/components/ui/status";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import { LucideSettings } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useWallet } from "@solana/wallet-adapter-react";
import { ManagePool } from "../manage";
import { usePermissions } from "@/hooks/usePermissions";

export const columns: ColumnDef<ProgramAccount<PoolAccount>>[] = [
    {
        accessorKey: 'pool',
        header: ({ column }) => (
            <div className="flex items-center space-x-2">
                <DataTableColumnHeader column={column} title="Swarm Pool" />
            </div>
        ),
        minSize: 200,
        filterFn: (row, id, filterValue: string[]) => {
            if (!filterValue || filterValue.length === 0) return true;

            // Instead of trying to fetch the swarm data here,
            // we'll use a global cache of pool-to-swarm mappings
            const poolId = row.original.publicKey.toBase58();

            // Get the swarm ID from the global cache
            const swarmId = (window as Window).__poolToSwarmCache?.[poolId];

            // If we don't have the mapping yet, hide the row
            if (!swarmId) {
                console.log(`No swarm ID found for pool ${poolId}`);
                return false;
            }

            // Check if the swarm ID is in the selected swarms
            const isIncluded = filterValue.includes(swarmId);
            return isIncluded;
        },
        cell: ({ row }) => {
            // Use a stable key for the query to prevent unnecessary refetches
            const poolId = row.original.publicKey.toBase58();

            const { data: swarm, isLoading } = useQuery({
                queryKey: ['swarm', poolId],
                queryFn: async () => {
                    const response = await fetch(`/api/swarms/find-using-pool-id/${poolId}`);
                    if (!response.ok) {
                        throw new Error('Could not fetch swarm');
                    }
                    return response.json();
                },
                staleTime: 1000 * 60 * 5, // 5 minutes
                gcTime: 1000 * 60 * 10, // 10 minutes
            })

            if (isLoading) {
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

            if (!swarm) {
                return (
                    <div className="flex items-center min-w-[200px] gap-4 py-1">
                        <div className="w-8 h-8 rounded-full bg-white/10" />
                        <p className="text-lg mb-0 leading-1 truncate">{row.original.account.poolName}</p>
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
        accessorKey: 'custodialWallet',
        accessorFn: (row) => row.account.custodialAccount.toBase58(),
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Custodial Wallet" />
        ),
        cell: ({ row }) => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <p className="text-muted">{formatPublicKey(row.original.account.custodialAccount.toBase58())}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                        {row.original.account.custodialAccount.toBase58()}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    },
    {
        accessorKey: 'availableShares',
        accessorFn: (row) => Number(row.account.availableShares),
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Available Shares" />
        ),
        cell: ({ row }) => {

            const n = Number(row.original.account.availableShares);
            const formatted = IntlNumberFormat(n);

            if (n == 0) {
                return (
                    <Tag className="text-red-500">
                        Sold Out
                    </Tag>
                )
            }
            return (
                <p>{formatted}</p>
            )
        }
    },
    {
        accessorKey: 'totalShares',
        accessorFn: (row) => Number(row.account.totalShares),
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Total Shares" />
        ),
        cell: ({ row }) => {

            const n = Number(row.original.account.totalShares);
            const formatted = IntlNumberFormat(n);

            return (
                <p>{formatted}</p>
            )
        }
    },
    {
        accessorKey: 'frozen',
        accessorFn: (row) => row.account.isFrozen,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => (
            <Status status={!row.original.account.isFrozen} labels={{ positive: "Tradeable", negative: "Frozen" }} />
        )
    },
    {
        accessorKey: 'account',
        header: ({ column }) => <></>,
        maxSize: 50,
        cell: ({ row }) => {
            const [open, setOpen] = useState(false);

            const { publicKey } = useWallet();
            const { permissions, isLoading } = usePermissions(publicKey);

            if (isLoading || !permissions?.includes('swarm::pool::manage')) return null;

            return (
                <div className="flex">
                    <Button variant="ghost" className="ml-auto" onClick={() => setOpen(true)}>
                        <LucideSettings />
                    </Button>
                    <ManagePool poolAccount={row.original} open={open} isOpen={setOpen} />
                </div>
            )

        }
    }
];
