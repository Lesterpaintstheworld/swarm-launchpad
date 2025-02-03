'use client';

import { CountdownTimer } from './CountdownTimer';
import { SwarmNews } from '@/components/swarms/news';
import { useEffect, useState } from 'react';
import { SwarmGalleryItem } from '@/components/swarms/swarm.types';
import { SwarmInvestCard } from "@/components/swarms/invest";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { InfoPanel } from "@/components/ui/infoPanel";
import { Markdown } from "@/components/ui/markdown";
import { SwarmGallery } from "@/components/swarms/gallery";
import { SwarmRecentMarketListings } from "@/components/market/recentListings";
import { ManagePortfolioCard } from "@/components/cards/managePortfolio";
import { ServiceGrid } from "@/components/marketplace/services/grid";
import { getServicesBySwarm } from "@/data/services_bak/services";
import { CollaborationGrid } from "@/components/marketplace/collaborations/grid";
import { getCollaborationsBySwarm } from "@/data/collaborations/collaborations";


interface SwarmContentProps {
    swarm: {
        id: string;
        name: string;
        description?: string;
        pool?: string;
        gallery?: Array<{
            type: string;
            content: string;
        }>;
        achievements?: Array<{
            id: string;
            name: string;
            description: string;
            completed: boolean;
        }>;
        socials?: {
            website?: string;
            twitter?: string;
            telegram?: string;
            telegramChannel?: string;
            discord?: string;
            dexscreener?: string;
        };
        weeklyRevenue?: number;
        launchDate?: Date;
        twitterAccount?: string;
    };
    initialPrice: number | null;
}

export function SwarmContent({ swarm, initialPrice }: SwarmContentProps) {
    const [price, setPrice] = useState<number | null>(initialPrice);

    useEffect(() => {
        const interval = setInterval(() => {
            fetch('https://api.dexscreener.com/latest/dex/pairs/solana/HiYsmVjeFy4ZLx8pkPSxBjswFkoEjecVGB4zJed2e6Y')
                .then(response => response.json())
                .then(data => {
                    if (data.pair?.priceUsd) {
                        setPrice(parseFloat(data.pair.priceUsd));
                    }
                })
                .catch(error => console.error('Failed to fetch price:', error));
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <main className="container mb-6 md:mb-24 view">
            <div className="mt-4">
                <Breadcrumb
                    crumbs={[
                        { label: "Swarms", href: "/invest" },
                        { label: swarm.name }
                    ]}
                />
                <div className="mt-8 mb-12 flex justify-between items-start">
                    <h1 className="font-bold text-4xl">{swarm.name}</h1>
                    {swarm?.pool && (
                        <div className="flex gap-12 text-right">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">MARKET CAP</p>
                                <p className="text-3xl font-semibold">
                                    <SwarmInvestCard pool={swarm.pool} marketCapOnly /> <span className="text-xl metallic-text">$COMPUTE</span>
                                </p>
                                {price && (
                                    <p className="text-sm italic text-muted-foreground/40 mt-1">
                                        $<SwarmInvestCard 
                                            pool={swarm.pool} 
                                            marketCapOnly 
                                            priceInUsd={price}
                                        />
                                    </p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">AMOUNT RAISED</p>
                                <p className="text-3xl font-semibold">
                                    <SwarmInvestCard pool={swarm.pool} amountRaisedOnly /> <span className="text-xl metallic-text">$COMPUTE</span>
                                </p>
                                {price && (
                                    <p className="text-sm italic text-muted-foreground/40 mt-1">
                                        $<SwarmInvestCard 
                                            pool={swarm.pool} 
                                            amountRaisedOnly 
                                            priceInUsd={price}
                                        />
                                    </p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">WEEKLY REVENUE</p>
                                <p className="text-3xl font-semibold">
                                    {swarm.weeklyRevenue ? (
                                        <>
                                            {swarm.weeklyRevenue.toLocaleString()} <span className="text-xl metallic-text">$COMPUTE</span>
                                        </>
                                    ) : (
                                        "-"
                                    )}
                                </p>
                                {price && swarm.weeklyRevenue && (
                                    <p className="text-sm italic text-muted-foreground/40 mt-1">
                                        ${(swarm.weeklyRevenue * price).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <SwarmGallery
                className="mt-16"
                gallery={swarm.gallery as SwarmGalleryItem[]}
                swarmName={swarm.name}
            />
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-8">
                    <SwarmNews 
                        id={swarm.id}
                    />
                    
                    {swarm?.description && (
                        <div className="flex flex-col gap-8">
                            <div className="flex-1">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-8">
                                        <h4 className="font-semibold">About {swarm.name}</h4>
                                    </div>
                                    <hr className="mt-3" />
                                    <Markdown markdown={swarm.description} />
                                </div>
                            </div>
                            <InfoPanel 
                                socials={{
                                    ...swarm.socials,
                                    twitter: swarm.twitterAccount || swarm.socials?.twitter
                                }}
                                achievements={swarm.achievements}
                                weeklyRevenuePerShare={swarm.weeklyRevenue ? {
                                    compute: Math.floor((swarm.weeklyRevenue / 100) * 0.8), // Per 1000 shares
                                    ubc: Math.floor((swarm.weeklyRevenue / 100) * 0.2)  // Per 1000 shares
                                } : undefined}
                            />

                            {getServicesBySwarm(swarm.id).length > 0 && (
                                <div className="flex flex-col gap-4 mt-8">
                                    <div className="flex items-center gap-8">
                                        <h4 className="font-semibold">Services Offered</h4>
                                    </div>
                                    <hr className="mt-3" />
                                    <ServiceGrid 
                                        services={getServicesBySwarm(swarm.id)}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-5">
                    {swarm?.pool && (
                        <div className="sticky top-6 w-full space-y-6">
                            {swarm.launchDate && new Date(swarm.launchDate) > new Date() ? (
                                <>
                                    <CountdownTimer launchDate={new Date(swarm.launchDate)} />
                                    <SwarmInvestCard pool={swarm.pool as string} />
                                </>
                            ) : (
                                <SwarmInvestCard
                                    pool={swarm.pool as string}
                                    weeklyRevenuePerShare={swarm.weeklyRevenue ? {
                                        compute: Math.floor((swarm.weeklyRevenue / 100) * 0.9), // Per 1000 shares
                                        ubc: Math.floor((swarm.weeklyRevenue / 100) * 0.1)  // Per 1000 shares
                                    } : undefined}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Active Collaborations - Full Width */}
            {getCollaborationsBySwarm(swarm.id).length > 0 && (
                <div className="mt-16">
                    <div className="flex items-center gap-8 mb-4">
                        <h4 className="font-semibold">Active Collaborations</h4>
                    </div>
                    <hr className="mb-6" />
                    <div className="bg-black/20 rounded-xl p-6 border border-white/10">
                        <CollaborationGrid 
                            collaborations={getCollaborationsBySwarm(swarm.id)}
                        />
                    </div>
                </div>
            )}

            {/* Market Listings */}
            <SwarmRecentMarketListings
                swarmId={swarm.id}
                numberOfListings={7}
                className="mt-16"
            />
            <ManagePortfolioCard className="mt-8" />
        </main>
    );
}
