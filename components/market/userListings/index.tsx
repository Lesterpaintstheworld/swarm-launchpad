'use client'

import { Card } from "@/components/ui/card";
import { useLaunchpadProgram } from "@/hooks/useLaunchpadProgram";
import { Row } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/datatable";
import { columns } from "./columns";
import { cn } from "@/lib/utils";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { supportedTokens } from "@/data/tokens/supported";

const UserListings = ({ className }: { className?: string }) => {

    const { userListings } = useLaunchpadProgram();
    const { data, isLoading } = userListings;
    const { data: tokenPrices } = useTokenPrices();

    if (!data || data?.length === 0) {
        return null;
    }

    // Define custom sorting functions that use token prices
    const sortingFns = {
        pricePerShare: (rowA: Row<MarketListing>, rowB: Row<MarketListing>) => {
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
        askingAmount: (rowA: Row<MarketListing>, rowB: Row<MarketListing>) => {
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

    return (
        <Card className={cn("w-full mb-6", className)}>
            <h4 className="mb-6">Your Listings</h4>
            <DataTable
                columns={columns}
                data={isLoading ? [] : data}
                sortingFns={sortingFns}
            />
        </Card>
    )

}

export { UserListings };
