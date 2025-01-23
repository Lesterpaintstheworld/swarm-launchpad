'use client'

import { Card } from "@/components/ui/card"
import { DataTable } from "@/components/ui/datatable";
import { cn, sleep } from "@/lib/utils";
import { columns } from "./columns";
import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LucideLoader } from "lucide-react";
import { MarketListing } from "../market.types";
import { supportedTokens } from "@/data/tokens/supported";

const MarketListings = ({ className }: { className?: string }) => {

    const ITEMS_PER_PAGE = 15;
    const [transactions, setTransactions] = useState<MarketListing[]>([]);

    const fetchTransactions = async ({ pageParam }: { pageParam: number }) => {
        await sleep(1000);
        const data = [].slice(pageParam, pageParam + ITEMS_PER_PAGE);
        setTransactions(oldTxns => [...oldTxns, ...data]);
        return { prevIndex: pageParam }
    }

    const { isFetching, fetchNextPage } = useInfiniteQuery({
        initialPageParam: 0,
        queryKey: ['MarketListings'],
        queryFn: fetchTransactions,
        getNextPageParam: (lastPage) => lastPage.prevIndex + ITEMS_PER_PAGE,
        refetchOnMount: true,
        staleTime: 60 * 1000
    })

    return (
        <Card className={cn("w-full flex flex-col", className)}>
            <h4 className="mb-6">Market Listings</h4>
            <DataTable columns={columns} data={transactions} />
            {transactions.length % ITEMS_PER_PAGE === 0 &&
                <Button className="mx-auto mt-8 mb-3" onClick={() => fetchNextPage()} disabled={isFetching}>
                    {isFetching ? <LucideLoader className="animate-spin" /> : 'Load more'}
                </Button>
            }
        </Card>
    );
};

export { MarketListings };