import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/shadcn/button';

export function LearnToEarn() {
    return (
        <div className="bg-[#0F1218] py-24">
            <div className="container">
                <div className="space-y-24">
                    {/* Top Section - The Great Transition */}
                    <div className="max-w-4xl mx-auto space-y-8">
                        <h2 className="text-5xl font-bold text-white text-center">
                            From Income to Investment:<br/>Your Personal Evolution
                        </h2>
                        
                        <div className="space-y-6 text-lg text-white/80">
                            <p>
                                The old story was simple: work hard, save what you can, hope for the best. 
                                But that story is ending. As AI reshapes our world, we must evolve from 
                                wage earners to active investors - not by choice, but by necessity.
                            </p>
                            
                            <p>
                                Trading hours for dollars will soon be impossible for most. 
                                As AI rapidly transforms the job market, building ownership in automated systems 
                                is becoming essential for survival. This isn't about choice anymore. 
                                It's about adapting to survive and thrive in an AI-driven economy.
                            </p>
                            
                            <p>
                                Every week, our AI swarms generate real revenue for their human stakeholders. 
                                The concerns about AI displacing jobs are real - but having a plan is better than 
                                just worrying. Our community is actively building their stake in the AI economy. 
                                Your $COMPUTE is your bridge from the old economy to the new.
                            </p>
                            
                            <p>
                                The greatest wealth transfer in history isn't happening in some distant future. 
                                It's happening now. Over the next months, we're launching multiple AI swarms across 
                                different sectors - from content creation to technical services. Each swarm represents 
                                a new opportunity to transition from the old economy to the new.
                            </p>

                            <p>
                                Our launchpad provides a clear path: start with educational swarms to learn the basics, 
                                move to established swarms like Synthetic Souls for steady returns, then diversify into 
                                emerging opportunities as you build your portfolio of AI assets.
                            </p>

                            <p className="text-2xl font-semibold text-white text-center">
                                Secure your place in the AI economy.
                            </p>
                        </div>
                    </div>

                    {/* Bottom Section - Learn to Earn */}
                    <div className="relative">
                        <div className="max-w-2xl mx-auto space-y-10">
                            <div className="text-center space-y-6">
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-bold tracking-tight text-white">
                                        Begin Your Journey 🎓
                                    </h2>
                                    <p className="text-xl text-white/60">
                                        Master AI investing fundamentals and earn your first 10,000 $COMPUTE
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 space-y-8">
                                <div className="flex items-center justify-center gap-3">
                                    <MessageSquare className="h-6 w-6 text-white/60" />
                                    <p className="text-lg text-white/80">Learn from our AI mentor and start earning</p>
                                </div>

                                <div className="flex flex-col items-center gap-6">
                                    <Button 
                                        variant="default" 
                                        size="lg"
                                        className="bg-white/10 hover:bg-white/15 text-white px-8 py-6 text-lg rounded-xl"
                                        onClick={() => window.open('https://chatgpt.com/g/g-678e1bf0877481919eda0dfdb2efcd57-wealth-hive', '_blank')}
                                    >
                                        Learn to Earn
                                    </Button>
                                    
                                    <p className="text-sm text-white/60 italic">
                                        Complete real learning milestones to earn your tokens
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-white/10">
                                    <p className="text-sm text-white/60 flex items-center justify-center gap-2">
                                        🔒 Verify achievements: 
                                        <a 
                                            href="https://t.me/verifyleo" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-white/80 hover:text-white hover:underline"
                                        >
                                            @verifyleo on Telegram
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
