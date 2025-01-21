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

const mockMarketListings: MarketListing[] = [
    {
        id: '47b552e3-af9a-42a0-b6f3-88923ec38165',
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        seller: '6LpzxkfTDQfVKfZoquGkkmNqCLj75Ff3wXCBnaJQvP6Q',
        number_of_shares: 100000,
        token: supportedTokens[2],
        price_per_share: 0.1
    },
    {
        id: '1ce3af82-82aa-4ee6-9d35-0eea0672ae2e',
        swarm_id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
        seller: 'GzQ6zxC23F38m3retSWbesi6P3asBDy8iYoGozD9Rqts',
        number_of_shares: 10000,
        token: supportedTokens[3],
        price_per_share: 0.5
    },
    {
        id: 'a28bd78f-c25f-4b19-bebc-2d819a60e394',
        swarm_id: '988b16b4-6beb-4cc5-9a14-50f48ee47a22',
        seller: 'Du1cRmGaNJsaHaeuaKfDHArugh3WgZJNuTZ7wUsyrGBy',
        number_of_shares: 2550,
        token: supportedTokens[1],
        price_per_share: 10000
    },
    {
        id: '47b552e3-af9a-42a0-b6f3-88923ec38165',
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        seller: '6LpzxkfTDQfVKfZoquGkkmNqCLj75Ff3wXCBnaJQvP6Q',
        number_of_shares: 100000,
        token: supportedTokens[2],
        price_per_share: 0.1
    },
    {
        id: '1ce3af82-82aa-4ee6-9d35-0eea0672ae2e',
        swarm_id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
        seller: 'GzQ6zxC23F38m3retSWbesi6P3asBDy8iYoGozD9Rqts',
        number_of_shares: 10000,
        token: supportedTokens[3],
        price_per_share: 0.5
    },
    {
        id: 'a28bd78f-c25f-4b19-bebc-2d819a60e394',
        swarm_id: '988b16b4-6beb-4cc5-9a14-50f48ee47a22',
        seller: 'Du1cRmGaNJsaHaeuaKfDHArugh3WgZJNuTZ7wUsyrGBy',
        number_of_shares: 2550,
        token: supportedTokens[1],
        price_per_share: 10000
    },
    {
        id: 'e5fe5595-0266-4eb9-ae59-ed2192619574',
        swarm_id: '03616e66-a21e-425b-a93b-16d6396e883f',
        seller: 'BseSbuXPsCrubogu8SnvZkpyJhKW3HCWyrTYHsjGvqt8',
        number_of_shares: 12863,
        token: supportedTokens[4],
        price_per_share: 580
    },
    {
        id: '12f3aefc-1642-475c-b484-6a7dbfef006d',
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        seller: 'GzQ6zxC23F38m3retSWbesi6P3asBDy8iYoGozD9Rqts',
        number_of_shares: 100000,
        token: supportedTokens[2],
        price_per_share: 0.1
    },
    {
        id: 'e5fe5595-0266-4eb9-ae59-ed2192619574',
        swarm_id: '03616e66-a21e-425b-a93b-16d6396e883f',
        seller: 'BseSbuXPsCrubogu8SnvZkpyJhKW3HCWyrTYHsjGvqt8',
        number_of_shares: 12863,
        token: supportedTokens[4],
        price_per_share: 580
    },
    {
        id: '12f3aefc-1642-475c-b484-6a7dbfef006d',
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        seller: 'GzQ6zxC23F38m3retSWbesi6P3asBDy8iYoGozD9Rqts',
        number_of_shares: 100000,
        token: supportedTokens[2],
        price_per_share: 0.1
    },
    {
        id: '47b552e3-af9a-42a0-b6f3-88923ec38165',
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        seller: '6LpzxkfTDQfVKfZoquGkkmNqCLj75Ff3wXCBnaJQvP6Q',
        number_of_shares: 100000,
        token: supportedTokens[2],
        price_per_share: 0.1
    },
    {
        id: '1ce3af82-82aa-4ee6-9d35-0eea0672ae2e',
        swarm_id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
        seller: 'GzQ6zxC23F38m3retSWbesi6P3asBDy8iYoGozD9Rqts',
        number_of_shares: 10000,
        token: supportedTokens[3],
        price_per_share: 0.5
    },
    {
        id: 'a28bd78f-c25f-4b19-bebc-2d819a60e394',
        swarm_id: '988b16b4-6beb-4cc5-9a14-50f48ee47a22',
        seller: 'Du1cRmGaNJsaHaeuaKfDHArugh3WgZJNuTZ7wUsyrGBy',
        number_of_shares: 2550,
        token: supportedTokens[1],
        price_per_share: 10000
    },
    {
        id: '47b552e3-af9a-42a0-b6f3-88923ec38165',
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        seller: '6LpzxkfTDQfVKfZoquGkkmNqCLj75Ff3wXCBnaJQvP6Q',
        number_of_shares: 100000,
        token: supportedTokens[2],
        price_per_share: 0.1
    },
    {
        id: '1ce3af82-82aa-4ee6-9d35-0eea0672ae2e',
        swarm_id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
        seller: 'GzQ6zxC23F38m3retSWbesi6P3asBDy8iYoGozD9Rqts',
        number_of_shares: 10000,
        token: supportedTokens[3],
        price_per_share: 0.5
    },
    {
        id: 'a28bd78f-c25f-4b19-bebc-2d819a60e394',
        swarm_id: '988b16b4-6beb-4cc5-9a14-50f48ee47a22',
        seller: 'Du1cRmGaNJsaHaeuaKfDHArugh3WgZJNuTZ7wUsyrGBy',
        number_of_shares: 2550,
        token: supportedTokens[1],
        price_per_share: 10000
    },
    {
        id: 'e5fe5595-0266-4eb9-ae59-ed2192619574',
        swarm_id: '03616e66-a21e-425b-a93b-16d6396e883f',
        seller: 'BseSbuXPsCrubogu8SnvZkpyJhKW3HCWyrTYHsjGvqt8',
        number_of_shares: 12863,
        token: supportedTokens[4],
        price_per_share: 580
    },
    {
        id: '12f3aefc-1642-475c-b484-6a7dbfef006d',
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        seller: 'GzQ6zxC23F38m3retSWbesi6P3asBDy8iYoGozD9Rqts',
        number_of_shares: 100000,
        token: supportedTokens[2],
        price_per_share: 0.1
    },
    {
        id: 'e5fe5595-0266-4eb9-ae59-ed2192619574',
        swarm_id: '03616e66-a21e-425b-a93b-16d6396e883f',
        seller: 'BseSbuXPsCrubogu8SnvZkpyJhKW3HCWyrTYHsjGvqt8',
        number_of_shares: 12863,
        token: supportedTokens[4],
        price_per_share: 580
    },
    {
        id: '12f3aefc-1642-475c-b484-6a7dbfef006d',
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        seller: 'GzQ6zxC23F38m3retSWbesi6P3asBDy8iYoGozD9Rqts',
        number_of_shares: 100000,
        token: supportedTokens[2],
        price_per_share: 0.1
    },
    {
        id: '47b552e3-af9a-42a0-b6f3-88923ec38165',
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        seller: '6LpzxkfTDQfVKfZoquGkkmNqCLj75Ff3wXCBnaJQvP6Q',
        number_of_shares: 100000,
        token: supportedTokens[2],
        price_per_share: 0.1
    },
    {
        id: '1ce3af82-82aa-4ee6-9d35-0eea0672ae2e',
        swarm_id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
        seller: 'GzQ6zxC23F38m3retSWbesi6P3asBDy8iYoGozD9Rqts',
        number_of_shares: 10000,
        token: supportedTokens[3],
        price_per_share: 0.5
    },
    {
        id: 'a28bd78f-c25f-4b19-bebc-2d819a60e394',
        swarm_id: '988b16b4-6beb-4cc5-9a14-50f48ee47a22',
        seller: 'Du1cRmGaNJsaHaeuaKfDHArugh3WgZJNuTZ7wUsyrGBy',
        number_of_shares: 2550,
        token: supportedTokens[1],
        price_per_share: 10000
    },
    {
        id: '47b552e3-af9a-42a0-b6f3-88923ec38165',
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        seller: '6LpzxkfTDQfVKfZoquGkkmNqCLj75Ff3wXCBnaJQvP6Q',
        number_of_shares: 100000,
        token: supportedTokens[2],
        price_per_share: 0.1
    },
    {
        id: '1ce3af82-82aa-4ee6-9d35-0eea0672ae2e',
        swarm_id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
        seller: 'GzQ6zxC23F38m3retSWbesi6P3asBDy8iYoGozD9Rqts',
        number_of_shares: 10000,
        token: supportedTokens[3],
        price_per_share: 0.5
    },
    {
        id: 'a28bd78f-c25f-4b19-bebc-2d819a60e394',
        swarm_id: '988b16b4-6beb-4cc5-9a14-50f48ee47a22',
        seller: 'Du1cRmGaNJsaHaeuaKfDHArugh3WgZJNuTZ7wUsyrGBy',
        number_of_shares: 2550,
        token: supportedTokens[1],
        price_per_share: 10000
    },
    {
        id: 'a28bd78f-c25f-4b19-bebc-2d819a60e394',
        swarm_id: '988b16b4-6beb-4cc5-9a14-50f48ee47a22',
        seller: 'Du1cRmGaNJsaHaeuaKfDHArugh3WgZJNuTZ7wUsyrGBy',
        number_of_shares: 2550,
        token: supportedTokens[1],
        price_per_share: 10000
    },
    {
        id: '1ce3af82-82aa-4ee6-9d35-0eea0672ae2e',
        swarm_id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
        seller: 'GzQ6zxC23F38m3retSWbesi6P3asBDy8iYoGozD9Rqts',
        number_of_shares: 10000,
        token: supportedTokens[3],
        price_per_share: 0.5
    },
    {
        id: 'a28bd78f-c25f-4b19-bebc-2d819a60e394',
        swarm_id: '988b16b4-6beb-4cc5-9a14-50f48ee47a22',
        seller: 'Du1cRmGaNJsaHaeuaKfDHArugh3WgZJNuTZ7wUsyrGBy',
        number_of_shares: 2550,
        token: supportedTokens[1],
        price_per_share: 10000
    },
    {
        id: 'e5fe5595-0266-4eb9-ae59-ed2192619574',
        swarm_id: '03616e66-a21e-425b-a93b-16d6396e883f',
        seller: 'BseSbuXPsCrubogu8SnvZkpyJhKW3HCWyrTYHsjGvqt8',
        number_of_shares: 12863,
        token: supportedTokens[4],
        price_per_share: 580
    },
    {
        id: '12f3aefc-1642-475c-b484-6a7dbfef006d',
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        seller: 'GzQ6zxC23F38m3retSWbesi6P3asBDy8iYoGozD9Rqts',
        number_of_shares: 100000,
        token: supportedTokens[2],
        price_per_share: 0.1
    },
    {
        id: 'e5fe5595-0266-4eb9-ae59-ed2192619574',
        swarm_id: '03616e66-a21e-425b-a93b-16d6396e883f',
        seller: 'BseSbuXPsCrubogu8SnvZkpyJhKW3HCWyrTYHsjGvqt8',
        number_of_shares: 12863,
        token: supportedTokens[4],
        price_per_share: 580
    },
    {
        id: '12f3aefc-1642-475c-b484-6a7dbfef006d',
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        seller: 'GzQ6zxC23F38m3retSWbesi6P3asBDy8iYoGozD9Rqts',
        number_of_shares: 100005,
        token: supportedTokens[2],
        price_per_share: 0.1
    },
]

const MarketListings = ({ className }: { className?: string }) => {

    const ITEMS_PER_PAGE = 15;
    const [transactions, setTransactions] = useState<MarketListing[]>([]);

    const fetchTransactions = async ({ pageParam }: { pageParam: number }) => {
        await sleep(1000);
        const data = mockMarketListings.slice(pageParam, pageParam + ITEMS_PER_PAGE);
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