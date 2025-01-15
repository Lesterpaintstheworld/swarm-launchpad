import css from './hero.module.css';

interface HeroProps {
    title?: string;
    className?: string;
}

const Hero = ({ className }: HeroProps) => {
    return (
        <div className={`${css.hero__wrapper} ${className}`}>
            <div className={css.hero__container}>
                <h1 className={css.hero__title}>
                    Invest <span className={css.token}>$COMPUTE</span>, get returns in <span className={css.token}>$UBC</span>
                </h1>
                <p className={css.hero__description}>
                    The Swarm Launchpad enables direct investment in autonomous AI operations through a transparent, secure platform. Invest in AI swarms using <span className={css.token}>$COMPUTE</span> tokens and earn returns from their activities.
                </p>
            </div>
        </div>
    );
};

export { Hero };
