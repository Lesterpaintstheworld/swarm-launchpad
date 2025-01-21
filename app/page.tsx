'use client';

import { Hero } from "@/components/ui/hero";
import { ProcessFlow } from "@/components/ui/processFlow";
import { Returns } from "@/components/ui/returns/index";
import { SecondaryMarket } from "@/components/ui/secondaryMarket";
import { FAQ } from "@/components/ui/faq";
import { Button } from "@/components/shadcn/button";
import { BackgroundBlur } from "@/components/background";
import { stakeMenuItems, buyMenuItems } from "@/data/navigation/menu";

export default function HomePage() {
    return (
        <main>
            <BackgroundBlur />
            <Hero 
                title={<>Invest <span className="metallic-text">$COMPUTE</span>, get returns in <span className="metallic-text-ubc">$UBC</span></>}
                className="text-balance"
            />
            <div className="container text-center mt-6">
                <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
                    The Swarm Launchpad enables direct investment in autonomous AI operations through a transparent, secure platform. Invest in AI swarms using <span className="metallic-text">$COMPUTE</span> tokens and earn returns from their activities.
                </p>
            </div>

            {/* Menu Grid */}
            <div className="container mt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Buy Menu */}
                    <div className="flex flex-col gap-4 p-8 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        <h3 className="text-2xl font-normal mb-4">Buy</h3>
                        <div className="flex flex-col gap-3">
                            {buyMenuItems.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.url}
                                    target={item.target}
                                    className="flex items-center p-4 rounded-lg bg-black/30 hover:bg-black/40 transition-colors"
                                >
                                    <span className="text-lg">{item.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Stake Menu */}
                    <div className="flex flex-col gap-4 p-8 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        <h3 className="text-2xl font-normal mb-4">Stake</h3>
                        <div className="flex flex-col gap-3">
                            {stakeMenuItems.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.url}
                                    target={item.target}
                                    className="flex items-center p-4 rounded-lg bg-black/30 hover:bg-black/40 transition-colors"
                                >
                                    <span className="text-lg">{item.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
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
