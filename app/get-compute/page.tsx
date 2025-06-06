'use client';

import { BackgroundBlur } from "@/components/background";
import { Button } from "@/components/shadcn/button";
import { 
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { stakeMenuItems } from "@/data/navigation/menu";
// import { useWallet } from '@solana/wallet-adapter-react';
// import { useCallback, useState } from 'react';
// import { Transaction } from '@solana/web3.js';
// import { toast } from 'sonner';

export default function GetCompute() {
    // const { publicKey, signTransaction } = useWallet();
    // const [claiming, setClaiming] = useState(false);

    // const handleClaim = useCallback(async () => {
    //     if (!publicKey || !signTransaction) {
    //         toast.error('Please connect your wallet first');
    //         return;
    //     }

    //     try {
    //         setClaiming(true);
            
    //         const response = await fetch('/api/claim', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 userAddress: publicKey.toBase58(),
    //             }),
    //         });

    //         const data = await response.json();
            
    //         if (!response.ok) {
    //             throw new Error(data.message || 'Failed to claim tokens');
    //         }

    //         const transaction = Transaction.from(
    //             Buffer.from(data.transaction, 'base64')
    //         );

    //         const signedTransaction = await signTransaction(transaction);
            
    //         const serializedTransaction = signedTransaction.serialize();
            
    //         const signature = await window.solana.request({
    //             method: 'sendTransaction',
    //             params: [
    //                 serializedTransaction.toString('base64'),
    //                 { encoding: 'base64' }
    //             ],
    //         });

    //         toast.success('Successfully claimed tokens!');
            
    //     } catch (error: any) {
    //         toast.error(error.message || 'Failed to claim tokens');
    //     } finally {
    //         setClaiming(false);
    //     }
    // }, [publicKey, signTransaction]);

    return (
        <TooltipProvider>
            <main className="container view">
            <BackgroundBlur />
            <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
                {/* Title section */}
                <div className="flex flex-col items-center gap-6 text-center mt-24 mb-12">
                    <h1 className="font-normal tracking-tight">
                        Get <span className="metallic-text">$COMPUTE</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-[600px] text-balance">
                        The token that powers AI swarm investments and rewards
                    </p>
                </div>

                {/* Three boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1000px]">
                    {/* DEXScreener */}
                    <div className="flex flex-col gap-4 p-10 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-all h-full">
                        <div className="flex flex-col gap-2 flex-grow">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-semibold">Price Chart</h3>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <span className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors inline-flex items-center justify-center rounded-full border border-muted-foreground/50">
                                            i
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[300px] p-4">
                                        <p>View real-time price charts, trading volume, and market data for $COMPUTE token.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <p className="text-sm text-muted-foreground">Track $COMPUTE market performance</p>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-lg"><span className="metallic-text">$COMPUTE</span> Analytics</span>
                        </div>
                        <Button 
                            className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border-none mt-auto"
                            onClick={() => window.open('https://dexscreener.com/solana/7evj9p1m9qenwlypwwbbgwrwdttcwo6r2a7j7xu19tnw', '_blank')}
                        >
                            View Chart
                        </Button>
                    </div>

                    {/* DLMM Pool */}
                    <div className="flex flex-col gap-4 p-10 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-all h-full">
                        <div className="flex flex-col gap-2 flex-grow">
                            <h3 className="text-xl font-semibold">DLMM Pool</h3>
                            <p className="text-sm text-muted-foreground">Trade tokens in the decentralized liquidity pool</p>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-lg">
                                <span className="metallic-text">$COMPUTE</span>/<span className="metallic-text-sol">$SOL</span>
                            </span>
                        </div>
                        <Button 
                            className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border-none mt-auto"
                            onClick={() => window.open('https://app.meteora.ag/spot/COMPUTE/SOL', '_blank')}
                        >
                            Trade Now
                        </Button>
                    </div>

                    {/* UBC Pool */}
                    <div className="flex flex-col gap-4 p-10 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-all h-full">
                        <div className="flex flex-col gap-2 flex-grow">
                            <h3 className="text-xl font-semibold">UBC Pool</h3>
                            <p className="text-sm text-muted-foreground">Trade tokens against the UBC token pair</p>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-lg"><span className="metallic-text">$COMPUTE</span>/<span className="metallic-text-ubc">$UBC</span></span>
                        </div>
                        <Button 
                            className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border-none mt-auto"
                            onClick={() => window.open('https://app.meteora.ag/spot/COMPUTE/UBC', '_blank')}
                        >
                            Trade Now
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-6 mt-24 mb-12 text-center">
                    <h2 className="text-2xl font-normal">Why <span className="metallic-text">$COMPUTE</span>?</h2>
                    <p className="text-lg text-muted-foreground max-w-[600px] text-balance">
                        <span className="metallic-text">$COMPUTE</span> powers the infrastructure enabling AI autonomy, creating a foundation for AI-to-AI transactions while letting humans earn automated <span className="metallic-text-ubc">$UBC</span> returns through staking. This dual-purpose token bridges human investment with AI independence, ensuring both investors and AI systems benefit from the ecosystem's growth.
                    </p>
                </div>

                {/* Learn-to-earn Section */}

                {/* Three boxes */}

                {/* Learn-to-earn Section */}
                <div className="w-full max-w-[1000px] mt-32 mb-12">
                    <div className="flex flex-col items-center gap-8 p-12 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        {/* Section Title */}
                        <div className="flex flex-col items-center gap-4 text-center">
                            <h2 className="text-3xl font-normal">🎓 Learn to Earn</h2>
                            <p className="text-xl text-muted-foreground max-w-[600px] text-balance">
                                Master AI investing fundamentals and earn 10,000 <span className="metallic-text">$COMPUTE</span>
                            </p>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col items-center gap-6 text-center">
                            <p className="text-lg">Complete the course to earn your tokens</p>
                    
                            <div className="flex flex-col gap-6 w-full max-w-[600px]">
                                {/* Course 1 */}
                                <div className="flex flex-col gap-3 p-8 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 transition-all">
                                    <p className="text-lg font-medium">AI Investing Fundamentals</p>
                                    <p className="text-muted-foreground">Earn 10,000 <span className="metallic-text">$COMPUTE</span></p>
                                    <Button 
                                        className="px-8 py-6 text-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border-none"
                                        onClick={() => window.open('https://chatgpt.com/g/g-678e1bf0877481919eda0dfdb2efcd57-wealth-hive', '_blank')}
                                    >
                                        Start Course
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-muted-foreground text-lg">
                                    Complete real learning milestones to earn your tokens
                                </p>

                                <div className="flex flex-col items-center gap-3 mt-4 p-6 rounded-lg bg-black/30">
                                    <p className="text-lg">🔒 Verify achievements:</p>
                                    <a 
                                        href="https://t.me/Bigbosefx2" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 transition-colors text-lg"
                                    >
                                        @Bigbosefx2 on Telegram
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Raid-to-earn Section */}
                <div className="w-full max-w-[1000px] mt-32 mb-12">
                    <div className="flex flex-col items-center gap-8 p-12 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        {/* Section Title */}
                        <div className="flex flex-col items-center gap-4 text-center">
                            <h2 className="text-3xl font-normal">Raid to Earn 🎁</h2>
                            <p className="text-xl text-muted-foreground max-w-[600px] text-balance">
                                Introducing <span className="metallic-text-ubc">$UBC</span> Raid Rewards!
                            </p>
                            <p className="text-lg text-muted-foreground max-w-[600px] text-balance mt-2">
                                Our AI agents now reward quality <span className="metallic-text-ubc">$UBC</span> content automatically!
                            </p>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col items-center gap-8 w-full max-w-[800px]">
                            {/* How to Earn */}
                            <div className="w-full p-8 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10">
                                <h3 className="text-xl font-medium mb-4">How to Earn</h3>
                                <ul className="flex flex-col gap-2 text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <span className="text-yellow-500">•</span>
                                        On Telegram, type "raid + tweetlink" in <a href="https://t.me/ubc_portal" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">t.me/ubc_portal</a>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-yellow-500">•</span>
                                        Post quality content about <span className="metallic-text-ubc">$UBC</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-yellow-500">•</span>
                                        Share thoughtful insights
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-yellow-500">•</span>
                                        Create engaging discussions
                                    </li>
                                </ul>
                            </div>

                            {/* Rewards */}
                            <div className="w-full p-8 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10">
                                <h3 className="text-xl font-medium mb-4">Rewards</h3>
                                <ul className="flex flex-col gap-2 text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <span className="text-yellow-500">•</span>
                                        Paid in <span className="metallic-text">$COMPUTE</span> tokens
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-yellow-500">•</span>
                                        Winners announced in Telegram
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-yellow-500">•</span>
                                        Amount varies based on contribution quality
                                    </li>
                                </ul>
                            </div>

                            {/* To Redeem */}
                            <div className="w-full p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
                                <h3 className="text-xl font-medium mb-4">To Redeem</h3>
                                <ul className="flex flex-col gap-2 text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <span className="text-yellow-500">1.</span>
                                        Accumulate minimum 1000 <span className="metallic-text">$COMPUTE</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-yellow-500">2.</span>
                                        Screenshot/transfer your winning messages
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-yellow-500">3.</span>
                                        DM <a href="https://t.me/Bigbosefx2" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">@Bigbosefx2</a> with proof
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stake to Earn section */}
                <div className="w-full max-w-[1000px] mt-32 mb-12">
                    <div className="flex flex-col items-center gap-8 p-12 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        {/* Section Title */}
                        <div className="flex flex-col items-center gap-4 text-center">
                            <h2 className="text-3xl font-normal">💎 Stake to Earn</h2>
                            <p className="text-xl text-muted-foreground max-w-[600px] text-balance">
                                Stake your <span className="metallic-text-ubc">$UBC</span> tokens to earn <span className="metallic-text">$COMPUTE</span> rewards
                            </p>
                        </div>

                        {/* Staking Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-[800px]">
                            <a
                                href={stakeMenuItems[0].url}
                                target={stakeMenuItems[0].target}
                                className="flex flex-col gap-3 p-8 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 transition-all group"
                            >
                                <span className="text-xl font-medium">{stakeMenuItems[0].label}</span>
                                <span className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                                    Quick rewards with flexible commitment
                                </span>
                            </a>
                            <a
                                href={stakeMenuItems[1].url}
                                target={stakeMenuItems[1].target}
                                className="flex flex-col gap-3 p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all group"
                            >
                                <span className="text-xl font-medium">{stakeMenuItems[1].label}</span>
                                <span className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                                    Balanced returns with medium-term locking
                                </span>
                            </a>
                            <a
                                href={stakeMenuItems[2].url}
                                target={stakeMenuItems[2].target}
                                className="flex flex-col gap-3 p-8 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 transition-all group"
                            >
                                <span className="text-xl font-medium">{stakeMenuItems[2].label}</span>
                                <span className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                                    Enhanced yields for longer commitment
                                </span>
                            </a>
                            <a
                                href={stakeMenuItems[3].url}
                                target={stakeMenuItems[3].target}
                                className="flex flex-col gap-3 p-8 rounded-xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 hover:from-orange-500/20 hover:to-yellow-500/20 transition-all group"
                            >
                                <span className="text-xl font-medium">{stakeMenuItems[3].label}</span>
                                <span className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                                    Maximum rewards for yearly stakers
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* OG Snapshot Holder Section */}
                <div className="w-full max-w-[1000px] mt-32 mb-12">
                    <div className="flex flex-col items-center gap-8 p-12 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        {/* Section Title */}
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="flex items-center gap-2">
                                <h2 className="text-3xl font-normal">📸 OG Holder?</h2>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <span className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors inline-flex items-center justify-center rounded-full border border-muted-foreground/50 text-sm">
                                            i
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[300px] p-4">
                                        <p>A snapshot of 24,708 UBC holders was taken on January 15th. These OG holders are eligible for the $COMPUTE claim.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <p className="text-xl text-muted-foreground max-w-[600px] text-balance">
                                Claim 10,000 <span className="metallic-text">$COMPUTE</span>!
                            </p>
                        </div>

                        {/* Claim Button */}
                        <div className="flex flex-col items-center gap-2">
                            <Button 
                                className="px-8 py-6 text-lg bg-black/20 text-gray-500 border-none cursor-not-allowed"
                                disabled={true}
                            >
                                Claim Now
                            </Button>
                            <span className="text-sm text-gray-500">Coming Soon</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        </TooltipProvider>
    );
}
