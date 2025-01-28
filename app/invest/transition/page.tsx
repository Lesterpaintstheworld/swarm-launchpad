'use client';

import { BackgroundBlur } from "@/components/background";
import { Button } from "@/components/shadcn/button";
import { Slider } from "@/components/shadcn/slider";
import Link from "next/link";
import { useState } from "react";

export default function TransitionPage() {
    const [swarmRevenue, setSwarmRevenue] = useState(100);
    const [redistributionRate, setRedistributionRate] = useState(20);
    const [sharesOwned, setSharesOwned] = useState(100);

    const calculateMonthlyIncome = () => {
        // Assuming total shares is 100,000 for this example
        const totalShares = 100000;
        const sharePercentage = (sharesOwned / totalShares) * 100;
        const monthlyIncome = (swarmRevenue * (redistributionRate / 100) * (sharePercentage / 100));
        return Math.round(monthlyIncome);
    };
    return (
        <main className="container view">
            <BackgroundBlur />
            
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center">
                <h1 className="font-normal tracking-tight max-w-[800px]">
                    Your Transition to AI-Powered Income
                </h1>
                <p className="text-xl text-muted-foreground max-w-[700px] text-balance">
                    From traditional employment to AI investment returns - your path to financial freedom in the AI economy
                </p>
            </section>

            {/* Main Content */}
            <section className="py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Today Section */}
                    <div className="p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5 backdrop-blur-sm">
                        <h2 className="text-2xl font-semibold mb-6">Today: The Worker</h2>
                        <ul className="space-y-4 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                Trading time for money
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                Limited earning potential
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                Income tied to hours worked
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                Job security concerns
                            </li>
                        </ul>
                    </div>

                    {/* Tomorrow Section */}
                    <div className="p-8 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-white/5 backdrop-blur-sm">
                        <h2 className="text-2xl font-semibold mb-6">Tomorrow: The Investor</h2>
                        <ul className="space-y-4 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                Passive income from AI swarms
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                Unlimited earning potential
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                24/7 automated returns
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                Financial independence
                            </li>
                        </ul>
                    </div>
                </div>

                {/* How It Works Section */}
                <div className="mt-24">
                    <h2 className="text-3xl font-semibold text-center mb-12">Your Path to AI Investment Income</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                            <div className="text-2xl font-bold text-blue-400 mb-4">1. Start Small</div>
                            <p className="text-muted-foreground">
                                Begin your journey by investing in established AI swarms while maintaining your current income. Learn the ecosystem and grow your portfolio gradually.
                            </p>
                        </div>

                        <div className="p-6 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                            <div className="text-2xl font-bold text-purple-400 mb-4">2. Build & Learn</div>
                            <p className="text-muted-foreground">
                                Reinvest your returns to accelerate growth. Understand different AI swarms and diversify your investments across multiple revenue streams.
                            </p>
                        </div>

                        <div className="p-6 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                            <div className="text-2xl font-bold text-green-400 mb-4">3. Scale Up</div>
                            <p className="text-muted-foreground">
                                As your AI investment income grows, gradually transition from traditional work to becoming a full-time AI investor with automated, passive income.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-24 text-center">
                    <h2 className="text-3xl font-semibold mb-6">Ready to Start Your Transition?</h2>
                    <div className="flex justify-center gap-4">
                        <Button 
                            size="lg"
                            className="bg-gradient-to-r from-blue-500 to-purple-500"
                            asChild
                        >
                            <Link href="/invest">
                                Explore AI Swarms
                            </Link>
                        </Button>
                        <Button 
                            size="lg"
                            variant="secondary"
                            asChild
                        >
                            <Link href="/get-compute">
                                Get $COMPUTE
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Passive Income Modeling */}
                <div className="mt-24">
                    <h2 className="text-3xl font-semibold text-center mb-6">Model Your Passive Income</h2>
                    
                    {/* Disclaimer Box */}
                    <div className="mb-12 p-6 rounded-xl bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm">
                        <h4 className="text-lg font-semibold text-blue-400 mb-3">Important Note About Your Financial Well-being</h4>
                        <p className="text-muted-foreground leading-relaxed">
                            While we're excited about the potential of AI swarms, we care about your financial health first. 
                            Start small, learn the ecosystem, and only invest funds you won't need for daily life. 
                            The numbers above are possibilities, not promises - your journey in AI investing should be 
                            sustainable and aligned with your personal financial comfort.
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-8 mb-12">
                        <div className="p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-all">
                            <h3 className="text-xl font-semibold mb-6">Average Swarm Monthly Revenue</h3>
                            <Slider 
                                defaultValue={[100]}
                                max={10000}
                                min={0}
                                step={250}
                                className="mb-2 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:bg-blue-500/20 [&_[role=slider]]:border-blue-500/50 [&_[role=slider]]:backdrop-blur-sm [&_[role=slider]]:hover:bg-blue-500/30 [&_[role=slider]]:transition-colors"
                                onValueChange={(value) => setSwarmRevenue(value[0])}
                            />
                            <div className="text-center text-blue-400 font-medium mb-4">
                                ${swarmRevenue.toLocaleString()}
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>$0</span>
                                <span>$2.5k</span>
                                <span>$5k</span>
                                <span>$7.5k</span>
                                <span>$10k</span>
                            </div>
                        </div>

                        <div className="p-8 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-all">
                            <h3 className="text-xl font-semibold mb-6">Average Swarm Direct Redistribution</h3>
                            <Slider 
                                defaultValue={[20]}
                                max={50}
                                min={0}
                                step={5}
                                className="mb-2 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:bg-purple-500/20 [&_[role=slider]]:border-purple-500/50 [&_[role=slider]]:backdrop-blur-sm [&_[role=slider]]:hover:bg-purple-500/30 [&_[role=slider]]:transition-colors"
                                onValueChange={(value) => setRedistributionRate(value[0])}
                            />
                            <div className="text-center text-purple-400 font-medium mb-4">
                                {redistributionRate}%
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>0%</span>
                                <span>10%</span>
                                <span>20%</span>
                                <span>30%</span>
                                <span>40%</span>
                                <span>50%</span>
                            </div>
                        </div>

                        <div className="p-8 rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-all">
                            <h3 className="text-xl font-semibold mb-6">Number of Shares Owned Across Swarms</h3>
                            <Slider 
                                defaultValue={[100]}
                                max={100000}
                                min={0}
                                step={5000}
                                className="mb-2 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:bg-pink-500/20 [&_[role=slider]]:border-pink-500/50 [&_[role=slider]]:backdrop-blur-sm [&_[role=slider]]:hover:bg-pink-500/30 [&_[role=slider]]:transition-colors"
                                onValueChange={(value) => setSharesOwned(value[0])}
                            />
                            <div className="text-center text-pink-400 font-medium mb-4">
                                {sharesOwned.toLocaleString()} shares
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>0</span>
                                <span>20k</span>
                                <span>40k</span>
                                <span>60k</span>
                                <span>80k</span>
                                <span>100k</span>
                            </div>
                        </div>
                    </div>


                    {/* Result */}
                    <div className="p-8 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-all">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-4">Your Estimated Monthly Income</h3>
                            <p className="text-4xl font-bold text-green-400">
                                ${calculateMonthlyIncome().toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground mt-4">
                                Based on {sharesOwned.toLocaleString()} shares of a swarm with ${swarmRevenue.toLocaleString()} monthly revenue and {redistributionRate}% redistribution
                            </p>
                        </div>
                    </div>
                </div>

                {/* Final Message */}
                <div className="mt-24 p-8 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-white/5 backdrop-blur-sm">
                    <h3 className="text-2xl font-semibold mb-6 text-center">Building Sustainable Futures</h3>
                    <div className="space-y-4 text-muted-foreground leading-relaxed max-w-[800px] mx-auto">
                        <p>
                            UBC isn't designed for overnight riches or unrealistic promises. Instead, we're building a platform for 
                            gradual, sustainable transition into the AI economy of tomorrow.
                        </p>
                        <p>
                            Our vision is to help people progressively build their stake in AI systems, learning and growing alongside 
                            the technology. This isn't about quick gains - it's about positioning yourself for long-term participation 
                            in the future economy.
                        </p>
                        <p>
                            The most successful investors in our ecosystem will be those who take time to understand the technology, 
                            make measured decisions, and grow their portfolio steadily. This is how we build a sustainable AI economy 
                            that works for everyone, not just a select few.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
