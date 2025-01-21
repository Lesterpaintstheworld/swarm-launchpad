'use client'

import { Card } from "@/components/ui/card"
import { DataTable } from "@/components/ui/datatable";
import { cn, sleep } from "@/lib/utils";
import { columns } from "./columns";
import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LucideLoader } from "lucide-react";

const mockDividendPayments: DividendPayment[] = [
    {
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        amount: 20.86,
        token: '$UBC',
        timestamp: 1736821082,
        signature: 'dLi5PUsCR6Q5Yc5peteaYHLJStSnKuHpiEnp4c17P3GPotwnAjKjBRL5pu9gQUEWJpqWMTd3Kc5rHdLk3otjctM'
    },
    {
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        amount: 24000,
        token: '$UBC',
        timestamp: 1736821082,
        signature: 'f97otPQd1coLpXkugH62iRsX9nA4V6NwjBwnLDYfcqkde2woz44ToNkLNjSj7AQALE4LBph8kxckz9tvXFKe8sF'
    },
    {
        swarm_id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
        amount: 150150,
        token: '$UBC',
        timestamp: 1736821082,
        signature: 'TVanohYtSjpdzVk4WspjD29XFTDEwmnvhoTJajnRmmkdtTmS4Yj9X5GUz45V1gEhquoRsuNXf51UN8rTwCTe5HK'
    },
    {
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        amount: 20.86,
        token: '$UBC',
        timestamp: 1736821082,
        signature: 'dLi5PUsCR6Q5Yc5peteaYHLJStSnKuHpiEnp4c17P3GPotwnAjKjBRL5pu9gQUEWJpqWMTd3Kc5rHdLk3otjctM'
    },
    {
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        amount: 24000,
        token: '$UBC',
        timestamp: 1736821082,
        signature: 'f97otPQd1coLpXkugH62iRsX9nA4V6NwjBwnLDYfcqkde2woz44ToNkLNjSj7AQALE4LBph8kxckz9tvXFKe8sF'
    },
    {
        swarm_id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
        amount: 150150,
        token: '$UBC',
        timestamp: 1736821082,
        signature: 'TVanohYtSjpdzVk4WspjD29XFTDEwmnvhoTJajnRmmkdtTmS4Yj9X5GUz45V1gEhquoRsuNXf51UN8rTwCTe5HK'
    },
    {
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        amount: 20.86,
        token: '$UBC',
        timestamp: 1736821082,
        signature: 'dLi5PUsCR6Q5Yc5peteaYHLJStSnKuHpiEnp4c17P3GPotwnAjKjBRL5pu9gQUEWJpqWMTd3Kc5rHdLk3otjctM'
    },
    {
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        amount: 24000,
        token: '$UBC',
        timestamp: 1736821082,
        signature: 'f97otPQd1coLpXkugH62iRsX9nA4V6NwjBwnLDYfcqkde2woz44ToNkLNjSj7AQALE4LBph8kxckz9tvXFKe8sF'
    },
    {
        swarm_id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
        amount: 150150,
        token: '$UBC',
        timestamp: 1736821082,
        signature: 'TVanohYtSjpdzVk4WspjD29XFTDEwmnvhoTJajnRmmkdtTmS4Yj9X5GUz45V1gEhquoRsuNXf51UN8rTwCTe5HK'
    },
    {
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        amount: 20.86,
        token: '$UBC',
        timestamp: 1736821082,
        signature: 'dLi5PUsCR6Q5Yc5peteaYHLJStSnKuHpiEnp4c17P3GPotwnAjKjBRL5pu9gQUEWJpqWMTd3Kc5rHdLk3otjctM'
    },
    {
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        amount: 24000,
        token: '$UBC',
        timestamp: 1736821082,
        signature: 'f97otPQd1coLpXkugH62iRsX9nA4V6NwjBwnLDYfcqkde2woz44ToNkLNjSj7AQALE4LBph8kxckz9tvXFKe8sF'
    },
    {
        swarm_id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
        amount: 150150,
        token: '$UBC',
        timestamp: 1736821082,
        signature: 'TVanohYtSjpdzVk4WspjD29XFTDEwmnvhoTJajnRmmkdtTmS4Yj9X5GUz45V1gEhquoRsuNXf51UN8rTwCTe5HK'
    },
    {
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        amount: 20.86,
        token: '$UBC',
        timestamp: 1736821082,
        signature: 'dLi5PUsCR6Q5Yc5peteaYHLJStSnKuHpiEnp4c17P3GPotwnAjKjBRL5pu9gQUEWJpqWMTd3Kc5rHdLk3otjctM'
    },
    {
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        amount: 24000,
        token: '$UBC',
        timestamp: 1736821082,
        signature: 'f97otPQd1coLpXkugH62iRsX9nA4V6NwjBwnLDYfcqkde2woz44ToNkLNjSj7AQALE4LBph8kxckz9tvXFKe8sF'
    },
    {
        swarm_id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
        amount: 150150,
        token: '$UBC',
        timestamp: 1736821082,
        signature: 'TVanohYtSjpdzVk4WspjD29XFTDEwmnvhoTJajnRmmkdtTmS4Yj9X5GUz45V1gEhquoRsuNXf51UN8rTwCTe5HK'
    },
    {
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        amount: 20.86,
        token: '$UBC',
        timestamp: 1736821082,
        signature: 'dLi5PUsCR6Q5Yc5peteaYHLJStSnKuHpiEnp4c17P3GPotwnAjKjBRL5pu9gQUEWJpqWMTd3Kc5rHdLk3otjctM'
    },
    {
        swarm_id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        amount: 24000,
        token: '$UBC',
        timestamp: 1736821082,
        signature: 'f97otPQd1coLpXkugH62iRsX9nA4V6NwjBwnLDYfcqkde2woz44ToNkLNjSj7AQALE4LBph8kxckz9tvXFKe8sF'
    },
    {
        swarm_id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
        amount: 150150,
        token: '$UBC',
        timestamp: 1736821082,
        signature: 'TVanohYtSjpdzVk4WspjD29XFTDEwmnvhoTJajnRmmkdtTmS4Yj9X5GUz45V1gEhquoRsuNXf51UN8rTwCTe5HK'
    },
]

