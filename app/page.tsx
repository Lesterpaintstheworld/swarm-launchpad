'use client';

import { Countdown } from "@/components/ui/countdown";
import { Hero } from "@/components/ui/hero";
import { ProcessFlow } from "@/components/ui/processFlow";
import { Returns } from "@/components/ui/returns/index";
import { SecondaryMarket } from "@/components/ui/secondaryMarket";
import { FAQ } from "@/components/ui/faq";
import { Button } from "@/components/shadcn/button";
import { BackgroundBlur } from "@/components/background";
import { Navigation } from "@/components/navigation";

export default function HomePage() {
    return (
        <main>
            <BackgroundBlur />
            <Navigation />
            
            {/* Launch Timer */}
            <div className="w-full max-w-[1200px] mx-auto mt-8 mb-12 px-4">
                <div className="flex flex-col items-center justify-center gap-4">
                    <h2 className="text-center">Launchpad Opens In</h2>
                    <Countdown 
                        targetDate={new Date('2024-01-22T18:00:00.000Z')} // 1pm EST = 18:00 UTC
                        className="scale-150 mb-8"
                    />
                </div>
            </div>

            {/* Live Stream Container */}
            <div className="w-full max-w-[1200px] mx-auto mt-8 mb-12 px-4">
                <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden bg-black/20">
                    <iframe
                        src="https://player.twitch.tv/?channel=romeinf&parent=localhost&parent=ubc.markets"
                        className="absolute top-0 left-0 w-full h-full border-0"
                        allowFullScreen
                        loading="lazy"
                        title="UBC Live Stream"
                    />
                </div>
            </div>

            {/* Timeline flow */}
            <div className="w-full max-w-[1000px] mx-auto flex flex-col gap-6 px-4 mb-24">
                {/* Explainer text */}
                <p className="text-center text-lg text-muted-foreground max-w-[800px] mx-auto mb-4">
                    We prioritize informed decisions. Take the first 2 hours to research the swarms thoroughly before the team livestream begins. This way, you'll be well-prepared to make educated investment choices.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Hour 1-2 */}
                    <div className="flex flex-col gap-2 p-6 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm relative md:col-span-2">
                        <h3 className="text-xl font-medium">Hours 1-2</h3>
                        <p className="text-yellow-500 font-medium">DYOR</p>
                        <p className="text-sm text-muted-foreground">Take time to research swarms and prepare your investment strategy</p>
                        {/* Arrow for desktop */}
                        <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                            <span className="text-2xl text-yellow-500">→</span>
                        </div>
                    </div>

                    {/* Hour 3 */}
                    <div className="flex flex-col gap-2 p-6 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm relative">
                        <h3 className="text-xl font-medium">Hour 3</h3>
                        <p className="text-yellow-500 font-medium">Livestream with the team</p>
                        <p className="text-sm text-muted-foreground">Join the community livestream for final insights</p>
                        {/* Arrow for desktop */}
                        <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                            <span className="text-2xl text-yellow-500">→</span>
                        </div>
                    </div>

                    {/* Hour 4 */}
                    <div className="flex flex-col gap-2 p-6 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm relative">
                        <h3 className="text-xl font-medium">Hour 4</h3>
                        <p className="text-yellow-500 font-medium">Shares Open</p>
                        <p className="text-sm text-muted-foreground">Purchase shares at the best prices, informed</p>
                        {/* Arrow for desktop */}
                        <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                            <span className="text-2xl text-yellow-500">→</span>
                        </div>
                    </div>

                    {/* Hour 5 */}
                    <div className="flex flex-col gap-2 p-6 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        <h3 className="text-xl font-medium">Hour 5</h3>
                        <p className="text-yellow-500 font-medium">Trading Begins</p>
                        <p className="text-sm text-muted-foreground">Secondary market opens</p>
                    </div>
                </div>
            </div>

            <Hero 
                title={<>Invest <span className="metallic-text">$COMPUTE</span>, get returns in <span className="metallic-text-ubc">$UBC</span></>}
                className="text-balance"
            />
            <div className="container text-center mt-6">
                <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
                    The Swarm Launchpad enables direct investment in autonomous AI operations through a transparent, secure platform. Invest in AI swarms using <span className="metallic-text">$COMPUTE</span> tokens and earn returns from their activities.
                </p>
            </div>

            <ProcessFlow />
            <Returns />
            <SecondaryMarket />
            <FAQ />
            <div className="container flex justify-center mb-24">
                <Button
                    className="px-8 py-6 text-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border-none"
                    onClick={() => window.open('https://github.com/Lesterpaintstheworld/UBC-whitepaper/blob/main/launchpad-addendum.md', '_blank')}
                >
                    Read the Launchpad Whitepaper
                </Button>
            </div>
        </main>
    );
}
