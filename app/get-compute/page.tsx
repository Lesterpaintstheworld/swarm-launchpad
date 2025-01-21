'use client';

import { BackgroundBlur } from "@/components/background";
import { Button } from "@/components/shadcn/button";
import { Countdown } from "@/components/ui/countdown";
import { 
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { InfoCircled } from "@radix-ui/react-icons";
import { stakeMenuItems } from "@/data/navigation/menu";

export default function GetCompute() {
    return (
        <TooltipProvider>
            <main className="container view">
            <BackgroundBlur />
            <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
                {/* Title section */}
                <div className="flex flex-col items-center gap-6 text-center mt-24">
                    <h1 className="font-normal tracking-tight">
                        Get <span className="metallic-text">$COMPUTE</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-[600px] text-balance">
                        The token that powers AI swarm investments and rewards
                    </p>
                </div>

                {/* Countdown */}
                <Countdown />

                {/* Add more vertical space after countdown */}
                <div className="h-8" />

                {/* Three boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1000px]">
                    {/* Public Sale */}
                    <div className="flex flex-col gap-4 p-10 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-all h-full">
                        <div className="flex flex-col gap-2 flex-grow">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-semibold">Public Sale (LBP)</h3>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <span className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors inline-flex items-center justify-center rounded-full border border-muted-foreground/50">
                                            i
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[300px] p-4">
                                        <p>A Liquidity Bootstrapping Pool (LBP) is a fair launch mechanism that prevents price manipulation and whale dominance. It starts at a higher price and gradually decreases, allowing for price discovery and equal participation opportunities for all investors.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <p className="text-sm text-muted-foreground">Purchase tokens directly from the public sale</p>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-lg"><span className="metallic-text">$COMPUTE</span> Opening: $0.0581</span>
                        </div>
                        <Button 
                            className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border-none mt-auto"
                            onClick={() => window.open('https://app.fjordfoundry.com/token-sales/4Jot2JtKav3Xd8tSQ2XdMErhnHFab2yushSfXF6BXwq6', '_blank')}
                        >
                            Buy Now
                        </Button>
                    </div>

                    {/* DLMM Pool */}
                    <div className="flex flex-col gap-4 p-10 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-all h-full">
                        <div className="flex flex-col gap-2 flex-grow">
                            <h3 className="text-xl font-semibold">DLMM Pool</h3>
                            <p className="text-sm text-muted-foreground">Trade tokens in the decentralized liquidity pool</p>
                        </div>
                        <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                            <span className="text-lg">
                                <span className="metallic-text">$COMPUTE</span>/<span className="metallic-text-sol">$SOL</span>
                            </span>
                        </div>
                        <Button 
                            className="w-full bg-black/20 text-gray-500 border-none mt-auto cursor-not-allowed"
                            disabled={true}
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
                        <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                            <span className="text-lg"><span className="metallic-text">$COMPUTE</span>/<span className="metallic-text-ubc">$UBC</span></span>
                        </div>
                        <Button 
                            className="w-full bg-black/20 text-gray-500 border-none mt-auto cursor-not-allowed"
                            disabled={true}
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

                {/* Stake to Earn section */}
                <div className="w-full max-w-[1000px] mt-32">
                    <div className="flex flex-col items-center gap-8 p-12 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        {/* Section Title */}
                        <div className="flex flex-col items-center gap-2 text-center">
                            <h2 className="text-3xl font-normal">Stake to Earn</h2>
                            <p className="text-xl text-muted-foreground max-w-[600px] text-balance">
                                Stake your <span className="metallic-text-ubc">$UBC</span> tokens to earn <span className="metallic-text">$COMPUTE</span> rewards
                            </p>
                        </div>

                        {/* Staking Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-[800px]">
                            {stakeMenuItems.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.url}
                                    target={item.target}
                                    className="flex flex-col gap-3 p-8 rounded-xl bg-black/30 hover:bg-black/40 transition-colors group"
                                >
                                    <span className="text-xl font-medium">{item.label}</span>
                                    <span className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                                        Lock your tokens for {item.label.split('-')[0]} days to maximize rewards
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Learn-to-earn Section with improved styling */}
                <div className="w-full max-w-[1000px] mt-32 mb-12">
                    <div className="flex flex-col items-center gap-8 p-12 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        {/* Section Title */}
                        <div className="flex flex-col items-center gap-2 text-center">
                            <h2 className="text-3xl font-normal">Learn-to-earn</h2>
                            <p className="text-xl text-muted-foreground max-w-[600px] text-balance">
                                Master AI investing fundamentals and earn your first 10,000 <span className="metallic-text">$COMPUTE</span>
                            </p>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col items-center gap-6 text-center">
                            <p className="text-lg">Learn from our AI mentor and start earning</p>
                            
                            <Button 
                                className="px-8 py-6 text-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border-none"
                                onClick={() => window.open('https://chatgpt.com/g/g-678e1bf0877481919eda0dfdb2efcd57-wealth-hive', '_blank')}
                            >
                                Start Learning
                            </Button>
                            
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-muted-foreground text-lg">
                                    Complete real learning milestones to earn your tokens
                                </p>

                                <div className="flex flex-col items-center gap-3 mt-4 p-6 rounded-lg bg-black/30">
                                    <p className="text-lg">🔒 Verify achievements:</p>
                                    <a 
                                        href="https://t.me/verifyleo" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 transition-colors text-lg"
                                    >
                                        @verifyleo on Telegram
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        </TooltipProvider>
    );
}
