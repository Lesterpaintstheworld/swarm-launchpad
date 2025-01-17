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