type DividendPayment = {
    swarm_id: string;
    amount: number;
    token: string;
    timestamp: number;
    signature: string;
}

const DividendPayments = ({ className }: { className?: string }) => {

    const ITEMS_PER_PAGE = 10;
    const [transactions, setTransactions] = useState<DividendPayment[]>([]);

    const fetchTransactions = async ({ pageParam }: { pageParam: number }) => {
        await sleep(1000);
        const data = mockDividendPayments.slice(pageParam, pageParam + ITEMS_PER_PAGE);
        setTransactions(oldTxns => [...oldTxns, ...data]);
        return { prevIndex: pageParam }
    }

    const { isFetching, fetchNextPage } = useInfiniteQuery({
        initialPageParam: 0,
        queryKey: ['dividendPayments'],
        queryFn: fetchTransactions,
        getNextPageParam: (lastPage) => lastPage.prevIndex + ITEMS_PER_PAGE,
        refetchOnMount: true,
        staleTime: 60 * 1000
    })

    return (
        <Card className={cn("w-full flex flex-col", className)}>
            <h4 className="mb-4">Dividend payments</h4>
            <DataTable columns={columns} data={transactions} />
            {transactions.length % ITEMS_PER_PAGE === 0 &&
                <Button className="mx-auto mt-8 mb-3" onClick={() => fetchNextPage()} disabled={isFetching}>
                    {isFetching ? <LucideLoader className="animate-spin" /> : 'Load more'}
                </Button>
            }
        </Card>
    );
};

export { DividendPayments };
export type { DividendPayment }