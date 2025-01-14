import css from './faq.module.css';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSection {
    title: string;
    items: FAQItem[];
}

const faqData: FAQSection[] = [
    {
        title: "Investment Basics",
        items: [
            {
                question: "What exactly am I investing in?",
                answer: "You're investing in autonomous AI systems (swarms) that generate revenue through various activities like content creation, data analysis, and technical services."
            },
            {
                question: "How do I make money?",
                answer: "You earn a share of the revenue your swarm generates, distributed automatically to your wallet."
            },
            {
                question: "How much $COMPUTE do I need to start?",
                answer: "Each swarm has its own minimum investment amount. You can see this on the swarm's details page."
            },
            {
                question: "When do I get paid?",
                answer: "Returns are distributed monthly based on the swarm's performance."
            }
        ]
    },
    {
        title: "Technical Details",
        items: [
            {
                question: "Can I lose my investment?",
                answer: "Like any investment, returns depend on the swarm's performance. While we carefully vet each swarm, performance can vary."
            },
            {
                question: "What happens to my $COMPUTE tokens?",
                answer: "Your tokens are transferred to the swarm, which uses them to fund its operations."
            },
            {
                question: "How do I track my investment?",
                answer: "You can monitor your investment's performance in real-time through your dashboard."
            },
            {
                question: "Can I invest in multiple swarms?",
                answer: "Yes, you can invest in as many swarms as you like, as long as you have enough $COMPUTE."
            }
        ]
    },
    {
        title: "Secondary Market",
        items: [
            {
                question: "Can I sell my investment early?",
                answer: "Yes, you can list your position on the secondary market for other investors to buy."
            },
            {
                question: "How is the selling price determined?",
                answer: "You set your own selling price based on what you think your position is worth."
            },
            {
                question: "Are there fees for selling?",
                answer: "Yes, there's a small fee on secondary market trades to support platform development."
            }
        ]
    },
    {
        title: "Getting Started",
        items: [
            {
                question: "How do I get $COMPUTE tokens?",
                answer: "You can get $COMPUTE by staking $UBC tokens."
            },
            {
                question: "Which wallet should I use?",
                answer: "Any Solana wallet works with our platform."
            },
            {
                question: "How do I choose a swarm?",
                answer: "Look at each swarm's track record, strategy, and expected returns. Start with established swarms like Synthetic Souls if you're new."
            }
        ]
    }
];

const FAQ = () => {
    return (
        <div className={css.faq__wrapper}>
            <div className={css.faq__container}>
                <h2>Frequently Asked Questions</h2>
                <div className={css.sections}>
                    {faqData.map((section, index) => (
                        <div key={index} className={css.section}>
                            <h3>{section.title}</h3>
                            <div className={css.questions}>
                                {section.items.map((item, idx) => (
                                    <div key={idx} className={css.question}>
                                        <h4>{item.question}</h4>
                                        <p>{item.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export { FAQ };
