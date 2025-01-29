'use client'

import { Button } from "@/components/shadcn/button";
import { ConnectButton } from "@/components/solana/connectButton";
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input";

const getSwarmStage = (swarmType: string) => {
    switch (swarmType) {
        case 'inception': return 0; // Idea stage
        case 'early': return 2;     // Prototype stage
        case 'partner': return 4;    // Scaling stage
        default: return 0;
    }
};
import { useLaunchpadProgram } from "@/hooks/useLaunchpadProgram";
import { Copy } from 'lucide-react';
import { calculateSharePrice, cn, IntlNumberFormat, IntlNumberFormatCompact } from "@/lib/utils";
import { toast } from 'sonner';
import { useWallet } from "@solana/wallet-adapter-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useLaunchpadProgramAccount } from "@/hooks/useLaunchpadProgram";
import { getSwarmUsingPoolId } from "@/data/swarms/info";

interface SwarmInvestCardProps {
    pool: string;
    className?: string;
    marketCapOnly?: boolean;
}

const SwarmInvestCard = ({ pool, className, marketCapOnly }: SwarmInvestCardProps) => {
    const { connected } = useWallet();
    const [numShares, setNumShares] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
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

    const handleQuickAmount = (amount: number) => {
        if (amount > data.remainingSupply) return;
        setNumShares(amount);
        setPrice(Math.floor(amount * data.pricePerShare));
    };

    const handleBuy = () => {
        if (!numShares || numShares <= 0) {
            toast.error("Please enter a valid number of shares");
            return;
            return;
        }

        setIsLoading(true);
        const calculatedCostInBaseUnits = Math.floor(price * Math.pow(10, 6));
        
        const swarm = getSwarmUsingPoolId(pool);
        if (!swarm) {
            toast.error("Invalid swarm");
            return;
        }

        toast.promise(purchaseShares.mutateAsync({ 
            numberOfShares: numShares, 
            calculatedCost: calculatedCostInBaseUnits
        }), {
            loading: 'Transaction pending...',
            success: (result) => {
                // Webhook notification
                const swarm = getSwarmUsingPoolId(pool);
                fetch('https://nlr.app.n8n.cloud/webhook/buybot', {
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
                }).catch((webhookError) => {
                    console.debug('Webhook notification failed:', webhookError);
                });
                setNumShares(0);
                setPrice(0);
                setIsLoading(false);
                return `Successfully purchased ${numShares} shares!`;
            },
            error: (error) => {
                console.error('Purchase error:', error);
                setIsLoading(false);
                return error instanceof Error ? error.message : 'Transaction failed';
            }
        });
    }

    if (marketCapOnly) {
        const marketCap = (data.totalSupply - data.remainingSupply) * data.pricePerShare;
        return `${IntlNumberFormatCompact(marketCap)}`;
    }

    return (
        <div className={cn("space-y-6 w-full", className)}>
            {/* Buy UI Card */}
            <Card className="bg-[#0f172a] p-6 w-full">
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
                            className="absolute h-full bg-gradient-to-l from-blue-500 to-blue-400 rounded-full transition-all duration-300"
                            style={{ 
                                width: `${(data.remainingSupply / data.totalSupply) * 100}%`,
                                right: '0',
                                boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                            }} 
                        />
                        <div 
                            className="absolute h-full w-[2px] bg-white/30 blur-[2px] animate-pulse"
                            style={{ 
                                right: `${(data.remainingSupply / data.totalSupply) * 100}%`,
                                transform: 'translateX(50%)'
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

            {/* Swarm Information Card */}
            <Card className="bg-[#0f172a] p-6 w-full">
                <h3 className="text-lg font-semibold text-white mb-4">Swarm Information</h3>
                
                {/* Wallet Address */}
                <div className="bg-slate-800/30 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-slate-400">Swarm Wallet</span>
                        <div className="flex items-center gap-2">
                            <a 
                                href={`https://solscan.io/account/${getSwarmUsingPoolId(pool)?.wallet}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-slate-300 font-mono hover:text-blue-400 transition-colors"
                            >
                                {getSwarmUsingPoolId(pool)?.wallet 
                                    ? `${getSwarmUsingPoolId(pool)?.wallet.slice(0, 4)}...${getSwarmUsingPoolId(pool)?.wallet.slice(-4)}`
                                    : "Not available"
                                }
                            </a>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                    const wallet = getSwarmUsingPoolId(pool)?.wallet;
                                    if (wallet) {
                                        navigator.clipboard.writeText(wallet);
                                        toast.success('Wallet address copied to clipboard');
                                    }
                                }}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Telegram Group */}
                <div className="bg-slate-800/30 rounded-lg p-4 mt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Telegram Group</span>
                        <a 
                            href={`https://t.me/${getSwarmUsingPoolId(pool)?.name.toLowerCase()}_ubc`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            t.me/{getSwarmUsingPoolId(pool)?.name.toLowerCase()}_ubc
                        </a>
                    </div>
                </div>

                {/* Additional stats */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-slate-800/30 rounded-lg p-4">
                        <span className="text-sm text-slate-400">Total Investors</span>
                        <p className="text-lg font-semibold text-white">Coming Soon</p>
                    </div>
                    <div className="bg-slate-800/30 rounded-lg p-4">
                        <span className="text-sm text-slate-400">Revenue Distributed</span>
                        <p className="text-lg font-semibold text-white">
                            {getSwarmUsingPoolId(pool)?.revenueShare || 60}%
                        </p>
                    </div>
                    <div className="bg-slate-800/30 rounded-lg p-4">
                        <span className="text-sm text-slate-400">Revenue to Date</span>
                        <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold text-white">-</p>
                            <span className="text-xs metallic-text">$COMPUTE</span>
                        </div>
                    </div>
                    <div className="bg-slate-800/30 rounded-lg p-4">
                        <span className="text-sm text-slate-400">Last Week Revenue</span>
                        <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold text-white">-</p>
                            <span className="text-xs metallic-text">$COMPUTE</span>
                            <span className="text-xs text-slate-400">
                                <span className="text-green-400">↑</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Team info box */}
                <div className="mt-4">
                    <div className="bg-slate-800/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-400">Team</span>
                            <span className="text-xs text-slate-500">Coming Soon</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-700/50 animate-pulse" />
                            <div className="w-8 h-8 rounded-full bg-slate-700/50 animate-pulse" />
                            <div className="w-8 h-8 rounded-full bg-slate-700/50 animate-pulse" />
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-sm text-slate-400 mb-4">Development Stage</h4>
                    <div className="relative flex flex-col gap-8">
                        {/* Timeline line */}
                        <div className="absolute left-[11px] top-[24px] bottom-4 w-[2px] bg-gradient-to-b from-blue-500/50 via-slate-700 to-slate-700/50" />
                            
                        {/* Timeline nodes */}
                        {[
                            { label: 'Idea', description: 'Initial concept and planning' },
                            { label: 'POC', description: 'Proof of concept development' },
                            { label: 'Prototype', description: 'Working prototype and testing' },
                            { label: 'First Sale', description: 'Market validation and revenue' },
                            { label: 'Scaling', description: 'Growth and expansion' }
                        ].map((stage, index) => {
                            const swarm = getSwarmUsingPoolId(pool);
                            const currentStage = getSwarmStage(swarm?.swarmType || 'inception');
                            const isActive = index <= currentStage;
                            const isCurrent = index === currentStage;

                            return (
                                <div key={stage.label} className="flex items-start gap-4">
                                    <div className="relative">
                                        {/* Background glow for active nodes */}
                                        {isActive && (
                                            <div className="absolute inset-0 bg-blue-500/20 blur-xl transform scale-150" />
                                        )}
                                        
                                        {/* Outer ring */}
                                        <div className={cn(
                                            "w-6 h-6 rounded-full border-2 z-10 relative",
                                            isCurrent ? "border-blue-500" : 
                                            isActive ? "border-slate-400" : 
                                            "border-slate-700",
                                            "bg-[#0f172a]" // Match card background
                                        )}>
                                            {/* Inner dot */}
                                            <div className={cn(
                                                "absolute inset-[4px] rounded-full",
                                                isCurrent ? "bg-blue-500" : 
                                                isActive ? "bg-slate-400" : 
                                                "bg-slate-700"
                                            )} />
                                            
                                            {/* Animated rings for current stage */}
                                            {isCurrent && (
                                                <>
                                                    <div className="absolute inset-0 rounded-full border-2 border-blue-500/50 animate-ping" />
                                                    <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-pulse" />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                        
                                    {/* Content with hover effect */}
                                    <div className={cn(
                                        "flex-1 p-2 rounded-lg transition-colors duration-200",
                                        isActive ? "text-slate-200 hover:bg-slate-800/30" : "text-slate-600 hover:bg-slate-800/10",
                                        "cursor-default"
                                    )}>
                                        <h5 className={cn(
                                            "text-sm font-medium mb-1",
                                            isCurrent && "text-blue-400"
                                        )}>{stage.label}</h5>
                                        <p className="text-xs opacity-80">{stage.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>
        </div>
    )
}

export { SwarmInvestCard }
