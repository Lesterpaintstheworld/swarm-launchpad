/* eslint-disable */
'use client'

import { ColumnDef } from "@tanstack/react-table";

// Function to calculate price color gradient
const getPriceColor = (price: number) => {
  // Fixed range from $0.5 to $5
  const MIN_PRICE = 0.5;
  const MAX_PRICE = 5;
  
  // Normalize the price between 0 and 1 within our fixed range
  const normalizedPrice = Math.min(Math.max((price - MIN_PRICE) / (MAX_PRICE - MIN_PRICE), 0), 1);
  
  // Create a more detailed gradient with many color steps
  if (normalizedPrice > 0.95) {
    return "text-red-700"; // Most expensive (> $4.75)
  } else if (normalizedPrice > 0.9) {
    return "text-red-600"; // Very expensive ($4.5 - $4.75)
  } else if (normalizedPrice > 0.85) {
    return "text-red-500"; // Very expensive ($4.25 - $4.5)
  } else if (normalizedPrice > 0.8) {
    return "text-red-400"; // Expensive ($4.0 - $4.25)
  } else if (normalizedPrice > 0.75) {
    return "text-orange-600"; // Quite expensive ($3.75 - $4.0)
  } else if (normalizedPrice > 0.7) {
    return "text-orange-500"; // Quite expensive ($3.5 - $3.75)
  } else if (normalizedPrice > 0.65) {
    return "text-orange-400"; // Moderately expensive ($3.25 - $3.5)
  } else if (normalizedPrice > 0.6) {
    return "text-amber-500"; // Above average ($3.0 - $3.25)
  } else if (normalizedPrice > 0.55) {
    return "text-amber-400"; // Above average ($2.75 - $3.0)
  } else if (normalizedPrice > 0.5) {
    return "text-yellow-500"; // Average ($2.5 - $2.75)
  } else if (normalizedPrice > 0.45) {
    return "text-yellow-400"; // Average ($2.25 - $2.5)
  } else if (normalizedPrice > 0.4) {
    return "text-lime-500"; // Below average ($2.0 - $2.25)
  } else if (normalizedPrice > 0.35) {
    return "text-lime-400"; // Below average ($1.75 - $2.0)
  } else if (normalizedPrice > 0.3) {
    return "text-green-500"; // Affordable ($1.5 - $1.75)
  } else if (normalizedPrice > 0.25) {
    return "text-green-400"; // Affordable ($1.25 - $1.5)
  } else if (normalizedPrice > 0.2) {
    return "text-emerald-500"; // Very affordable ($1.0 - $1.25)
  } else if (normalizedPrice > 0.15) {
    return "text-emerald-400"; // Very affordable ($0.875 - $1.0)
  } else if (normalizedPrice > 0.1) {
    return "text-cyan-500"; // Cheap ($0.75 - $0.875)
  } else if (normalizedPrice > 0.05) {
    return "text-cyan-400"; // Cheap ($0.625 - $0.75)
  } else {
    return "text-blue-500"; // Cheapest (< $0.625)
  }
};
import { DataTableColumnHeader } from "@/components/ui/datatable/columnHeader";
import { formatPublicKey, IntlNumberFormat, IntlNumberFormatCurrency } from "@/lib/utils";
import { Button } from "@/components/shadcn/button";
import Image from "next/image";
import Link from "next/link";
import { Token } from "@/components/tokens/token";
import { MarketListing } from "@/types/listing";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supportedTokens } from "@/data/tokens/supported";
import { LucideSettings } from "lucide-react";
import { useState, useMemo } from "react";
import { CancelListingModal } from "../cancelListingModal";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { SharesFilter } from "../filters/sharesFilter";
import { SwarmFilter } from "../filters/swarmFilter";

