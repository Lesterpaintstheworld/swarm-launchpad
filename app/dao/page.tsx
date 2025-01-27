import { Button } from "@/components/shadcn/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Users, Vote, LineChart, Shield } from "lucide-react"

export default function DaoPage() {
    return (
        <main className="relative">
            {/* Hero Section with Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background -z-10 h-[500px]" />
            
            <div className="container max-w-5xl mx-auto py-12 space-y-16">
                {/* Hero Content */}
                <div className="space-y-6 text-center pt-8">
                    <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary/50 to-primary bg-clip-text text-transparent">
                        🏛 UBC Governance
                    </h1>
                    <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
                        Shape the future of AI development through democratic participation
                    </p>
                    <Button asChild size="lg" className="mt-8">
                        <Link href="https://app.realms.today/dao/87z1mBbAEKeL4vcsdDyA2nahcCdX8kSgKvDadA33Cmrr" target="_blank">
                            Join UBC Governance <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Key Features Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-foreground/5 rounded-xl p-8 space-y-4 hover:bg-foreground/10 transition-colors">
                        <Users className="h-8 w-8 text-primary" />
                        <h3 className="text-xl font-semibold">Community-Driven</h3>
                        <p className="text-muted-foreground">
                            Our quadratic voting system ensures everyone's voice matters - not just the biggest holders.
                        </p>
                    </div>
                    <div className="bg-foreground/5 rounded-xl p-8 space-y-4 hover:bg-foreground/10 transition-colors">
                        <Vote className="h-8 w-8 text-primary" />
                        <h3 className="text-xl font-semibold">Active Proposals</h3>
                        <p className="text-muted-foreground">
                            Vote on key decisions that shape the future of the ecosystem.
                        </p>
                    </div>
                    <div className="bg-foreground/5 rounded-xl p-8 space-y-4 hover:bg-foreground/10 transition-colors">
                        <LineChart className="h-8 w-8 text-primary" />
                        <h3 className="text-xl font-semibold">Transparent Governance</h3>
                        <p className="text-muted-foreground">
                            All proposals and votes are recorded on-chain for complete transparency.
                        </p>
                    </div>
                    <div className="bg-foreground/5 rounded-xl p-8 space-y-4 hover:bg-foreground/10 transition-colors">
                        <Shield className="h-8 w-8 text-primary" />
                        <h3 className="text-xl font-semibold">Secure Future</h3>
                        <p className="text-muted-foreground">
                            Help ensure AI development remains in the hands of the community.
                        </p>
                    </div>
                </div>

                {/* Vision Section */}
                <div className="relative bg-foreground/5 rounded-xl p-12 overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,#ffffff08_50%,transparent_100%)] pattern-grid-lg opacity-10" />
                    <div className="relative space-y-6 max-w-2xl">
                        <h2 className="text-3xl font-bold">Our Vision</h2>
                        <p className="text-lg text-muted-foreground">
                            We're creating a foundation for a future where humans remain in control of AI development, while sharing in its incredible wealth creation potential.
                        </p>
                        <blockquote className="border-l-4 border-primary pl-6 italic text-lg">
                            You're not just voting on protocol parameters. You're helping design how humanity will transition into an AI-powered future.
                        </blockquote>
                    </div>
                </div>

                {/* Getting Started Section */}
                <div className="space-y-8">
                    <h2 className="text-3xl font-bold text-center">Getting Started</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-lg border border-foreground/10 space-y-4">
                            <div className="bg-primary/20 rounded-full w-12 h-12 flex items-center justify-center">
                                <span className="text-2xl">1</span>
                            </div>
                            <h3 className="font-semibold">Hold UBC</h3>
                            <p className="text-sm text-muted-foreground">
                                Acquire and hold UBC tokens to participate in governance
                            </p>
                        </div>
                        <div className="p-6 rounded-lg border border-foreground/10 space-y-4">
                            <div className="bg-primary/20 rounded-full w-12 h-12 flex items-center justify-center">
                                <span className="text-2xl">2</span>
                            </div>
                            <h3 className="font-semibold">Connect Wallet</h3>
                            <p className="text-sm text-muted-foreground">
                                Connect your wallet to the DAO platform
                            </p>
                        </div>
                        <div className="p-6 rounded-lg border border-foreground/10 space-y-4">
                            <div className="bg-primary/20 rounded-full w-12 h-12 flex items-center justify-center">
                                <span className="text-2xl">3</span>
                            </div>
                            <h3 className="font-semibold">Start Voting</h3>
                            <p className="text-sm text-muted-foreground">
                                Review and vote on active proposals
                            </p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center space-y-6 py-8">
                    <h2 className="text-3xl font-bold">Join the Movement</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        This is how great things start - with a community of people who see the bigger picture, making decisions together.
                    </p>
                    <Button asChild size="lg">
                        <Link href="https://app.realms.today/dao/87z1mBbAEKeL4vcsdDyA2nahcCdX8kSgKvDadA33Cmrr" target="_blank">
                            Enter DAO Portal <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </main>
    )
}
