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
    onMarketDataUpdate?: (data: { soldShares: number; pricePerShare: number; marketCap: number }) => void;
}

const SwarmInvestCard = ({ pool, className, onMarketDataUpdate }: SwarmInvestCardProps) => {
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
        if (poolAccount.data && onMarketDataUpdate) {
            const totalShares = poolAccount.data.totalShares.toNumber();
            const availableShares = poolAccount.data.availableShares.toNumber();
            const soldShares = totalShares - availableShares;
            const pricePerShare = calculateSharePrice(soldShares);
            const marketCap = soldShares * pricePerShare;
            
            onMarketDataUpdate({
                soldShares,
                pricePerShare,
                marketCap
            });
        }
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
        <Card className={cn("bg-[#0f172a] p-6", className)}>
            {/* Header section */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">Purchase Swarm Shares</h2>
                    <p className="text-slate-300">Invest in AI-powered future</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-green-400">CURRENT PRICE</p>
                    <p className="text-2xl font-bold text-green-400">
                        ${IntlNumberFormat(data.pricePerShare, 3)} <span className="text-sm">$COMPUTE</span>
                    </p>
                </div>
            </div>
            <div className="space-y-6">
                {/* Share input section */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm text-slate-300">Amount of Shares</label>
                        <span className="text-sm text-slate-400">
                            Available: {IntlNumberFormat(data.remainingSupply)}
                        </span>
                    </div>
                    
                    <Input
                        type="number"
                        value={numShares || ''}
                        onChange={handleSharesInput}
                        className="w-full bg-slate-800/50 border-slate-700 text-white mb-3"
                        placeholder="0"
                    />

                    {/* Quick amount buttons */}
                    <div className="grid grid-cols-4 gap-2">
                        {[10, 100, 500, 1000].map((amount) => (
                            <Button
                                key={amount}
                                onClick={() => handleQuickAmount(amount)}
                                variant="secondary"
                                className="bg-slate-700 hover:bg-slate-600"
                                disabled={amount > data.remainingSupply}
                            >
                                {amount}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Cost breakdown */}
                <div className="space-y-3 bg-slate-800/50 p-4 rounded-lg">
                    <div className="flex justify-between">
                        <span className="text-slate-300">Cost per Share</span>
                        <span>{IntlNumberFormat(data.pricePerShare)} $COMPUTE</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-300">Total Cost</span>
                        <span className="text-xl font-bold">
                            {IntlNumberFormat(numShares * data.pricePerShare)} $COMPUTE
                        </span>
                    </div>
                </div>

                {/* Supply information */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-400">
                        <span>Remaining Supply</span>
                        <span>{IntlNumberFormat(data.remainingSupply)}</span>
                    </div>
                    <div className="relative h-4 rounded-full bg-slate-800/50 overflow-hidden">
                        <div 
                            className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300"
                            style={{ 
                                width: `${(data.remainingSupply / data.totalSupply) * 100}%`,
                                boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                            }} 
                        />
                        <div 
                            className="absolute h-full w-[2px] bg-white/30 blur-[2px] animate-pulse"
                            style={{ 
                                left: `${(data.remainingSupply / data.totalSupply) * 100}%`,
                                transform: 'translateX(-50%)'
                            }}
                        />
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Total Supply</span>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">{IntlNumberFormat(data.totalSupply)}</span>
                            <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                                <span>{Math.round((data.remainingSupply / data.totalSupply) * 100)}%</span>
                                <span>remaining</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Error/Success messages */}
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

            {/* Action button */}
            {connected ? (
                <Button
                    onClick={handleBuy}
                    className="w-full mt-6"
                    disabled={!numShares || numShares <= 0 || isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <span className="animate-spin">⚪</span>
                            Processing...
                        </div>
                    ) : (
                        'Purchase Shares'
                    )}
                </Button>
            ) : (
                <ConnectButton className="w-full mt-6" />
            )}
        </Card>
    )
}

export { SwarmInvestCard }
