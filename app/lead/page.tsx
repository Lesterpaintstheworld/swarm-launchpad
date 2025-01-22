'use client';

import { BackgroundBlur } from "@/components/background";
import { Button } from "@/components/shadcn/button";

export default function Lead() {
    return (
        <main className="container view">
            <BackgroundBlur />
            <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
                {/* Title section */}
                <div className="flex flex-col items-center gap-6 text-center mt-24 mb-12">
                    <h1 className="font-normal tracking-tight">
                        Lead the <span className="metallic-text">Revolution</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-[600px] text-balance">
                        Join us in shaping the future of AI-powered investing
                    </p>
                </div>

                {/* Leadership Opportunities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[1000px]">
                    {/* Community Leader */}
                    <div className="flex flex-col gap-4 p-10 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-all h-full">
                        <div className="flex flex-col gap-2 flex-grow">
                            <h3 className="text-xl font-semibold">Community Leader</h3>
                            <p className="text-sm text-muted-foreground">Guide and grow our community</p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground mt-4 space-y-2">
                                <li>Moderate community channels</li>
                                <li>Organize community events</li>
                                <li>Help new members</li>
                                <li>Share project updates</li>
                            </ul>
                        </div>
                        <Button 
                            className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border-none mt-4"
                            onClick={() => window.open('https://t.me/Bigbosefx2', '_blank')}
                        >
                            Apply Now
                        </Button>
                    </div>

                    {/* Technical Ambassador */}
                    <div className="flex flex-col gap-4 p-10 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-all h-full">
                        <div className="flex flex-col gap-2 flex-grow">
                            <h3 className="text-xl font-semibold">Technical Ambassador</h3>
                            <p className="text-sm text-muted-foreground">Represent our technical vision</p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground mt-4 space-y-2">
                                <li>Create technical content</li>
                                <li>Answer technical questions</li>
                                <li>Provide development support</li>
                                <li>Review community contributions</li>
                            </ul>
                        </div>
                        <Button 
                            className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border-none mt-4"
                            onClick={() => window.open('https://t.me/Bigbosefx2', '_blank')}
                        >
                            Apply Now
                        </Button>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="w-full max-w-[1000px] mt-24">
                    <div className="flex flex-col items-center gap-8 p-12 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        <h2 className="text-2xl font-normal">Leadership Benefits</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                            <div className="flex flex-col gap-2 p-6 rounded-xl bg-black/20">
                                <h3 className="text-lg font-medium">Compensation</h3>
                                <p className="text-sm text-muted-foreground">Earn competitive rewards in $COMPUTE tokens</p>
                            </div>
                            <div className="flex flex-col gap-2 p-6 rounded-xl bg-black/20">
                                <h3 className="text-lg font-medium">Early Access</h3>
                                <p className="text-sm text-muted-foreground">Preview and test new features first</p>
                            </div>
                            <div className="flex flex-col gap-2 p-6 rounded-xl bg-black/20">
                                <h3 className="text-lg font-medium">Network</h3>
                                <p className="text-sm text-muted-foreground">Connect with industry leaders and innovators</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
