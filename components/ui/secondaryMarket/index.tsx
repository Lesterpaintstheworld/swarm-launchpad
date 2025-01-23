import { ArrowRightLeft, LineChart, Wallet } from 'lucide-react';

export function SecondaryMarket() {
    return (
        <div className="py-24">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold">Secondary Market</h2>
                    <p className="mt-6 max-w-2xl mx-auto text-muted-foreground">
                        Trade swarm positions directly with other investors through our automated marketplace
                    </p>
                </div>

                {/* Trading Process */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-b from-chart-1/20 to-transparent rounded-lg blur-xl" />
                        <div className="relative bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-white/5">
                            <div className="h-12 w-12 rounded-xl bg-chart-1/20 flex items-center justify-center mb-6">
                                <Wallet className="h-6 w-6 text-chart-1" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">1. Set Your Price</h3>
                            <p className="text-muted-foreground">
                                List your position at your desired price. Our system handles everything automatically.
                            </p>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-b from-chart-2/20 to-transparent rounded-lg blur-xl" />
                        <div className="relative bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-white/5">
                            <div className="h-12 w-12 rounded-xl bg-chart-2/20 flex items-center justify-center mb-6">
                                <ArrowRightLeft className="h-6 w-6 text-chart-2" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">2. Wait for Buyers</h3>
                            <p className="text-muted-foreground">
                                Your listing appears in our marketplace for interested investors to discover.
                            </p>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-b from-chart-3/20 to-transparent rounded-lg blur-xl" />
                        <div className="relative bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-white/5">
                            <div className="h-12 w-12 rounded-xl bg-chart-3/20 flex items-center justify-center mb-6">
                                <LineChart className="h-6 w-6 text-chart-3" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">3. Instant Settlement</h3>
                            <p className="text-muted-foreground">
                                When someone buys, tokens and payment are exchanged automatically and instantly.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Trading Opportunities */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-chart-2 to-chart-3 rounded-lg blur opacity-30 group-hover:opacity-40 transition-opacity" />
                    <div className="relative bg-background/40 backdrop-blur-sm p-8 rounded-2xl border border-white/5">
                        <h3 className="text-2xl font-bold mb-8">Trading Opportunities</h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-chart-1/20 flex items-center justify-center">
                                        <Wallet className="h-5 w-5 text-chart-1" />
                                    </div>
                                    <h4 className="font-semibold">Early Exit</h4>
                                </div>
                                <p className="text-muted-foreground">
                                    Need your funds early? Sell your position instantly without waiting for the full term.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-chart-2/20 flex items-center justify-center">
                                        <ArrowRightLeft className="h-5 w-5 text-chart-2" />
                                    </div>
                                    <h4 className="font-semibold">Buy Success</h4>
                                </div>
                                <p className="text-muted-foreground">
                                    Invest in already successful swarms by purchasing positions from existing holders.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-chart-3/20 flex items-center justify-center">
                                        <LineChart className="h-5 w-5 text-chart-3" />
                                    </div>
                                    <h4 className="font-semibold">Trade Performance</h4>
                                </div>
                                <p className="text-muted-foreground">
                                    Take advantage of market movements and trade based on swarm performance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SecondaryMarket;
