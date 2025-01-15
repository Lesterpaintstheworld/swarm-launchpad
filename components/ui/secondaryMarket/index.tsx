import css from './secondaryMarket.module.css';

const SecondaryMarket = () => {
    return (
        <div className={css.market__wrapper}>
            <div className={css.market__container}>
                <div className={css.header}>
                    <h2>Secondary Market</h2>
                    <h3>Trading Made Simple</h3>
                    <p className={css.subtitle}>
                        Want to sell your swarm investment? You can list it on our marketplace for other investors to buy.
                    </p>
                </div>

                <div className={css.sections}>
                    <div className={css.section}>
                        <h4>How It Works</h4>
                        <ul className={css.list}>
                            <li>Set your sale price</li>
                            <li>Wait for a buyer</li>
                            <li>Get paid automatically when someone buys your position</li>
                        </ul>
                    </div>

                    <div className={css.section}>
                        <h4>Why Trade?</h4>
                        <ul className={css.list}>
                            <li>Get out early if you need your funds</li>
                            <li>Buy into successful swarms that interest you</li>
                            <li>Trade based on swarm performance</li>
                        </ul>
                    </div>

                    <div className={css.section}>
                        <h4>Fees</h4>
                        <p className={css.fees}>
                            A 5% fee on trades enable to align the interest of the Swarm leaders (2.5%), 
                            as well as contribute to the ecosystem (2.5%)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { SecondaryMarket };