export const columns: ColumnDef<MarketListing>[] = [
    {
        accessorKey: 'pool',
        header: ({ column }) => (
            <div className="flex items-center space-x-2">
                <DataTableColumnHeader column={column} title="Swarm" />
                {/* Commenté pour cacher le filtre
                <SwarmFilter 
                    onFilterChange={(selectedSwarms) => {
                        if (selectedSwarms.length === 0) {
                            column.setFilterValue(undefined);
                        } else {
                            column.setFilterValue(selectedSwarms);
                        }
                    }}
                    isFiltered={column.getIsFiltered()}
                    onClearFilter={() => column.setFilterValue(undefined)}
                />
                */}
            </div>
        ),
        minSize: 250,
        filterFn: (row, id, filterValue: string[]) => {
            if (!filterValue || filterValue.length === 0) return true;
            
            // Instead of trying to fetch the swarm data here,
            // we'll use a global cache of pool-to-swarm mappings
            const poolId = row.original.pool.toBase58();
            
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
            const poolId = row.original.pool.toBase58();
            
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
            <div className="flex items-center space-x-2">
                <DataTableColumnHeader column={column} title="Shares" />
                {/* SharesFilter temporarily disabled for performance */}
            </div>
        ),
        cell: ({ row }) => (
            <p>{IntlNumberFormat(Number(row.original.numberOfShares))}</p>
        ),
        filterFn: (row, id, filterValue) => {
            if (!filterValue || !filterValue[0]) return true;
            
            const filter = filterValue[0];
            const value = Number(row.original.numberOfShares);
            
            if (filter.operator === '>=') {
                return value >= filter.value;
            } else if (filter.operator === '<=') {
                return value <= filter.value;
            }
            
            return true;
        }
    },
    {
        id: 'pricePerShare',
        accessorKey: 'pricePerShare',
        // Use a built-in sorting function that will be overridden by our custom one
        sortingFn: 'basic',
        // Use the pre-calculated USD value for sorting
        accessorFn: row => row._pricePerShareInUsd,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Price per share" />
        ),
        cell: ({ row }) => {
            const valueInUsd = row.original._pricePerShareInUsd;
            const colorClass = getPriceColor(valueInUsd);
            
            // We're no longer showing the token value, only USD
            return (
                <div>
                    <p className={`${colorClass}`}>
                        {IntlNumberFormatCurrency(valueInUsd)}
                    </p>
                </div>
            );
        }
    },
    {
        id: 'askingAmount',
        accessorKey: 'askingAmount',
        minSize: 250,
        // Use a built-in sorting function that will be overridden by our custom one
        sortingFn: 'basic',
        // Use the pre-calculated USD value for sorting
        accessorFn: row => row._askingAmountInUsd,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Asking amount" />
        ),
        cell: ({ row }) => {
            const token = row.original._token;
            const valueInToken = row.original._askingAmountInToken;
            const valueInUsd = row.original._askingAmountInUsd;
            
            // Add metallic effect class based on token
            const metallicClass = token.mint === '9psiRdn9cXYVps4F1kFuoNjd2EtmqNJXrCPmRppJpump' 
                ? 'metallic-text-ubc' 
                : token.mint === 'B1N1HcMm4RysYz4smsXwmk2UnS8NziqKCM6Ho8i62vXo' 
                ? 'metallic-text' 
                : token.mint === '11111111111111111111111111111111'
                ? 'metallic-text-sol'
                : '';

            return (
                <div>
                    <p className="text-foreground font-bold">
                        {IntlNumberFormatCurrency(valueInUsd)}
                    </p>
                    <div className="flex flex-row items-center gap-1 text-xs text-muted-foreground">
                        <p className={metallicClass}>
                            {IntlNumberFormat(valueInToken, token.decimals)} {token.label}
                        </p>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: 'seller',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Seller" />
        ),
        cell: ({ row }) => (
            <a 
                href={`https://solscan.io/account/${row.original.seller.toBase58()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit rounded-sm truncate max-w-[17ch] text-gray-400 hover:text-gray-300 transition-colors"
            >
                {formatPublicKey(row.original.seller.toBase58())}
            </a>
        )
    },
    {
        accessorKey: 'id',
        header: () => <></>,
        cell: ({ row }) => {
            const poolId = row.original.pool.toBase58();
            const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

            const { data: swarm, isLoading, error } = useQuery({
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

            return (
                <>
                    <div className="w-full flex my-2">
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="ml-auto"
                            variant='ghost'
                            disabled={isLoading}
                        >
                            <LucideSettings />
                        </Button>
                    </div>
                    {!isLoading &&
                        <CancelListingModal
                            isModalOpen={isModalOpen}
                            closeModal={() => setIsModalOpen(false)}
                            listing={row.original}
                            swarm={swarm}
                        />
                    }
                </>
            )
        }
    },
];
