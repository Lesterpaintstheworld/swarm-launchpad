import css from './terms.module.css';

const Terms = () => {
    return (
        <div className={css.terms__wrapper}>
            <div className={css.terms__container}>
                <h1>Terms of Service</h1>
                
                <section>
                    <h2>Agreement to Terms</h2>
                    <p>
                        By accessing or using the Universal Basic Compute platform, you agree to be bound by these Terms of Service. 
                        If you disagree with any part of these terms, you may not access the platform.
                    </p>
                </section>

                <section>
                    <h2>Platform Usage</h2>
                    <h3>Eligibility</h3>
                    <p>
                        You must be of legal age in your jurisdiction to use this platform. 
                        You are responsible for ensuring your use of the platform complies with applicable laws.
                    </p>
                    
                    <h3>Account Responsibility</h3>
                    <p>
                        You are responsible for maintaining the security of your wallet and private keys. 
                        We cannot recover lost keys or funds sent to incorrect addresses.
                    </p>
                </section>

                <section>
                    <h2>Investment Terms</h2>
                    <h3>Risk Acknowledgment</h3>
                    <p>
                        You acknowledge that investing in AI swarms involves significant risk. Past performance does not guarantee future results.
                    </p>
                    
                    <h3>Investment Process</h3>
                    <ul>
                        <li>Investments are made using $COMPUTE tokens</li>
                        <li>Returns are distributed in $UBC tokens</li>
                        <li>Investment amounts and terms are specific to each swarm</li>
                        <li>Secondary market trades are subject to platform fees</li>
                    </ul>
                </section>

                <section>
                    <h2>Platform Rules</h2>
                    <p>You agree not to:</p>
                    <ul>
                        <li>Attempt to circumvent platform security or fees</li>
                        <li>Use the platform for illegal activities</li>
                        <li>Interfere with platform operations</li>
                        <li>Submit false or misleading information</li>
                        <li>Attempt to manipulate swarm performance metrics</li>
                    </ul>
                </section>

                <section>
                    <h2>Fees and Payments</h2>
                    <ul>
                        <li>Secondary market trades incur a 5% fee</li>
                        <li>2.5% goes to swarm leaders</li>
                        <li>2.5% contributes to ecosystem development</li>
                        <li>All fees are automatically processed on-chain</li>
                    </ul>
                </section>

                <section>
                    <h2>Intellectual Property</h2>
                    <p>
                        The platform, including all content, features, and functionality, is owned by Universal Basic Compute 
                        and is protected by intellectual property laws.
                    </p>
                </section>

                <section>
                    <h2>Limitation of Liability</h2>
                    <p>
                        We are not liable for any losses resulting from:
                    </p>
                    <ul>
                        <li>User error or negligence</li>
                        <li>Market volatility or swarm performance</li>
                        <li>Technical issues beyond our control</li>
                        <li>Third-party actions or services</li>
                        <li>Network or blockchain issues</li>
                    </ul>
                </section>

                <section>
                    <h2>Modifications</h2>
                    <p>
                        We reserve the right to modify these terms at any time. Continued use of the platform 
                        after changes constitutes acceptance of the new terms.
                    </p>
                </section>

                <section>
                    <h2>Termination</h2>
                    <p>
                        We reserve the right to terminate or suspend access to the platform for violations 
                        of these terms or any other reason we deem appropriate.
                    </p>
                </section>

                <section>
                    <h2>Governing Law</h2>
                    <p>
                        These terms are governed by and construed in accordance with applicable laws, 
                        without regard to conflict of law principles.
                    </p>
                </section>

                <section>
                    <h2>Contact</h2>
                    <p>
                        For questions about these terms, please contact us through our support channels.
                    </p>
                </section>
            </div>
        </div>
    );
};

export { Terms };
