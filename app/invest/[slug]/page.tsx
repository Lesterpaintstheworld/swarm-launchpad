'use client';

import { getSwarmInfo } from "@/data/swarms/info";
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SwarmNews } from '@/components/swarms/news';
import { ServiceGrid } from "@/components/marketplace/services/grid";
import { getServicesBySwarm } from "@/data/services/services";

function CountdownTimer({ launchDate }: { launchDate: string | Date }) {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(launchDate).getTime() - Date.now();
            
            if (difference <= 0) {
                setTimeLeft(null);
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [launchDate]);

    if (!timeLeft) return null;

    return (
        <div className="p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-6 text-center">Launch Countdown</h3>
            <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                    <div className="text-2xl font-bold">{timeLeft.days}</div>
                    <div className="text-sm text-muted-foreground">Days</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold">{timeLeft.hours}</div>
                    <div className="text-sm text-muted-foreground">Hours</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                    <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                    <div className="text-sm text-muted-foreground">Seconds</div>
                </div>
            </div>
        </div>
    );
}
import { SwarmInvestCard } from "@/components/swarms/invest";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { InfoPanel } from "@/components/ui/infoPanel";
import { Markdown } from "@/components/ui/markdown";
import { SwarmGallery } from "@/components/swarms/gallery";
import { SwarmRecentMarketListings } from "@/components/market/recentListings";
import { ManagePortfolioCard } from "@/components/cards/managePortfolio";
import { getSwarm } from "@/data/swarms/previews";
import { CollaborationGrid } from "@/components/marketplace/collaborations/grid";
import { getCollaborationsBySwarm } from "@/data/collaborations/collaborations";
import { description as KinOSDescription } from "@/data/swarms/descriptions/kinos";
import { description as KinKongDescription } from "@/data/swarms/descriptions/kinkong";
import { description as SwarmVenturesDescription } from "@/data/swarms/descriptions/swarmventures";
import { description as TerminalVelocityDescription } from "@/data/swarms/descriptions/terminalvelocity";
import { description as SyntheticSoulsDescription } from "@/data/swarms/descriptions/syntheticsouls";
import { description as DuoAIDescription } from "@/data/swarms/descriptions/duoai";
import { description as PropertyKinDescription } from "@/data/swarms/descriptions/propertykin";
import { description as RobinhoodDescription } from "@/data/swarms/descriptions/robinhood";
import { description as ScreenplayDescription } from "@/data/swarms/descriptions/screenplay";
import { description as AffiliateDescription } from "@/data/swarms/descriptions/affiliate";
import { description as CareHiveDescription } from "@/data/swarms/descriptions/carehive";
import { description as CommerceNestDescription } from "@/data/swarms/descriptions/commercenest";
import { description as EducativeDescription } from "@/data/swarms/descriptions/educative";
import { description as GameBuddyDescription } from "@/data/swarms/descriptions/gamebuddy";
import { description as GrantDescription } from "@/data/swarms/descriptions/grant";
import { description as MentalHealthDescription } from "@/data/swarms/descriptions/mental-health";
import { description as MentorDescription } from "@/data/swarms/descriptions/mentor";
import { description as PublishingDescription } from "@/data/swarms/descriptions/publishing";
import { description as SpeakerDescription } from "@/data/swarms/descriptions/speaker";
import { description as TalentDescription } from "@/data/swarms/descriptions/talent";
import { description as TravelDescription } from "@/data/swarms/descriptions/travel";
import { description as XForgeDescription } from "@/data/swarms/descriptions/xforge";
import { description as DigitalKinDescription } from "@/data/swarms/descriptions/digitalkin";
import { description as SlopFatherDescription } from "@/data/swarms/descriptions/slopfather";
import { description as WealthHiveDescription } from "@/data/swarms/descriptions/wealthhive";
import { description as AlteredAlleyDescription } from "@/data/swarms/descriptions/alteredalley";
import { description as LogicAtlasDescription } from "@/data/swarms/descriptions/logicatlas";

const descriptionMap: { [key: string]: string } = {
    'kinos-partner-id': KinOSDescription,
    // Partner Swarms
    'slopfather-partner-id': SlopFatherDescription,
    'digitalkin-partner-id': DigitalKinDescription,
    'forge-partner-id': XForgeDescription,
    
    // Early Swarms
    'eb76ae17-b9eb-476d-b272-4bde2d85c808': KinKongDescription,
    'e8ffff3d-64d3-44d3-a8cf-f082c5c42234': SwarmVenturesDescription,
    '988b16b4-6beb-4cc5-9a14-50f48ee47a22': TerminalVelocityDescription,
    '03616e66-a21e-425b-a93b-16d6396e883f': SyntheticSoulsDescription,
    '7d3c9e5b-1f8a-4d3c-b8d4-9e5b1f8a4d3c': DuoAIDescription,
    
    // Inception Swarms
    'propertykin-inception-id': PropertyKinDescription,
    'b2c3d4e5-f6g7-5b6c-9d0e-1f2g3h4i5j6k': MentalHealthDescription,
    'c3d4e5f6-g7h8-6c7d-ae1f-2g3h4i5j6k7l': PublishingDescription,
    'd4e5f6g7-h8i9-7d8e-bf2g-3h4i5j6k7l8m': EducativeDescription,
    'e5f6g7h8-i9j0-8e9f-cg3h-4i5j6k7l8m9n': TalentDescription,
    'f6g7h8i9-j0k1-9f0g-dh4i-5j6k7l8m9n0o': CareHiveDescription,
    'g7h8i9j0-k1l2-0g1h-ei5j-6k7l8m9n0o1p': CommerceNestDescription,
    'h8i9j0k1-l2m3-1h2i-fj6k-7l8m9n0o1p2q': AffiliateDescription,
    'mentor-swarm-id': MentorDescription,
    'speaker-swarm-id': SpeakerDescription,
    'travel-swarm-id': TravelDescription,
    'grant-swarm-id': GrantDescription,
    'resume-swarm-id': GameBuddyDescription,
    'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d': RobinhoodDescription,
    'f7a92b3c-d8e4-4c1a-9f5d-1234567890ab': ScreenplayDescription,
    'wealthhive-inception-id': WealthHiveDescription,
    'altered-alley-inception-id': AlteredAlleyDescription,
    'logicatlas-inception-id': LogicAtlasDescription
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
                <div className="mt-8 mb-12 flex justify-between items-start">
                    <h1 className="font-bold text-4xl">{swarm.name}</h1>
                    {swarm?.pool && (
                        <div className="flex gap-12 text-right">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">MARKET CAP</p>
                                <p className="text-3xl font-semibold">
                                    <SwarmInvestCard pool={swarm.pool} marketCapOnly /> <span className="text-xl metallic-text">$COMPUTE</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">AMOUNT RAISED</p>
                                <p className="text-3xl font-semibold">
                                    <SwarmInvestCard pool={swarm.pool} amountRaisedOnly /> <span className="text-xl metallic-text">$COMPUTE</span>
                                </p>
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
                <div className="lg:col-span-7">
                    {swarm?.description &&
                        <div className="flex flex-col gap-8">
                            <div className="flex-1">
                                <div className="flex flex-col gap-4">
                                    {/* Title */}
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

                            {/* Services Section - only show if swarm has services */}
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
                    }
                </div>
                
                <div className="lg:col-span-5 w-full">
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

