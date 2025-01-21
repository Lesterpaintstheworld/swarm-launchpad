import css from './privacy.module.css';

const PrivacyPolicy = () => {
    return (
        <div className={css.privacy__wrapper}>
            <div className={css.privacy__container}>
                <h1>Privacy Policy</h1>
                
                <section>
                    <h2>Introduction</h2>
                    <p>
                        We respect your privacy and are committed to protecting your personal data. 
                        This privacy policy explains how we handle your information when you use our platform.
                    </p>
                </section>

                <section>
                    <h2>Information We Collect</h2>
                    <ul>
                        <li>Wallet addresses</li>
                        <li>Transaction history on our platform</li>
                        <li>Investment positions</li>
                        <li>Usage data and platform interactions</li>
                    </ul>
                </section>

                <section>
                    <h2>How We Use Your Information</h2>
                    <ul>
                        <li>To process your investments and transactions</li>
                        <li>To maintain accurate records of swarm ownership</li>
                        <li>To distribute returns and rewards</li>
                        <li>To improve our platform and services</li>
                        <li>To comply with legal obligations</li>
                    </ul>
                </section>

                <section>
                    <h2>Information Sharing</h2>
                    <p>
                        We only share your information in the following circumstances:
                    </p>
                    <ul>
                        <li>When required by law or regulation</li>
                        <li>To process transactions on the blockchain (public by nature)</li>
                        <li>With service providers who assist in platform operations</li>
                    </ul>
                </section>

                <section>
                    <h2>Data Security</h2>
                    <p>
                        We implement appropriate security measures to protect your information, including:
                    </p>
                    <ul>
                        <li>Encryption of sensitive data</li>
                        <li>Regular security assessments</li>
                        <li>Access controls and authentication</li>
                        <li>Secure infrastructure and protocols</li>
                    </ul>
                </section>

                <section>
                    <h2>Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access your personal information</li>
                        <li>Request correction of inaccurate data</li>
                        <li>Request deletion of your data (where applicable)</li>
                        <li>Object to processing of your data</li>
                        <li>Data portability</li>
                    </ul>
                </section>

                <section>
                    <h2>Cookies and Tracking</h2>
                    <p>
                        We use essential cookies to ensure the basic functionality of our platform. 
                        We may also use analytics tools to improve our services.
                    </p>
                </section>

                <section>
                    <h2>Changes to This Policy</h2>
                    <p>
                        We may update this privacy policy from time to time. We will notify you of any 
                        significant changes by posting the new policy on this page.
                    </p>
                </section>

                <section>
                    <h2>Contact Us</h2>
                    <p>
                        If you have any questions about this privacy policy or our practices, 
                        please contact us through our support channels.
                    </p>
                </section>
            </div>
        </div>
    );
};

export { PrivacyPolicy };
