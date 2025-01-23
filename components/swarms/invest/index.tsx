'use client'

import { Button } from "@/components/shadcn/button";
import { ConnectButton } from "@/components/solana/connectButton";
import { Token } from "@/components/tokens/token";
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { supportedTokens } from "@/data/tokens/supported";
import { useLaunchpadProgram } from "@/hooks/useLaunchpadProgram";
import { calculateSharePrice, cn, IntlNumberFormat, IntlNumberFormatCompact } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useLaunchpadProgramAccount } from "@/hooks/useLaunchpadProgram";
import { Tag } from "@/components/ui/tag";

interface SwarmInvestCardProps {
    pool: string;
    className?: string;
}

const SwarmInvestCard = ({ pool, className }: SwarmInvestCardProps) => {

    const { connected } = useWallet();

    const sharesRef = useRef<HTMLParagraphElement>(null);

    const [numShares, setNumShares] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [fee, setFee] = useState<number>(0);
    const [data, setData] = useState({
        totalSupply: 0,
        remainingSupply: 0,
        pricePerShare: 0,
        frozen: true,
    });


    const { pools } = useLaunchpadProgram();
    const { poolAccount, purchaseShares } = useLaunchpadProgramAccount({ poolAddress: pool });

    useEffect(() => {
        console.log(poolAccount.data && poolAccount.data.isFrozen);
        setData({
            totalSupply: poolAccount.data?.totalShares.toNumber(),
            remainingSupply: poolAccount.data?.availableShares.toNumber(),
            pricePerShare: calculateSharePrice(poolAccount.data?.totalShares.toNumber() - poolAccount.data?.availableShares.toNumber()),
            frozen: poolAccount.data?.isFrozen || true,
        })
    }, [poolAccount.data, pools.data]);

    const handleSharesInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value.replace(/,/g, ''));
        if (isNaN(value) || value < 0 || value > 1000) return;
        setPrice(Math.floor((Number(value))) * (data.pricePerShare));
        setNumShares(value);
    }

    const handleComputeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value.replace(/,/g, '')); // Remove commas for calculation
        const calculatedShares = Math.round(value / data.pricePerShare);
        if (isNaN(value) || value < 0 || calculatedShares > 1000) return;
        // Calculate shares, rounding to nearest whole number
        setNumShares(calculatedShares);
        setPrice(value);
    }

    const handleBuy = () => {
        purchaseShares.mutateAsync({ numberOfShares: numShares, calculatedCost: price });
    }

    useEffect(() => {
        setFee(price / poolAccount.data?.feeRatio.toNumber());
    }, [price, poolAccount.data?.feeRatio]);

    return (
        <Card className={cn("w-full", className)}>
            <div className="w-full flex flex-row justify-between items-center">
                <h4>Purchase Shares</h4>
                <div className="flex flex-row items-center gap-1">
                    <p className="text-muted">Available: <strong>{IntlNumberFormatCompact(data.remainingSupply) || 0}</strong></p>
                </div>
            </div>
            <div className="flex flex-col gap-8 md:flex-row md:gap-none justify-between mt-6">
                <div className="flex flex-col basis-1/2 md:max-w-[48%]">
                    <div className="border border-border rounded-md bg-card p-4 pb-2 flex flex-col">
                        <p className="text-muted text-sm">You&apos;ll receive</p>
                        <div className="flex flex-row">
                            <Input
                                className="border-none rounded-none bg-transparent pl-0 text-4xl font-bold no-arrows"
                                style={{
                                    width: `calc(${data.remainingSupply !== 0 ? IntlNumberFormat(numShares).length || 1 : 8}ch + ${connected ? 1 : 2}rem)`,
                                    maxWidth: `calc(100% - ${sharesRef.current?.offsetWidth}px - 10px)`,
                                }}
                                placeholder={data.remainingSupply === 0 ? 'Sold out' : '0'}
                                disabled={data.remainingSupply === 0}
                                value={numShares !== 0 ? IntlNumberFormat(numShares) : ''}
                                onChange={handleSharesInput}
                            />
                            {data.remainingSupply !== 0 && <p className="mt-auto mb-4" ref={sharesRef}>/ Shares</p>}
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center px-4 mt-2">
                        <p className="text-sm text-muted">1 share = {IntlNumberFormat(data.pricePerShare)} $COMPUTE</p>
                        <p className="text-sm text-muted">Total supply: {IntlNumberFormatCompact(data.totalSupply)}</p>
                    </div>
                </div>
                <div className="flex flex-col basis-1/2 md:max-w-[48%]">
                    <div className="border border-border flex flex-row items-center rounded-md bg-card">
                        <div className="p-4 pb-2 flex flex-col flex-grow">
                            <p className="text-muted text-sm">You&apos;ll pay</p>
                            <Input
                                className="border-none bg-transparent px-0 text-4xl font-bold !text-foreground no-arrows"
                                placeholder={data.remainingSupply === 0 ? 'Sold out' : '0'}
                                disabled={data.remainingSupply === 0}
                                value={price !== 0 ? IntlNumberFormat(price) : ''}
                                onChange={handleComputeInput}
                                min={0}
                            />
                        </div>
                        <Token token={supportedTokens[1]} className="h-fit text-lg mr-6" />
                    </div>
                    <p className="text-sm text-muted pl-4 mt-2">Minimum: {IntlNumberFormat(data.pricePerShare)} $COMPUTE</p>
                </div>
            </div>
            {fee > 0 &&
                <div className="flex flex-row gap-2 items-center mt-6 pl-4">
                    <p>+ Fee: {fee}</p>
                    <Tag className="text-xs">UBC</Tag>
                </div>
            }
            {data.remainingSupply === 0 &&
                <Button
                    className="mt-10 w-full md:max-w-40 bg-foreground text-background font-bold hover:bg-foreground/70"
                    asChild
                >
                    <Link href="/invest/market">Go to market</Link>
                </Button>
            }
            {connected && data.remainingSupply !== 0 &&
                <Button
                    variant='success'
                    onClick={handleBuy}
                    className="mt-10 w-full md:max-w-40"
                    disabled={!numShares || price <= 0}
                >BUY</Button>}
            {!connected && data.remainingSupply !== 0 && <ConnectButton className="mt-10 w-full md:max-w-40" />}
        </Card>
    )
}

export { SwarmInvestCard }
