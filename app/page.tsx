'use client';

import { Hero } from "@/components/ui/hero";
import { ProcessFlow } from "@/components/ui/processFlow";
import { Returns } from "@/components/ui/returns/index";
import { SecondaryMarket } from "@/components/ui/secondaryMarket";
import { FAQ } from "@/components/ui/faq";
import { Button } from "@/components/shadcn/button";
import { BackgroundBlur } from "@/components/background";

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
