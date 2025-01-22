'use client';

import { BackgroundBlur } from "@/components/background";
import { Button } from "@/components/shadcn/button";
import { 
    ArrowRight, 
    Rocket, 
    Star, 
    Handshake,
    Lightbulb,
    Search,
    Target,
    Users
} from "lucide-react";
import { 
    Accordion, 
    AccordionContent, 
    AccordionItem, 
    AccordionTrigger 
} from "@/components/shadcn/accordion";
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

            {/* Inception Swarms - Updated Section */}
            <section className="py-24">
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Rocket className="w-8 h-8 text-purple-500" />
                        <h2 className="text-3xl font-semibold">Become a Swarm Guardian</h2>
                    </div>
                    <p className="text-muted-foreground">Take a swarm from idea to project, earn 5% of the raise</p>
                </div>

                {/* Two Paths Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="p-8 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/5 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <Lightbulb className="h-5 w-5 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-semibold">Got an idea?<br />Propose Your Vision</h3>
                        </div>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                Submit your innovative AI swarm concept
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                Work with our team to validate and refine it
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                Earn 5% of the fundraising when it launches
                            </li>
                        </ul>
                    </div>

                    <div className="p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-white/5 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <Search className="h-5 w-5 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold">Got the network?<br />Claim an Existing Concept</h3>
                        </div>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                Browse our pre-vetted Inception Swarms
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                Apply to become Guardian for unclaimed concepts
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                Receive the same 5% reward structure
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Guardian Role */}
                <div className="mb-16 p-8 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                            <Target className="h-5 w-5 text-yellow-500" />
                        </div>
                        <h3 className="text-xl font-semibold">What Guardians Do</h3>
                    </div>
                    <p className="text-muted-foreground mb-8">
                        Guardians help the swarm find its vision and leader until it graduates to an early swarm. They evaluate potential leaders, 
                        support them through the graduation process, and receive 5% of the fundraising when the swarm successfully graduates.
                    </p>
                    <p className="text-muted-foreground">
                        Their role is to bridge the gap between concept and execution by finding the right leadership.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <Rocket className="h-5 w-5 text-green-500" />
                            </div>
                            <h3 className="text-xl font-semibold">Project Support</h3>
                        </div>
                        <ul className="space-y-3 text-muted-foreground list-disc pl-6">
                            <li>Technical validation assistance</li>
                            <li>Market opportunity analysis</li>
                            <li>Business case development</li>
                            <li>Risk assessment support</li>
                        </ul>
                    </div>
                </div>

                {/* FAQ Accordion */}
                <div className="mb-16">
                    <h3 className="text-2xl font-semibold mb-8">Frequently Asked Questions</h3>
                    <Accordion type="single" collapsible className="space-y-4">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>What makes a good Guardian?</AccordionTrigger>
                            <AccordionContent>
                                Vision, strategic thinking, and the ability to guide a project's development. Technical expertise is valuable but not required.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>How involved will I be?</AccordionTrigger>
                            <AccordionContent>
                                Guardians provide strategic guidance and vision alignment throughout development, but don't handle day-to-day operations.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>How does the 5% reward work?</AccordionTrigger>
                            <AccordionContent>
                                When the project successfully raises funds, you receive 5% of the initial fundraising, aligned with project milestones.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>Can I be both Guardian and Lead?</AccordionTrigger>
                            <AccordionContent>
                                Yes, if you have both the vision and the ability to execute, you can take both roles.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* Call to Action */}
                <div className="flex justify-center gap-4">
                    <Button 
                        size="lg"
                        className="group bg-gradient-to-r from-purple-500 to-blue-500"
                        onClick={() => window.open('https://t.me/Bigbosefx2', '_blank')}
                    >
                        Propose New Swarm
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button 
                        size="lg"
                        variant="outline"
                        className="group"
                        onClick={() => window.open('https://t.me/Bigbosefx2', '_blank')}
                    >
                        View Available Swarms
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
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
