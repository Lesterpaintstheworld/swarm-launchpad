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
                    className="mt-8 px-8 py-6 text-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border-none"
                    asChild
                >
                    <Link href="/invest">
                        Invest in Swarms
                    </Link>
                </Button>
            </div>

            {/* Metrics Section */}
            <div className="w-full max-w-6xl mx-auto mt-24 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Number of Swarms */}
                    <div className="relative group h-[160px]">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative p-8 rounded-xl bg-black/40 border border-white/10 backdrop-blur-sm hover:bg-black/50 transition-all duration-300 h-full">
                            <div className="text-center h-full flex flex-col justify-center">
                                <h3 className="text-sm text-muted-foreground/80 uppercase tracking-wider mb-4 font-medium">Active Swarms</h3>
                                <p className="text-6xl font-bold bg-gradient-to-br from-white via-white/90 to-white/80 bg-clip-text text-transparent">25</p>
                            </div>
                        </div>
                    </div>

                    {/* Total Market Cap */}
                    <div className="relative group h-[160px]">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative p-8 rounded-xl bg-black/40 border border-white/10 backdrop-blur-sm hover:bg-black/50 transition-all duration-300 h-full">
                            <div className="text-center h-full flex flex-col justify-center">
                                <h3 className="text-sm text-muted-foreground/80 uppercase tracking-wider mb-4 font-medium">Total Market Cap</h3>
                                <div className="space-y-1">
                                    <p className="text-4xl tracking-tight text-green-400/90 font-medium">
                                        ${computePrice ? (10000000000 * computePrice).toLocaleString() : '26,100,000'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Amount Raised */}
                    <div className="relative group h-[160px]">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative p-8 rounded-xl bg-black/40 border border-white/10 backdrop-blur-sm hover:bg-black/50 transition-all duration-300 h-full">
                            <div className="text-center h-full flex flex-col justify-center">
                                <h3 className="text-sm text-muted-foreground/80 uppercase tracking-wider mb-4 font-medium">Total Amount Raised</h3>
                                <div className="space-y-1">
                                    <p className="text-4xl tracking-tight">
                                        <span className="metallic-text font-light">47.6M $COMPUTE</span>
                                    </p>
                                    <p className="text-2xl text-green-400/90 font-medium tracking-tight">
                                        ${computePrice ? (47600000 * computePrice).toLocaleString() : '124,164'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Weekly Revenue - Full Width */}
                    <div className="md:col-span-3 relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative p-8 rounded-xl bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-green-500/5 border border-green-500/20 backdrop-blur-sm hover:from-green-500/10 hover:via-emerald-500/10 hover:to-green-500/10 transition-all duration-300">
                            <div className="text-center h-full flex flex-col justify-center">
                                <h3 className="text-sm text-muted-foreground/80 uppercase tracking-wider mb-4 font-medium">Total Weekly Revenue</h3>
                                <div className="space-y-1">
                                    <p className="text-4xl tracking-tight">
                                        <span className="metallic-text font-light">2.18M $COMPUTE</span>
                                    </p>
                                    <p className="text-2xl text-green-400/90 font-medium tracking-tight">
                                        ${computePrice ? (2180000 * computePrice).toLocaleString() : '5,685'}
                                    </p>
                                </div>
                            </div>
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
