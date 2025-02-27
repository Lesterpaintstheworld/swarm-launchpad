import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/datatable";
import { Row } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { columns } from "./columns";
import { Button } from "@/components/shadcn/button";
import Link from "next/link";
import { LucideArrowRight } from "lucide-react";
import { useLaunchpadProgramAccount } from "@/hooks/useLaunchpadProgram";
import { MarketListing } from "@/types/listing";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { supportedTokens } from "@/data/tokens/supported";

interface SwarmRecentMarketListingsProps {
    pool: string;
    className?: string;
}

const SwarmRecentMarketListings = ({ pool, className }: SwarmRecentMarketListingsProps) => {

    const { poolListings } = useLaunchpadProgramAccount({ poolAddress: pool });
    const { data: listings, isFetching } = poolListings;
    const { data: tokenPrices } = useTokenPrices();

    // Define custom sorting functions that use token prices
    const sortingFns = {
        pricePerShare: (rowA: Row<MarketListing>, rowB: Row<MarketListing>) => {
            const tokenA = supportedTokens.find(t => t.mint == rowA.original.desiredToken.toBase58()) || supportedTokens[0];
            const tokenB = supportedTokens.find(t => t.mint == rowB.original.desiredToken.toBase58()) || supportedTokens[0];
            
            const valueA = Number(rowA.original.pricePerShare) / tokenA.resolution;
            const valueB = Number(rowB.original.pricePerShare) / tokenB.resolution;
            
            // If we have token prices, sort by USD value
            if (tokenPrices) {
                const usdValueA = tokenPrices.get(tokenA.mint) ? valueA * tokenPrices.get(tokenA.mint)! : valueA;
                const usdValueB = tokenPrices.get(tokenB.mint) ? valueB * tokenPrices.get(tokenB.mint)! : valueB;
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
                const usdValueA = tokenPrices.get(tokenA.mint) ? valueA * tokenPrices.get(tokenA.mint)! : valueA;
                const usdValueB = tokenPrices.get(tokenB.mint) ? valueB * tokenPrices.get(tokenB.mint)! : valueB;
                return usdValueA > usdValueB ? 1 : -1;
            }
            
            // Fallback to token value
            return valueA > valueB ? 1 : -1;
        }
    };

    return (
        <Card className={cn("w-full flex flex-col mt-6 md:mt-12", className)}>
            <h4 className="mb-4 font-foreground font-semibold">P2P Market Listings</h4>
            <DataTable
                columns={columns}
                data={isFetching ? [] : listings as MarketListing[]}
                sortingFns={sortingFns}
            />
            {listings && listings?.length > 0 &&
                <>
                    <hr />
                    <Button variant='link' className="ml-auto hover:no-underline" asChild>
                        <div className="flex flex-row items-center gap-2 w-fit text-muted mt-4 hover:text-foreground">
                            <Link href={`/marketplace?tab=p2p`}>
                                View all
                            </Link>
                            <LucideArrowRight />
                        </div>
                    </Button>
                </>
            }
        </Card>
    )

}

export { SwarmRecentMarketListings }
export type { SwarmRecentMarketListingsProps }
