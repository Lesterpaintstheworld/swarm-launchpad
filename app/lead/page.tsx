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
        </main>
    );
}
