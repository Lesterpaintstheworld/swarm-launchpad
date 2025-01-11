'use client'

import { Button } from "@/components/shadcn/button";
import { ComputeToken } from "@/components/tokens/compute";
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { cn, IntlNumberFormat, IntlNumberFormatCompact } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";

interface AgentInvestCardProps {
    data: {
        totalSupply: number;
        pricePerShare: number;
        remainingSupply: number;
    },
    className?: string;
}

const AgentInvestCard = ({ data, className }: AgentInvestCardProps) => {

    const { connected } = useWallet();

    const sharesRef = useRef<HTMLParagraphElement>(null);

    const [numShares, setNumShares] = useState<string>('');
    const [price, setPrice] = useState<number>(0);

    const handleSharesInput = (e: ChangeEvent<HTMLInputElement>) => {

        const value = Number(e.target.value);

        if (isNaN(value) || value < 0) return;

        setPrice(Math.floor((Number(value))) * data.pricePerShare);
        setNumShares(String(value));
    }

    useEffect(() => {
        if (!connected) {
            setNumShares('');
            setPrice(0);
        }
    }, [connected])

    const handleBuy = () => { alert('Initiate payment flow') }

    return (
        <Card className={cn("w-full", className)}>
            <div className="w-full flex flex-row justify-between items-center">
                <h4>Invest</h4>
                <p className="text-muted">Total Supply: {IntlNumberFormatCompact(data.totalSupply) || 0}</p>
            </div>
            <div className="flex flex-col gap-8 md:flex-row md:gap-none justify-between mt-6">
                <div className="flex flex-col basis-1/2 md:max-w-[48%]">
                    <div className="border border-border rounded-md bg-card p-4 pb-2 flex flex-col">
                        <p className="text-muted text-sm">You&apos;ll receive</p>
                        <div className="flex flex-row">
                            <Input
                                className="border-none rounded-none bg-transparent pl-0 text-4xl font-bold no-arrows"
                                style={{
                                    width: `calc(${data.remainingSupply !== 0 ? numShares.length || 1 : 8}ch + ${connected ? 1 : 2}rem)`,
                                    maxWidth: `calc(100% - ${sharesRef.current?.offsetWidth}px - 10px)`,
                                }}
                                disabled={!connected || data.remainingSupply === 0}
                                type="number"
                                placeholder={data.remainingSupply === 0 ? 'Sold out' : connected ? '0' : '--'}
                                step={1}
                                min={0}
                                value={connected ? Number(numShares) !== 0 ? numShares : '' : ''}
                                onChange={handleSharesInput}
                            />
                            {data.remainingSupply !== 0 && <p className="mt-auto mb-4" ref={sharesRef}>/ Shares</p>}
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center px-4 mt-2">
                        <p className="text-sm text-muted">1 share = {IntlNumberFormat(data.pricePerShare)} $COMPUTE</p>
                        <p className="text-sm text-muted">Remaining: {IntlNumberFormatCompact(data.remainingSupply)}</p>
                    </div>
                </div>
                <div className="flex flex-col basis-1/2 md:max-w-[48%]">
                    <div className="border border-border flex flex-row items-center rounded-md bg-card">
                        <div className="p-4 pb-2 flex flex-col flex-grow">
                            <p className="text-muted text-sm">You&apos;ll pay</p>
                            <Input
                                className="border-none bg-transparent px-0 text-4xl font-bold !text-foreground no-arrows"
                                placeholder={data.remainingSupply === 0 ? 'Sold out' : connected ? '10,000' : '--'}
                                disabled
                                value={price !== 0 ? IntlNumberFormat(price) : ''}
                                min={0}
                            />
                        </div>
                        <ComputeToken className="h-fit text-lg mr-6" />
                    </div>
                    <p className="text-sm text-muted pl-4 mt-2">Minimum: {IntlNumberFormat(data.pricePerShare)} $COMPUTE</p>
                </div>
            </div>
            {data.remainingSupply === 0 &&
                <Button
                    className="mt-10 w-full md:max-w-40 bg-foreground text-background font-bold hover:bg-foreground/70"
                    asChild
                >
                    <Link href="/invest/market">Go to market</Link>
                </Button>
            }
            {connected && data.remainingSupply !== 0 && <Button variant='success' onClick={handleBuy} className="mt-10 w-full md:max-w-40">BUY</Button>}
            {!connected && data.remainingSupply !== 0 && <Button disabled className="mt-10 w-full md:max-w-40">Requires Wallet</Button>}
        </Card>
    )
}

export { AgentInvestCard }