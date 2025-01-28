'use client'

import { Button } from "@/components/shadcn/button";
import { ConnectButton } from "@/components/solana/connectButton";
import { Token } from "@/components/tokens/token";
import { getSwarm } from "@/data/swarms/previews";
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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [data, setData] = useState({
        totalSupply: 0,
        remainingSupply: 0,
        pricePerShare: 0,
        frozen: true,
    });

    const { pools } = useLaunchpadProgram();
    const { poolAccount, purchaseShares } = useLaunchpadProgramAccount({ poolAddress: pool });

    useEffect(() => {
        if (poolAccount.data) {
            setData({
                totalSupply: poolAccount.data.totalShares.toNumber(),
                remainingSupply: poolAccount.data.availableShares.toNumber(),
                pricePerShare: calculateSharePrice(poolAccount.data.totalShares.toNumber() - poolAccount.data.availableShares.toNumber()),
                frozen: poolAccount.data.isFrozen || false,
            });
        }
    }, [poolAccount.data, pools.data]);

    const handleSharesInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value.replace(/,/g, ''));
        if (isNaN(value) || value < 0 || value > data.remainingSupply) return;
        setPrice(Math.floor(value * data.pricePerShare));
        setNumShares(value);
    }

    const handleComputeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value.replace(/,/g, '')); 
        const calculatedShares = Math.round(value / data.pricePerShare);
        if (isNaN(value) || value < 0 || calculatedShares > data.remainingSupply) return;
        setNumShares(calculatedShares);
        setPrice(value);
    }

    const handleComputeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value.replace(/,/g, '')); 
        // Calculate shares based on correctly scaled price
        const calculatedShares = Math.round(value / data.pricePerShare);
        if (isNaN(value) || value < 0 || calculatedShares > 1000) return;
        setNumShares(calculatedShares);
        setPrice(value);
    }

    const handleQuickAmount = (amount: number) => {
        if (amount > data.remainingSupply) return;
        setNumShares(amount);
        setPrice(Math.floor(amount * data.pricePerShare));
    }

    const validateInput = (shares: number) => {
        if (shares <= 0) return "Amount must be greater than 0";
        if (shares > data.remainingSupply) return "Amount exceeds available shares";
        if (!Number.isInteger(shares)) return "Amount must be a whole number";
        return null;
    };

    const handleBuy = async () => {
        if (!numShares || numShares <= 0) {
            setError("Please enter a valid number of shares");
            return;
        }

        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);
        
        try {
            const calculatedCostInBaseUnits = Math.floor(price * Math.pow(10, 6));
            const result = await purchaseShares.mutateAsync({ 
                numberOfShares: numShares, 
                calculatedCost: calculatedCostInBaseUnits
            });

            // Webhook notification
            try {
                const swarm = getSwarm(pool);
                await fetch('https://nlr.app.n8n.cloud/webhook/buybot', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        swarmName: swarm?.name || 'Unknown Swarm',
                        numberOfShares: numShares,
                        pricePerShare: data.pricePerShare,
                        totalCost: price,
                        poolAddress: pool,
                        timestamp: new Date().toISOString(),
                        transactionSignature: result
                    })
                });
            } catch (webhookError) {
                console.debug('Webhook notification failed:', webhookError);
            }

            setSuccessMessage(`Successfully purchased ${numShares} shares!`);
            setNumShares(0);
            setPrice(0);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Transaction failed');
            console.error('Purchase error:', error);
        } finally {
            setIsLoading(false);
        }
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
            {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 flex items-center justify-between">
                    <span>{successMessage}</span>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSuccessMessage(null)}
                        className="hover:bg-green-500/10"
                    >
                        ✕
                    </Button>
                </div>
            )}

            {connected && data.remainingSupply !== 0 &&
                <Button
                    variant='success'
                    onClick={handleBuy}
                    className="mt-10 w-full md:max-w-40"
                    disabled={!numShares || price <= 0 || isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <span className="animate-spin">⚪</span>
                            Processing...
                        </div>
                    ) : (
                        'BUY'
                    )}
                </Button>
            }
            {!connected && data.remainingSupply !== 0 && <ConnectButton className="mt-10 w-full md:max-w-40" />}

            <div className="grid grid-cols-4 gap-2 mt-4">
                {[10, 100, 500, 1000].map((amount) => (
                    <Button
                        key={amount}
                        onClick={() => handleQuickAmount(amount)}
                        variant="secondary"
                        className="bg-slate-700 hover:bg-slate-600 relative group"
                        disabled={amount > data.remainingSupply}
                        title={amount > data.remainingSupply ? "Exceeds available shares" : `Buy ${amount} shares`}
                    >
                        {amount}
                        {amount > data.remainingSupply && (
                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Exceeds available shares
                            </span>
                        )}
                    </Button>
                ))}
            </div>
        </Card>
    )
}

export { SwarmInvestCard }
