'use client';

import { BackgroundBlur } from "@/components/background";
import { Button } from "@/components/shadcn/button";
import { ArrowRight, Rocket, Star, Handshake } from "lucide-react";
import { BondingCurve } from "@/components/ui/returns/bondingCurve";

export default function Lead() {
    return (
        <main className="container view">
            <BackgroundBlur />
            
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center">
                <h1 className="font-normal tracking-tight max-w-[800px]">
                    Join the <span className="metallic-text">AI Revolution</span>: Build Your Swarm
                </h1>
                <p className="text-xl text-muted-foreground max-w-[700px] text-balance">
                    From inception to partnership, discover your path in the UBC ecosystem and shape the future of artificial intelligence.
                </p>
            </section>

            {/* Inception Swarms */}
            <section className="py-24">
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Rocket className="w-8 h-8 text-purple-500" />
                        <h2 className="text-3xl font-semibold">Inception Swarms</h2>
                    </div>
                    <p className="text-muted-foreground">Launch your AI vision with community support</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold">Role & Responsibilities</h3>
                        <ul className="space-y-3 text-muted-foreground list-disc list-inside">
                            <li>Define your AI swarm's vision and roadmap</li>
                            <li>Engage with early supporters and community</li>
                            <li>Work with guardians on technical implementation</li>
                            <li>Guide development and feature priorities</li>
                            <li>Build initial user base and traction</li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold">Rewards & Benefits</h3>
                        <ul className="space-y-3 text-muted-foreground list-disc list-inside">
                            <li>25-50% revenue share from swarm operations</li>
                            <li>Technical support from UBC guardians</li>
                            <li>Access to UBC development resources</li>
                            <li>Community funding through bonding curve</li>
                            <li>Marketing and launch support</li>
                        </ul>
                    </div>
                </div>

                <div className="rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm p-8">
                    <h3 className="text-xl font-semibold mb-6">Inception Funding Model</h3>
                    <BondingCurve />
                </div>
            </section>

            {/* Early Swarms */}
            <section className="py-24">
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Star className="w-8 h-8 text-yellow-500" />
                        <h2 className="text-3xl font-semibold">Early Swarms</h2>
                    </div>
                    <p className="text-muted-foreground">Scale your proven AI solution</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold">Role & Responsibilities</h3>
                        <ul className="space-y-3 text-muted-foreground list-disc list-inside">
                            <li>Scale operations and user base</li>
                            <li>Optimize revenue streams</li>
                            <li>Expand feature set and capabilities</li>
                            <li>Build partnerships within ecosystem</li>
                            <li>Maintain high performance standards</li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold">Rewards & Benefits</h3>
                        <ul className="space-y-3 text-muted-foreground list-disc list-inside">
                            <li>25-35% revenue share from operations</li>
                            <li>Priority access to UBC resources</li>
                            <li>Cross-promotion opportunities</li>
                            <li>Advanced integration capabilities</li>
                            <li>Ecosystem partnership opportunities</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Partner Swarms */}
            <section className="py-24">
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Handshake className="w-8 h-8 text-green-500" />
                        <h2 className="text-3xl font-semibold">Partner Swarms</h2>
                    </div>
                    <p className="text-muted-foreground">Lead the ecosystem as an established player</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold">Role & Responsibilities</h3>
                        <ul className="space-y-3 text-muted-foreground list-disc list-inside">
                            <li>Drive ecosystem innovation</li>
                            <li>Mentor inception swarms</li>
                            <li>Participate in governance</li>
                            <li>Lead cross-swarm initiatives</li>
                            <li>Set industry standards</li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold">Benefits & Influence</h3>
                        <ul className="space-y-3 text-muted-foreground list-disc list-inside">
                            <li>Revenue share negotiable</li>
                            <li>Governance participation</li>
                            <li>First access to new features</li>
                            <li>Strategic partnership opportunities</li>
                            <li>Ecosystem-wide influence</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-24 text-center">
                <h2 className="text-3xl font-semibold mb-8">Ready to Build Your Swarm?</h2>
                <Button 
                    size="lg"
                    className="group"
                    onClick={() => window.open('https://t.me/Bigbosefx2', '_blank')}
                >
                    Contact Us to Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </section>
        </main>
    );
}
