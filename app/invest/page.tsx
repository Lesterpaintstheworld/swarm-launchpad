'use client'

import { TokenTooltip } from "@/components/ui/tokenTooltip";
import { SwarmData, getSwarmInfo } from "@/data/swarms/info";
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
            pool: swarmInfo?.pool
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

            {/* Partner Swarms */}
            {partnerSwarms.length > 0 && (
                <section className="mb-24">
                    <div className="flex items-center gap-2 mb-8">
                        <h3 className="text-2xl font-semibold">🤝 PARTNER SWARMS</h3>
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
                        <h3 className="text-2xl font-semibold">🚀 EARLY SWARMS</h3>
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
                        <h3 className="text-2xl font-semibold">🌱 INCEPTION SWARMS</h3>
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
