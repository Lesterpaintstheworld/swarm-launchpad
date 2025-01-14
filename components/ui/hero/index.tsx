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
            </div>
        </div>
    );
};

export { Hero };
