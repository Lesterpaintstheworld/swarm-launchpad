import { Button } from "@/components/shadcn/button"
import Link from "next/link"

export default function DaoPage() {
    return (
        <main className="container max-w-5xl mx-auto py-12">
            <div className="space-y-8">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">🏛 UBC Governance: Building Tomorrow's Society</h1>
                    <p className="text-xl text-muted-foreground">Shape the future of AI development through democratic participation</p>
                </div>

                <div className="prose prose-invert max-w-none space-y-6">
                    <p className="text-lg">
                        Friends, today we're opening the UBC DAO - creating the foundation for a future where humans remain in control of AI development, while sharing in its incredible wealth creation potential.
                    </p>

                    <h2 className="text-2xl font-semibold">Why This Matters</h2>
                    <p>
                        We're designing a system where humans decide what gets built and how it gets built. The alternative? A future where AI development is controlled by a handful of corporations, with regular people left behind. That's not the future we want.
                    </p>

                    <h2 className="text-2xl font-semibold">Your Voice Matters</h2>
                    <p>
                        That's why we're introducing governance carefully and thoughtfully. Our quadratic voting system is designed so everyone's voice matters - not just the biggest whales. If you own UBC, you have real power to shape decisions, even with a modest holding.
                    </p>

                    <div className="bg-foreground/5 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Vote on active proposals that shape our ecosystem</li>
                            <li>Submit your own proposals (100,000+ $UBC required)</li>
                            <li>Participate in community discussions</li>
                            <li>Help design the future of AI governance</li>
                        </ul>
                    </div>

                    <p>
                        Our vision is clear: progressively increase community control until we achieve complete decentralized governance, putting the future of AI in the hands of the people.
                    </p>

                    <blockquote className="border-l-4 border-primary pl-4 italic">
                        You're not just voting on protocol parameters. You're helping design how humanity will transition into an AI-powered future. A future where everyone can participate in and benefit from AI development.
                    </blockquote>

                    <div className="flex justify-center py-6">
                        <Button asChild size="lg">
                            <Link href="https://app.realms.today/dao/87z1mBbAEKeL4vcsdDyA2nahcCdX8kSgKvDadA33Cmrr" target="_blank">
                                Join UBC Governance
                            </Link>
                        </Button>
                    </div>

                    <div className="text-sm text-muted-foreground text-center">
                        This is how great things start - with a community of people who see the bigger picture, making decisions together. Your vote matters. Your voice matters. This is your invitation to help shape the future.
                    </div>
                </div>
            </div>
        </main>
    )
}
