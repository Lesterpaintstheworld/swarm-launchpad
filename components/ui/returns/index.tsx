import css from './returns.module.css';

const Returns = () => {
    return (
        <div className="bg-accent-1 py-24">
            <div className="container">
                <div className="text-center mb-16">
                    <h2>Investment Returns</h2>
                    <h3 className="text-muted mt-2">Clear Structure, Transparent Distribution</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Trading Fees Structure */}
                    <div>
                        <h4 className="mb-6">5% Trading Fee Distribution</h4>
                        <div className="space-y-6">
                            <div className="bg-background/20 p-6 rounded-lg">
                                <h5 className="text-xl mb-2">Partner Fees (2%)</h5>
                                <ul className="list-disc list-inside text-muted space-y-2">
                                    <li>Collected in UBC</li>
                                    <li>Weekly distribution to partners</li>
                                </ul>
                            </div>
                            
                            <div className="bg-background/20 p-6 rounded-lg">
                                <h5 className="text-xl mb-2">Platform Fees (1%)</h5>
                                <ul className="list-disc list-inside text-muted space-y-2">
                                    <li>Collected in UBC</li>
                                    <li>Platform operations & development</li>
                                </ul>
                            </div>

                            <div className="bg-background/20 p-6 rounded-lg">
                                <h5 className="text-xl mb-2">Investor Rewards (2%)</h5>
                                <ul className="list-disc list-inside text-muted space-y-2">
                                    <li>Collected in UBC</li>
                                    <li>Claimable by active UBC traders/holders</li>
                                    <li>30-day claim window</li>
                                    <li>Unclaimed rewards go to Community Fund</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Community Development Fund */}
                    <div>
                        <h4 className="mb-6">Community Development Fund</h4>
                        <div className="space-y-6">
                            <div className="bg-background/20 p-6 rounded-lg">
                                <h5 className="text-xl mb-2">Swarm Development Grants</h5>
                                <ul className="list-disc list-inside text-muted space-y-2">
                                    <li>Funding for promising swarms</li>
                                    <li>Performance-based allocations</li>
                                    <li>Technical improvement grants</li>
                                    <li>Innovation rewards</li>
                                </ul>
                            </div>

                            <div className="bg-background/20 p-6 rounded-lg">
                                <h5 className="text-xl mb-2">Educational Content</h5>
                                <ul className="list-disc list-inside text-muted space-y-2">
                                    <li>Tutorial development</li>
                                    <li>Documentation improvements</li>
                                    <li>Community workshops</li>
                                    <li>Technical content creation</li>
                                </ul>
                            </div>

                            <div className="bg-background/20 p-6 rounded-lg">
                                <h5 className="text-xl mb-2">Key Benefits</h5>
                                <ul className="list-disc list-inside text-muted space-y-2">
                                    <li>No $COMPUTE sell pressure</li>
                                    <li>Clear utility/value capture separation</li>
                                    <li>$COMPUTE dedicated to compute resources</li>
                                    <li>UBC captures all fee value</li>
                                    <li>Ecosystem growth through education</li>
                                    <li>New swarm development funding</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Returns };
import css from './returns.module.css';
import { ArrowUpRight, Coins, GraduationCap, LineChart, Rocket, Users } from 'lucide-react';

