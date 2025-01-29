'use client';

import { getSwarmInfo } from "@/data/swarms/info";
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

function CountdownTimer({ launchDate }: { launchDate: Date }) {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = launchDate.getTime() - new Date().getTime();
            
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

        // Calculate immediately
        calculateTimeLeft();
        
        // Then update every second
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
                                <p className="text-3xl font-semibold text-green-400">
                                    <SwarmInvestCard pool={swarm.pool} marketCapOnly /> <span className="text-xl">$COMPUTE</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">AMOUNT RAISED</p>
                                <p className="text-3xl font-semibold text-blue-400">
                                    <SwarmInvestCard pool={swarm.pool} amountRaisedOnly /> <span className="text-xl">$COMPUTE</span>
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
                            
                            {/* Team Section */}
                            {swarm.team && swarm.team.length > 0 && (
                                <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10">
                                    <h4 className="text-lg font-semibold mb-6">Team</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {swarm.team.map((member, index) => (
                                            <div key={index} className="flex flex-col items-center text-center">
                                                <div className="relative w-20 h-20 mb-4">
                                                    <Image
                                                        src={member.picture}
                                                        alt={member.name}
                                                        fill
                                                        className="object-cover rounded-full border-2 border-white/10"
                                                    />
                                                </div>
                                                <h5 className="font-medium text-white mb-2">{member.name}</h5>
                                                <div className="flex items-center gap-3">
                                                    {member.telegram && (
                                                        <a
                                                            href={`https://t.me/${member.telegram}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                                        >
                                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 3.845-1.362 5.452-.168.676-.336 1.363-.48 1.957-.169.687-.318 1.288-.467 1.81-.151.527-.302.983-.468 1.362-.151.345-.259.527-.366.628-.108.101-.194.151-.259.151-.13 0-.26-.075-.39-.226-.13-.151-.26-.377-.39-.678-.13-.301-.26-.653-.39-1.057-.13-.404-.26-.854-.39-1.349-.13-.495-.26-1.019-.39-1.57-.13-.551-.26-1.127-.39-1.727-.13-.6-.26-1.214-.39-1.84-.13-.626-.26-1.253-.39-1.879-.13-.626-.26-1.24-.39-1.84-.13-.6-.26-1.165-.39-1.694-.13-.529-.26-1.006-.39-1.432-.13-.426-.26-.795-.39-1.108-.13-.313-.26-.551-.39-.714-.13-.163-.26-.244-.39-.244-.065 0-.13.025-.195.075-.065.05-.13.126-.195.226-.065.1-.13.226-.195.377-.065.151-.13.327-.195.527-.065.2-.13.426-.195.677-.065.251-.13.527-.195.828-.065.301-.13.628-.195.983-.065.355-.13.729-.195 1.121-.065.392-.13.804-.195 1.235-.065.431-.13.881-.195 1.349-.065.468-.13.954-.195 1.457-.065.503-.13 1.019-.195 1.547-.065.528-.13 1.069-.195 1.622-.065.553-.13 1.114-.195 1.684-.065.57-.13 1.146-.195 1.728-.065.582-.13 1.165-.195 1.748-.065.583-.13 1.159-.195 1.728-.065.569-.13 1.127-.195 1.674-.065.547-.13 1.082-.195 1.604-.065.522-.13 1.032-.195 1.529-.065.497-.13.982-.195 1.454-.065.472-.13.932-.195 1.38-.065.448-.13.884-.195 1.308-.065.424-.13.836-.195 1.235-.065.399-.13.786-.195 1.159-.065.373-.13.734-.195 1.083-.065.349-.13.686-.195 1.011-.065.325-.13.638-.195.939-.065.301-.13.59-.195.867-.065.277-.13.542-.195.795-.065.253-.13.494-.195.723-.065.229-.13.446-.195.651-.065.205-.13.398-.195.579-.065.181-.13.349-.195.505-.065.156-.13.301-.195.434-.065.133-.13.253-.195.361-.065.108-.13.205-.195.29-.065.085-.13.156-.195.214-.065.058-.13.104-.195.138-.065.034-.13.051-.195.051z"/>
                                                            </svg>
                                                        </a>
                                                    )}
                                                    {member.X && (
                                                        <a
                                                            href={`https://x.com/${member.X}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                                        >
                                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                                            </svg>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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
                                    <SwarmInvestCard
                                        pool={swarm.pool as string}
                                        className="opacity-40 pointer-events-none select-none"
                                    />
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

            <SwarmRecentMarketListings
                swarmId={swarm.id}
                numberOfListings={7}
                className="mt-16"
            />
            <ManagePortfolioCard className="mt-8" />
        </main>
    );
}

