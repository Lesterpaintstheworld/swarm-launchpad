'use client'

import { Card } from "@/components/ui/card"
import { DataTable } from "@/components/ui/datatable";
import { cn } from "@/lib/utils";
import { columns } from "./columns";
import { useEffect } from "react";
import { Button } from "@/components/shadcn/button";
import { LucideRefreshCcw } from "lucide-react";
import { useLaunchpadProgram } from "@/hooks/useLaunchpadProgram";
import { MarketListing } from "../market.types";
import { ListingAccount } from "@/hooks/useLaunchpadProgram/types";

const MarketListings = ({ className }: { className?: string }) => {
    const ITEMS_PER_PAGE = 20;

    const { useListingsPagination } = useLaunchpadProgram();
    const { 
        listings, 
        isLoading, 
        pagination,
        refresh,
    } = useListingsPagination(ITEMS_PER_PAGE);

    // Transform ListingAccount[] to MarketListing[]
    const transformedListings: MarketListing[] = listings.map((listing: ListingAccount) => ({
        id: listing.listingId,
        swarm_id: listing.pool.toString(),
        number_of_shares: Number(listing.numberOfShares),
        price_per_share: Number(listing.pricePerShare),
        seller: listing.seller.toString(),
        token: {
            label: '$COMPUTE',
            icon: '/tokens/compute.svg'
        }
    }));

    return (
        <Card className={cn("w-full flex flex-col", className)}>
            <div className="flex flex-row items-center justify-between">
                <h4 className="mb-6">Market Listings</h4>
                <Button onClick={refresh} disabled={isLoading}>
                    <LucideRefreshCcw size={16} />
                </Button>
            </div>
            <DataTable columns={columns} data={isLoading ? [] : transformedListings} />
            {listings.length > 0 &&
                <div className="flex gap-2 mt-4">
                    <Button 
                        onClick={pagination.previousPage}
                        disabled={!pagination.hasPreviousPage}
                    >
                        Previous
                    </Button>
                    <span>
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <Button 
                        onClick={pagination.nextPage}
                        disabled={!pagination.hasNextPage}
                    >
                        Next
                    </Button>
                </div>
            }
        </Card>
    );
};

export { MarketListings };
