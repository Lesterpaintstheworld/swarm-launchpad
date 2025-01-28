import { SwarmData } from "@/data/swarms/info";
import { redirect } from 'next/navigation';
import { SwarmInvestCard } from "@/components/swarms/invest";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { InfoPanel } from "@/components/ui/infoPanel";
import { Markdown } from "@/components/ui/markdown";
import { Expandable } from "@/components/ui/expandable";
import { SwarmGallery } from "@/components/swarms/gallery";
import { SwarmRecentMarketListings } from "@/components/market/recentListings";
import { ManagePortfolioCard } from "@/components/cards/managePortfolio";
import { IntlNumberFormat, IntlNumberFormatCompact } from "@/lib/utils";

export default function SwarmPage({ params }: { params: { slug: string } }) {
    const swarm = SwarmData.find((s) => s.id === params.slug);
    if (!swarm) {
        redirect('/404');
    }

    return (
        <main className="container mb-6 md:mb-24 view">
            <div className="mt-4">
                <Breadcrumb
                    crumbs={[
                        { label: "Swarms", href: "/invest" },
                        { label: swarm.name }
                    ]}
                />
                <div className="mt-2 flex justify-between items-center">
                    <h1 className="font-bold">{swarm.name}</h1>
                </div>
            </div>
            <SwarmGallery
                className="mt-16"
                gallery={swarm.gallery}
                swarmName={swarm.name}
            />
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7">
                    {swarm?.description &&
                        <div className="flex flex-col gap-8">
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="font-semibold">About {swarm.name}</h4>
                                    {swarm?.pool && (
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">MARKET CAP</p>
                                            <p className="text-lg font-semibold text-green-400">
                                                ${<SwarmInvestCard pool={swarm.pool} marketCapOnly />} $COMPUTE
                                            </p>
                                        </div>
                                    )}
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

