'use client'

import { TokenTooltip } from "@/components/ui/tokenTooltip";
import { getSwarmInfo } from "@/data/swarms/info";
import { previews } from "@/data/swarms/previews";
import { SwarmPreviewCard } from "@/components/swarms/preview";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";

export default function Invest() {
    // Combine preview data with multiples from SwarmData
    const combinedSwarms = previews.map(preview => {
        const swarmInfo = getSwarmInfo(preview.id);
        return {
            ...preview,
            multiple: swarmInfo?.multiple || 1,
            pool: swarmInfo?.pool,
            launchDate: swarmInfo?.launchDate
        };
    });

    // Sort and filter swarms
    const sortedSwarms = combinedSwarms
        .filter(swarm => swarm.pool) // Only show swarms with pools
        .sort((a, b) => (b.multiple || 0) - (a.multiple || 0));

    // Split swarms by type using preview data
    const partnerSwarms = sortedSwarms.filter(swarm => swarm.swarmType === 'partner');
    const earlySwarms = sortedSwarms.filter(swarm => swarm.swarmType === 'early');
    const inceptionSwarms = sortedSwarms.filter(swarm => swarm.swarmType === 'inception');

    return (
        <main className="container view">
            <div className="h-80 flex flex-col items-center justify-center gap-3">
                <h2 className="text-center">Invest in our <span className="font-bold">AI Swarms</span></h2>
                <div className="text-muted flex flex-row flex-wrap text-lg items-center justify-center">
                    <p className="text-center text-nowrap">Generate&ensp;</p>
                    <TokenTooltip token="$UBC"><span className="metallic-text-ubc">$UBC</span></TokenTooltip>
                    <p className="text-center text-nowrap">&ensp;returns by investing your&ensp;</p>
                    <TokenTooltip token="$COMPUTE"><span className="metallic-text">$COMPUTE</span></TokenTooltip>
                    <p className="text-center text-nowrap">&ensp;tokens into our ai swarms.</p>
                </div>
            </div>

            {/* Launching Swarms */}
            {sortedSwarms.filter(swarm => swarm.launchDate).length > 0 && (
                <section className="mb-24">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="relative">
                            <h3 className="text-2xl font-semibold flex items-center gap-2">
                                <span className="relative">
                                    🔥
                                    <span className="absolute inset-0 animate-ping bg-orange-500/20 rounded-full blur-sm" />
                                </span>
                                Launching Now
                            </h3>
                            <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 via-yellow-500/10 to-orange-500/20 blur-xl opacity-50" />
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="w-5 h-5 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-[300px]">
                                        These swarms are actively launching! Get in early to maximize your potential returns.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    
                    <div className="relative">
                        {/* Enhanced background effect */}
                        <div className="absolute inset-0 -mx-8 -my-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-yellow-500/10 to-orange-500/20 blur-[120px] animate-pulse" />
                            {/* Animated particles */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute h-2 w-2 rounded-full bg-yellow-500/50 top-1/4 left-1/4 animate-ping [animation-duration:3s]" />
                                <div className="absolute h-2 w-2 rounded-full bg-orange-500/50 top-3/4 right-1/4 animate-ping [animation-duration:4s]" />
                                <div className="absolute h-2 w-2 rounded-full bg-yellow-500/50 bottom-1/4 left-3/4 animate-ping [animation-duration:5s]" />
                            </div>
                        </div>

                        {/* Content grid with enhanced container */}
                        <div className="relative rounded-xl bg-black/30 backdrop-blur-md border border-white/5 group">
                            {/* Animated border gradient */}
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-orange-500/50 via-yellow-500/50 to-orange-500/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur" />
                            
                            {/* Grid container */}
                            <div className="relative rounded-xl bg-black/30 backdrop-blur-md">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                                    {sortedSwarms
                                        .filter(swarm => swarm.launchDate)
                                        .map((swarm) => (
                                            <div key={swarm.id} className="group/card">
                                                <div className="relative">
                                                    {/* Glow effect on hover */}
                                                    <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500/0 via-orange-500/0 to-red-500/0 rounded-xl opacity-0 group-hover/card:opacity-100 group-hover/card:via-orange-500/20 blur-xl transition-all duration-700" />
                                                    
                                                    <SwarmPreviewCard 
                                                        swarm={{
                                                            ...swarm,
                                                            revenueShare: swarm.revenueShare || 60,
                                                        }}
                                                    />
                                                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 border border-yellow-500/30 backdrop-blur-sm group-hover/card:border-yellow-500/50 transition-colors">
                                                        <span className="text-xs font-medium bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                                                            Launching
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Partner Swarms */}
            {partnerSwarms.length > 0 && (
                <section className="mb-24">
                    <div className="flex items-center gap-2 mb-8">
                        <h3 className="text-2xl font-semibold">🤝 Partner Swarms</h3>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="w-5 h-5 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-[300px]">
                                        Established Projects - Active revenue streams and user bases integrated with UBC for investor revenue sharing.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {partnerSwarms.map((swarm) => (
                            <SwarmPreviewCard 
                                key={swarm.id}
                                swarm={{
                                    ...swarm,
                                    revenueShare: swarm.revenueShare || 60,
                                }}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Early Access Swarms */}
            {earlySwarms.length > 0 && (
                <section className="mb-24">
                    <div className="flex items-center gap-2 mb-8">
                        <h3 className="text-2xl font-semibold">🚀 Early Swarms</h3>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="w-5 h-5 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-[300px]">
                                        Teams & POC - Projects with working prototypes and proven leadership ready for early investment.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {earlySwarms.map((swarm) => (
                            <SwarmPreviewCard 
                                key={swarm.id}
                                swarm={{
                                    ...swarm,
                                    revenueShare: swarm.revenueShare || 60,
                                }}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Inception Swarms */}
            {inceptionSwarms.length > 0 && (
                <section className="mb-24">
                    <div className="flex items-center gap-2 mb-8">
                        <h3 className="text-2xl font-semibold">🌱 Inception Swarms</h3>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="w-5 h-5 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-[300px]">
                                        Ideas & Leaders - New AI project concepts seeking leadership and development teams.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {inceptionSwarms.map((swarm) => (
                            <SwarmPreviewCard 
                                key={swarm.id}
                                swarm={{
                                    ...swarm,
                                    revenueShare: swarm.revenueShare || 60,
                                }}
                            />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
