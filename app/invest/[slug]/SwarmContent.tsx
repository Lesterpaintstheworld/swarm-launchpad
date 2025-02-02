'use client';

import { CountdownTimer } from './CountdownTimer';
import { useDexScreenerPrice } from '@/hooks/useDexScreenerPrice';
import { SwarmNews } from '@/components/swarms/news';
import { SwarmInvestCard } from "@/components/swarms/invest";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { InfoPanel } from "@/components/ui/infoPanel";
import { Markdown } from "@/components/ui/markdown";
import { SwarmGallery } from "@/components/swarms/gallery";
import { SwarmRecentMarketListings } from "@/components/market/recentListings";
import { ManagePortfolioCard } from "@/components/cards/managePortfolio";
import { ServiceGrid } from "@/components/marketplace/services/grid";
import { getServicesBySwarm } from "@/data/services/services";
import { CollaborationGrid } from "@/components/marketplace/collaborations/grid";
import { getCollaborationsBySwarm } from "@/data/collaborations/collaborations";


interface SwarmContentProps {
    swarm: any; // TODO: Add proper type definition
}

export function SwarmContent({ swarm }: SwarmContentProps) {
    const { price: computePrice } = useDexScreenerPrice();

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
                                {computePrice && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        ≈ ${(40000000 * computePrice).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">AMOUNT RAISED</p>
                                <p className="text-3xl font-semibold">
                                    <SwarmInvestCard pool={swarm.pool} amountRaisedOnly /> <span className="text-xl metallic-text">$COMPUTE</span>
                                </p>
                                {computePrice && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        ≈ ${(5800000 * computePrice).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
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
                                {computePrice && swarm.weeklyRevenue && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        ≈ ${(swarm.weeklyRevenue * computePrice).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <SwarmGallery
                className="mt-16"
                gallery={swarm.gallery}
                swarmName={swarm.name}
            />
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-8">
                    <SwarmNews 
                        swarmId={swarm.id}
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
                                socials={swarm.socials}
                                achievements={swarm.achievements}
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
