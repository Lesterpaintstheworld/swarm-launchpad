'use client'

import { Card } from "@/components/ui/card"
import { DataTable } from "@/components/ui/datatable";
import { cn } from "@/lib/utils";
import { columns } from "./columns";
import { useEffect } from "react";
import { Button } from "@/components/shadcn/button";
import { LucideRefreshCcw } from "lucide-react";
import { useLaunchpadProgram } from "@/hooks/useLaunchpadProgram";

const MarketListings = ({ className }: { className?: string }) => {

    const ITEMS_PER_PAGE = 20;
    // const [transactions, setTransactions] = useState<MarketListing[]>([]);

    // const fetchTransactions = async ({ pageParam }: { pageParam: number }) => {
    //     await sleep(1000);
    //     const data = [].slice(pageParam, pageParam + ITEMS_PER_PAGE);
    //     setTransactions(oldTxns => [...oldTxns, ...data]);
    //     return { prevIndex: pageParam }
    // }

    // const { isFetching, fetchNextPage } = useInfiniteQuery({
    //     initialPageParam: 0,
    //     queryKey: ['MarketListings'],
    //     queryFn: fetchTransactions,
    //     getNextPageParam: (lastPage) => lastPage.prevIndex + ITEMS_PER_PAGE,
    //     refetchOnMount: true,
    //     staleTime: 60 * 1000
    // })



    const { useListingsPagination } = useLaunchpadProgram();
    const { 
        listings, 
        isLoading, 
        pagination,
        refresh,
    } = useListingsPagination(ITEMS_PER_PAGE); // 20 items per page

    // transform listings to MarketListing[]
    useEffect(() => {
        console.log('listings', listings);
    }, [listings]);

    return (
        <Card className={cn("w-full flex flex-col", className)}>
            <div className="flex flex-row items-center justify-between">
                <h4 className="mb-6">Market Listings</h4>
                <Button onClick={refresh} disabled={isLoading}>
                    <LucideRefreshCcw size={16} />
                </Button>
            </div>
            <DataTable columns={columns} data={isLoading ? [] : []} />
            {[].length > -1 &&
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