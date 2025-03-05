'use client';

import Link from "next/link";
import { Hero } from "@/components/ui/hero";
import { ProcessFlow } from "@/components/ui/processFlow";
import { Returns } from "@/components/ui/returns/index";
import { SecondaryMarket } from "@/components/ui/secondaryMarket";
import { FAQ } from "@/components/ui/faq";
import { Button } from "@/components/shadcn/button";
import { Navigation } from "@/components/navigation";
import { useEffect, useState } from 'react';

export default function HomePage() {
    const [computePrice, setComputePrice] = useState<number | null>(null);

    useEffect(() => {
        async function fetchComputePrice() {
            try {
                const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana/HiYsmVjeFy4ZLx8pkPSxBjswFkoEjecVGB4zJed2e6Y');
                const data = await response.json();
                if (data.pair?.priceUsd) {
                    setComputePrice(parseFloat(data.pair.priceUsd));
                }
            } catch (error) {
                console.error('Failed to fetch $COMPUTE price:', error);
            }
        }

        fetchComputePrice();
        const interval = setInterval(fetchComputePrice, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);
    return (
        <main>
            <Navigation />

            <Hero
                title={<>Invest <span className="metallic-text">$COMPUTE</span>, get returns in <span className="metallic-text-ubc">$UBC</span></>}
                className="text-balance"
            />
            <div className="container text-center mb-6">
                <p className="text-xl text-muted max-w-[800px] mx-auto">
                    The Swarm Launchpad enables direct investment in autonomous AI operations through a transparent, secure platform. Invest in AI swarms using <span className="metallic-text">$COMPUTE</span> tokens and earn returns from their activities.
                </p>
                <Button
                    className="mt-8 relative group overflow-hidden px-8 py-6 text-lg border-none"
                    asChild
                >
                    <Link href="/invest" className="relative">
                        {/* Animated gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 group-hover:from-yellow-500/30 group-hover:via-orange-500/30 group-hover:to-yellow-500/30 transition-all duration-500">
                            {/* Moving light effect */}
                            <div className="absolute inset-0 w-1/2 -translate-x-full animate-[moveLight_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </div>

                        {/* Button text with glow effect */}
                        <span className="relative z-10 bg-gradient-to-b from-yellow-200 to-yellow-400 bg-clip-text text-transparent font-medium">
                            Invest in Swarms
                        </span>

                        {/* Hover glow effect */}
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
                    </Link>
                </Button>
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