const Returns = () => {
    return (
        <div className="bg-accent-1 py-24">
            <div className="container">
                <div className="text-center mb-16 max-w-2xl mx-auto px-4">
                    <h2 className="text-balance">Investment Returns</h2>
                    <h3 className="text-muted mt-2 text-balance">Generate passive income through UBC rewards</h3>
                    <p className="text-muted-foreground mt-4 text-balance">
                        Our innovative fee structure ensures fair distribution of returns while fostering ecosystem growth. 
                        Every trade contributes to both immediate rewards and long-term development.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 px-4">
                    {/* Trading Fees Structure */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-12 w-12 shrink-0 rounded-xl bg-chart-1/20 flex items-center justify-center">
                                <LineChart className="h-6 w-6 text-chart-1" />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-xl font-bold truncate">Trading Fee Distribution</h4>
                                <p className="text-muted-foreground truncate">5% fee split optimized for growth</p>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-chart-1 to-chart-2 rounded-lg blur opacity-30 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative bg-background/40 backdrop-blur-sm p-6 rounded-lg border border-border/50">
                                <div className="flex items-center gap-2 mb-3">
                                    <Coins className="h-5 w-5 shrink-0 text-chart-1" />
                                    <h5 className="font-semibold truncate">Partner Rewards (2%)</h5>
                                </div>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <ArrowUpRight className="h-4 w-4 shrink-0" />
                                        <span className="truncate">Weekly UBC distributions</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <ArrowUpRight className="h-4 w-4 shrink-0" />
                                        <span className="truncate">Direct partner incentives</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-chart-2 to-chart-3 rounded-lg blur opacity-30 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative bg-background/40 backdrop-blur-sm p-6 rounded-lg border border-border/50">
                                <div className="flex items-center gap-2 mb-3">
                                    <Rocket className="h-5 w-5 shrink-0 text-chart-2" />
                                    <h5 className="font-semibold truncate">Development Fund (1.5%)</h5>
                                </div>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <ArrowUpRight className="h-4 w-4 shrink-0" />
                                        <span className="truncate">Platform improvements</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <ArrowUpRight className="h-4 w-4 shrink-0" />
                                        <span className="truncate">New feature development</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-chart-3 to-chart-4 rounded-lg blur opacity-30 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative bg-background/40 backdrop-blur-sm p-6 rounded-lg border border-border/50">
                                <div className="flex items-center gap-2 mb-3">
                                    <Users className="h-5 w-5 shrink-0 text-chart-3" />
                                    <h5 className="font-semibold truncate">Community Growth (1.5%)</h5>
                                </div>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <ArrowUpRight className="h-4 w-4 shrink-0" />
                                        <span className="truncate">Marketing initiatives</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <ArrowUpRight className="h-4 w-4 shrink-0" />
                                        <span className="truncate">Community events</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Community Development Fund */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-12 w-12 shrink-0 rounded-xl bg-chart-4/20 flex items-center justify-center">
                                <GraduationCap className="h-6 w-6 text-chart-4" />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-xl font-bold truncate">Community Development</h4>
                                <p className="text-muted-foreground truncate">Building a sustainable ecosystem</p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-background/40 backdrop-blur-sm p-6 rounded-lg border border-border/50">
                                <h5 className="font-semibold mb-4">How Fees Support Growth</h5>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-muted-foreground">Partner Rewards</span>
                                            <span className="text-sm font-medium">2.0%</span>
                                        </div>
                                        <div className="h-2 bg-background rounded-full">
                                            <div className="h-2 bg-chart-1 rounded-full" style={{width: '40%'}}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-muted-foreground">Development Fund</span>
                                            <span className="text-sm font-medium">1.5%</span>
                                        </div>
                                        <div className="h-2 bg-background rounded-full">
                                            <div className="h-2 bg-chart-2 rounded-full" style={{width: '30%'}}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-muted-foreground">Community Growth</span>
                                            <span className="text-sm font-medium">1.5%</span>
                                        </div>
                                        <div className="h-2 bg-background rounded-full">
                                            <div className="h-2 bg-chart-3 rounded-full" style={{width: '30%'}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-background/40 backdrop-blur-sm p-6 rounded-lg border border-border/50">
                                <h5 className="font-semibold mb-4">Key Benefits</h5>
                                <ul className="space-y-3 text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <ArrowUpRight className="h-4 w-4 shrink-0" />
                                        <span className="truncate">Sustainable ecosystem growth</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <ArrowUpRight className="h-4 w-4 shrink-0" />
                                        <span className="truncate">Continuous platform improvement</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <ArrowUpRight className="h-4 w-4 shrink-0" />
                                        <span className="truncate">Fair reward distribution</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <ArrowUpRight className="h-4 w-4 shrink-0" />
                                        <span className="truncate">Community-driven development</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Returns };
