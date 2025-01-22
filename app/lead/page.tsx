'use client';

import { BackgroundBlur } from "@/components/background";
import { Button } from "@/components/shadcn/button";
import { ArrowRight, Lightbulb, Code, Network } from "lucide-react";

export default function Lead() {
    return (
        <main className="container view">
            <BackgroundBlur />
            
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center">
                <h1 className="font-normal tracking-tight max-w-[800px]">
                    Lead the <span className="metallic-text">AI Revolution</span>: Your Journey from Visionary to Ecosystem Builder
                </h1>
                <p className="text-xl text-muted-foreground max-w-[700px] text-balance">
                    Shape the future of artificial intelligence with UBC ecosystem. Transform your ideas into thriving AI swarms with our comprehensive support system.
                </p>
            </section>

            {/* Leadership Journey Section */}
            <section className="py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-semibold mb-4">Your Leadership Journey</h2>
                    <p className="text-muted-foreground">Choose your path in the AI revolution</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Guardian Card */}
                    <div className="flex flex-col gap-6 p-8 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-all">
                        <Lightbulb className="w-10 h-10 text-yellow-500" />
                        <h3 className="text-2xl font-semibold">The Visionary</h3>
                        <p className="text-muted-foreground flex-grow">
                            For creative minds with groundbreaking AI concepts. Be the originator of new possibilities in the AI space.
                        </p>
                        <Button 
                            className="w-full group"
                            onClick={() => window.open('https://t.me/Bigbosefx2', '_blank')}
                        >
                            Become a Guardian
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    {/* Swarm Lead Card */}
                    <div className="flex flex-col gap-6 p-8 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-all">
                        <Code className="w-10 h-10 text-blue-500" />
                        <h3 className="text-2xl font-semibold">The Builder</h3>
                        <p className="text-muted-foreground flex-grow">
                            Take the helm of an AI project and turn vision into reality. Lead the development of next-gen AI systems.
                        </p>
                        <Button 
                            className="w-full group"
                            onClick={() => window.open('https://t.me/Bigbosefx2', '_blank')}
                        >
                            Become a Swarm Lead
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    {/* Partner Card */}
                    <div className="flex flex-col gap-6 p-8 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-all">
                        <Network className="w-10 h-10 text-green-500" />
                        <h3 className="text-2xl font-semibold">The Ecosystem Player</h3>
                        <p className="text-muted-foreground flex-grow">
                            Scale your success and join the network of established AI leaders. Shape the future of AI-to-AI commerce.
                        </p>
                        <Button 
                            className="w-full group"
                            onClick={() => window.open('https://t.me/Bigbosefx2', '_blank')}
                        >
                            Partner With Us
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </section>
            {/* Development Stages Section */}
            <section className="py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-semibold mb-4">Development Stages</h2>
                    <p className="text-muted-foreground">Your journey from concept to successful AI swarm</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Inception Stage */}
                    <div className="p-6 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">1</div>
                            <h3 className="text-xl font-semibold">Inception Stage</h3>
                        </div>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>• Idea validation and refinement</li>
                            <li>• Technical feasibility assessment</li>
                            <li>• Market opportunity analysis</li>
                            <li>• Initial architecture planning</li>
                            <li>• Guardian assignment</li>
                        </ul>
                    </div>

                    {/* Early Development */}
                    <div className="p-6 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">2</div>
                            <h3 className="text-xl font-semibold">Early Development</h3>
                        </div>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>• Initial funding deployment</li>
                            <li>• Technical infrastructure setup</li>
                            <li>• Community building initiation</li>
                            <li>• Development milestone planning</li>
                            <li>• Progress tracking and support</li>
                        </ul>
                    </div>

                    {/* Growth Phase */}
                    <div className="p-6 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">3</div>
                            <h3 className="text-xl font-semibold">Growth Phase</h3>
                        </div>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>• Market integration</li>
                            <li>• Trading system implementation</li>
                            <li>• Community expansion</li>
                            <li>• Revenue generation initiation</li>
                            <li>• Performance optimization</li>
                        </ul>
                    </div>

                    {/* Maturity */}
                    <div className="p-6 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">4</div>
                            <h3 className="text-xl font-semibold">Maturity</h3>
                        </div>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>• Full ecosystem integration</li>
                            <li>• Cross-swarm commerce</li>
                            <li>• Sustainable revenue generation</li>
                            <li>• Ongoing optimization</li>
                            <li>• Network effect maximization</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Support Structure Section */}
            <section className="py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-semibold mb-4">Support Structure</h2>
                    <p className="text-muted-foreground">Comprehensive resources to ensure your success</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Technical Support */}
                    <div className="p-8 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        <Code className="w-10 h-10 text-blue-500 mb-6" />
                        <h3 className="text-xl font-semibold mb-4">Technical Support</h3>
                        <ul className="space-y-3 text-muted-foreground">
                            <li>• Infrastructure setup and maintenance</li>
                            <li>• Development guidance and review</li>
                            <li>• Security assessment and hardening</li>
                            <li>• Integration assistance</li>
                            <li>• Performance optimization</li>
                        </ul>
                    </div>

                    {/* Financial Support */}
                    <div className="p-8 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        <svg className="w-10 h-10 text-green-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold mb-4">Financial Support</h3>
                        <ul className="space-y-3 text-muted-foreground">
                            <li>• Initial capital allocation</li>
                            <li>• Revenue sharing structure</li>
                            <li>• Trading fee benefits</li>
                            <li>• Marketing budget</li>
                            <li>• Growth incentives</li>
                        </ul>
                    </div>

                    {/* Project Support */}
                    <div className="p-8 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        <Network className="w-10 h-10 text-purple-500 mb-6" />
                        <h3 className="text-xl font-semibold mb-4">Project Support</h3>
                        <ul className="space-y-3 text-muted-foreground">
                            <li>• Project management tools</li>
                            <li>• Milestone planning and tracking</li>
                            <li>• Community building assistance</li>
                            <li>• Marketing strategy development</li>
                            <li>• Launch coordination</li>
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    );
}
