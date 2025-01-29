import { getSwarmInfo } from "@/data/swarms/info";
import { redirect } from 'next/navigation';
import { SwarmInvestCard } from "@/components/swarms/invest";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { InfoPanel } from "@/components/ui/infoPanel";
import { Markdown } from "@/components/ui/markdown";
import { Expandable } from "@/components/ui/expandable";
import { SwarmGallery } from "@/components/swarms/gallery";
import { SwarmRecentMarketListings } from "@/components/market/recentListings";
import { ManagePortfolioCard } from "@/components/cards/managePortfolio";
import { getSwarm } from "@/data/swarms/previews";
import { KinKongDescription } from "@/data/swarms/descriptions/kinkong";
import { SwarmVenturesDescription } from "@/data/swarms/descriptions/swarmventures";
import { TerminalVelocityDescription } from "@/data/swarms/descriptions/terminalvelocity";
import { SyntheticSoulsDescription } from "@/data/swarms/descriptions/syntheticsouls";
import { DuoAIDescription } from "@/data/swarms/descriptions/duoai";
import { PropertyKinDescription } from "@/data/swarms/descriptions/propertykin";
import { RobinhoodDescription } from "@/data/swarms/descriptions/robinhood";
import { ScreenplayDescription } from "@/data/swarms/descriptions/screenplay";

const descriptionMap: { [key: string]: string } = {
    'eb76ae17-b9eb-476d-b272-4bde2d85c808': KinKongDescription,
    'e8ffff3d-64d3-44d3-a8cf-f082c5c42234': SwarmVenturesDescription,
    '988b16b4-6beb-4cc5-9a14-50f48ee47a22': TerminalVelocityDescription,
    '03616e66-a21e-425b-a93b-16d6396e883f': SyntheticSoulsDescription,
    '7d3c9e5b-1f8a-4d3c-b8d4-9e5b1f8a4d3c': DuoAIDescription,
    'propertykin-inception-id': PropertyKinDescription,
    'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d': RobinhoodDescription,
    'f7a92b3c-d8e4-4c1a-9f5d-1234567890ab': ScreenplayDescription,
};

export default function SwarmPage({ params }: { params: { slug: string } }) {
    // Get data from both sources
    const swarmInfo = getSwarmInfo(params.slug);
    const swarmPreview = getSwarm(params.slug);

    // Combine the data, preferring preview data for most fields
    const swarm = swarmInfo ? {
        ...swarmPreview,
        ...swarmInfo,
        // Keep preview data for these fields
        role: swarmPreview?.role,
        tags: swarmPreview?.tags,
        // Use the full description from the descriptions folder if available
        description: descriptionMap[swarmInfo.id] || swarmInfo.description
    } : null;
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

