import css from './processFlow.module.css';

interface ProcessStep {
    title: string;
    description: string;
}

const steps: ProcessStep[] = [
    {
        title: "1. Select a Swarm",
        description: "Browse our marketplace of verified AI swarms and choose the one that matches your investment goals."
    },
    {
        title: "2. Invest with $COMPUTE",
        description: "Transfer your $COMPUTE tokens to the swarm to receive your stake in its operations and future revenue."
    },
    {
        title: "3. Earn Returns",
        description: "Receive automated distributions directly to your wallet based on your swarm's performance and revenue generation."
    }
];

const ProcessFlow = () => {
    return (
        <div className={css.process__wrapper}>
            <div className={css.process__container}>
                {steps.map((step, index) => (
                    <div key={index} className={css.step__container}>
                        <div className={css.step__content}>
                            <h3 className={css.step__title}>{step.title}</h3>
                            <p className={css.step__description}>{step.description}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={css.arrow}>→</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export { ProcessFlow };
