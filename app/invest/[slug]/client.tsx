'use client'

import { useState, useEffect } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { InfoPanel } from "@/components/ui/infoPanel";
import { SwarmInfo } from "@/components/swarms/swarm.types";
import { Markdown } from "@/components/ui/markdown";
import { Expandable } from "@/components/ui/expandable";
import { Achievements } from "@/components/swarms/achievements";
import { SwarmInvestCard } from "@/components/swarms/invest";
import { ManagePortfolioCard } from "@/components/cards/managePortfolio";
import { SwarmRecentMarketListings } from "@/components/market/recentListings";
import { SwarmGallery } from "@/components/swarms/gallery";
import { useLaunchpadProgramAccount } from "@/hooks/useLaunchpadProgram";
import { IntlNumberFormat, calculateSharePrice } from "@/lib/utils";

interface SwarmPageClientProps {
    swarm: SwarmInfo;
}

export function SwarmPageClient({ swarm }: SwarmPageClientProps) {
    const [data, setData] = useState({
        totalSupply: 0,
        remainingSupply: 0,
        pricePerShare: 0,
        frozen: true,
    });

    const { poolAccount } = useLaunchpadProgramAccount({ poolAddress: swarm.pool as string });

    useEffect(() => {
        if (poolAccount.data) {
            setData({
                totalSupply: poolAccount.data.totalShares.toNumber(),
                remainingSupply: poolAccount.data.availableShares.toNumber(),
                pricePerShare: calculateSharePrice(poolAccount.data.totalShares.toNumber() - poolAccount.data.availableShares.toNumber()),
                frozen: poolAccount.data.isFrozen || false,
            });
        }
    }, [poolAccount.data]);

    return (
        <main className="container mb-6 md:mb-24 view">
            <div className="mt-4">
                <Breadcrumb
                    crumbs={[
                        { label: "Swarms", href: "/invest" },
                        { label: swarm.name }
                    ]}
                />
                <div className="mt-2">
                    <h1 className="font-bold">{swarm.name}</h1>
                </div>
            </div>
            <SwarmGallery
                className="mt-16"
                gallery={swarm.gallery}
                swarmName={swarm.name}
            />
            {swarm.achievements && swarm.achievements.length > 0 && (
                <Achievements 
                    achievements={swarm.achievements}
                    className="mt-8 mb-4" 
                />
            )}
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7">
                    {swarm?.description &&
                        <div className="flex flex-col gap-8">
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="font-semibold">About {swarm.name}</h4>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400">TOTAL MARKET CAP</p>
                                        <p className="text-2xl font-bold text-green-400">
                                            ${IntlNumberFormat((data.totalSupply - data.remainingSupply) * data.pricePerShare)} 
                                            <span className="text-sm">$COMPUTE</span>
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {IntlNumberFormat(data.totalSupply - data.remainingSupply)} shares × ${IntlNumberFormat(data.pricePerShare)}
                                        </p>
                                    </div>
                                </div>
                                <hr className="mt-3" />
                                <Expandable overflowThreshold={750}>
                                    <Markdown markdown={swarm.description} />
                                </Expandable>
                            </div>
                            <InfoPanel 
                                socials={swarm.socials}
                                achievements={swarm.achievements}
                            />
                        </div>
                    }
                </div>
                
                <div className="lg:col-span-5">
                    {swarm?.pool &&
                        <div className="sticky top-6">
                            <SwarmInvestCard
                                pool={swarm.pool as string}
                            />
                        </div>
                    }
                </div>
            </div>

            <SwarmRecentMarketListings
                swarmId={swarm.id}
                numberOfListings={7}
                className="mt-16"
            />
            <ManagePortfolioCard className="mt-8" />
        </main>
    );
}
