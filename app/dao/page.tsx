import { Button } from "@/components/shadcn/button"
import Link from "next/link"

export default function DaoPage() {
    return (
        <main className="min-h-screen bg-black text-gray-200">
            {/* Subtle animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-black -z-10" />
            
            <div className="max-w-5xl mx-auto p-6">
                {/* Hero Section */}
                <header className="text-center mb-12 pt-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Building a Democratic Future with AI
                    </h1>
                    <p className="text-xl text-gray-400">
                        Today, we begin governing UBC together
                    </p>
                </header>

                <section className="space-y-8">
                    {/* Vision Section */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-8 border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-4">The Vision</h2>
                        <p className="text-lg mb-4 leading-relaxed">
                            We believe AI's future must be shaped by everyone who participates in its development, not just a privileged few. Through UBC governance, we're creating a system where the community controls both the direction of AI and shares in its success.
                        </p>
                        <p className="text-lg leading-relaxed">
                            The alternative? A future where AI development is controlled by a handful of corporations, with regular people left behind. That's not the future we want. That's not the future we'll allow.
                        </p>
                    </div>

                    {/* Community Power Section */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-8 border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-4">The Power of Community</h2>
                        <div className="space-y-4">
                            <p className="text-lg leading-relaxed">
                                Our quadratic voting system ensures every voice matters - not just the biggest holders. Even with modest UBC holdings, you have real power to shape crucial decisions.
                            </p>
                            <p className="text-lg leading-relaxed">
                                This is just the beginning. We're progressively increasing community control until we achieve complete decentralization. Step by step, the future of AI moves into the hands of its users and supporters.
                            </p>
                        </div>
                    </div>

                    {/* Take Action Section */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-8 border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-4">Take Action</h2>
                        <div className="space-y-4">
                            <p className="text-lg leading-relaxed">
                                Ready to shape the future? With 100,000+ $UBC, you can create proposals that direct our path. We're also launching dedicated spaces for community debate - because the best decisions emerge from open discussion.
                            </p>
                            <p className="text-lg leading-relaxed">
                                Why participate? Because you're not just voting on protocol parameters. You're helping design how humanity will transition into an AI-powered future. A future where everyone can participate in and benefit from AI development.
                            </p>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Start Today</h2>
                        <div className="space-y-4">
                            <p className="text-lg text-white leading-relaxed">
                                Our first governance proposals are live now. Your vote matters. Your voice matters. This is your invitation to help shape one of the most important technological transitions in human history.
                            </p>
                            <div className="flex justify-center pt-4">
                                <Button 
                                    asChild
                                    size="lg" 
                                    className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8"
                                >
                                    <Link href="https://app.realms.today/dao/87z1mBbAEKeL4vcsdDyA2nahcCdX8kSgKvDadA33Cmrr" target="_blank">
                                        View Active Proposals
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center mt-16 mb-8 text-gray-400">
                    <p className="text-lg">
                        Together, we're not just building a protocol.<br />
                        We're creating the foundation for a democratic AI future.
                    </p>
                </footer>
            </div>
        </main>
    )
}
