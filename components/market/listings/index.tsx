"use client";

import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/datatable";
import { cn } from "@/lib/utils";
import { columns } from "./columns";
import { Button } from "@/components/shadcn/button";
import { LucideRefreshCcw } from "lucide-react";
import { useLaunchpadProgram } from "@/hooks/useLaunchpadProgram";
import { MarketListing } from "@/types/listing";
import { useQueryClient } from "@tanstack/react-query";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { supportedTokens } from "@/data/tokens/supported";

const MarketListings = ({ className }: { className?: string }) => {

	const { allListings } = useLaunchpadProgram();
	const { data, isFetching } = allListings;
	const { data: tokenPrices } = useTokenPrices();

	const queryClient = useQueryClient();

	// Define custom sorting functions that use token prices
	const sortingFns = {
		pricePerShare: (rowA, rowB) => {
			const tokenA = supportedTokens.find(t => t.mint == rowA.original.desiredToken.toBase58()) || supportedTokens[0];
			const tokenB = supportedTokens.find(t => t.mint == rowB.original.desiredToken.toBase58()) || supportedTokens[0];
			
			const valueA = Number(rowA.original.pricePerShare) / tokenA.resolution;
			const valueB = Number(rowB.original.pricePerShare) / tokenB.resolution;
			
			// If we have token prices, sort by USD value
			if (tokenPrices) {
				const usdValueA = tokenPrices.get(tokenA.mint) ? valueA * tokenPrices.get(tokenA.mint) : valueA;
				const usdValueB = tokenPrices.get(tokenB.mint) ? valueB * tokenPrices.get(tokenB.mint) : valueB;
				return usdValueA > usdValueB ? 1 : -1;
			}
			
			// Fallback to token value
			return valueA > valueB ? 1 : -1;
		},
		askingAmount: (rowA, rowB) => {
			const tokenA = supportedTokens.find(t => t.mint == rowA.original.desiredToken.toBase58()) || supportedTokens[0];
			const tokenB = supportedTokens.find(t => t.mint == rowB.original.desiredToken.toBase58()) || supportedTokens[0];
			
			const valueA = (Number(rowA.original.pricePerShare) / tokenA.resolution) * Number(rowA.original.numberOfShares);
			const valueB = (Number(rowB.original.pricePerShare) / tokenB.resolution) * Number(rowB.original.numberOfShares);
			
			// If we have token prices, sort by USD value
			if (tokenPrices) {
				const usdValueA = tokenPrices.get(tokenA.mint) ? valueA * tokenPrices.get(tokenA.mint) : valueA;
				const usdValueB = tokenPrices.get(tokenB.mint) ? valueB * tokenPrices.get(tokenB.mint) : valueB;
				return usdValueA > usdValueB ? 1 : -1;
			}
			
			// Fallback to token value
			return valueA > valueB ? 1 : -1;
		}
	};

	const handleRefresh = () => {
		queryClient.invalidateQueries({ queryKey: ['all-listings'] });
	}

	return (
		<Card className={cn("w-full flex flex-col", className)}>
			<div className="flex flex-row items-center justify-between">
				<h4 className="mb-6">Market Listings</h4>
				<Button disabled={isFetching} onClick={handleRefresh}>
					<LucideRefreshCcw size={16} />
				</Button>
			</div>
			<DataTable
				columns={columns}
				data={isFetching ? [] : data as MarketListing[]}
				sortingFns={sortingFns}
			/>
		</Card>
	);
};

export { MarketListings };
