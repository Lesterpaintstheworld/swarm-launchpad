import css from './hero.module.css';

interface HeroProps {
    title: string;
    className?: string;
}

const Hero = ({ title, className }: HeroProps) => {
    return (
        <div className={`${css.hero__wrapper} ${className}`}>
            <div className={css.hero__container}>
                <h1 className={css.hero__title}>
                    {title}
                </h1>
            </div>
        </div>
    );
};

export { Hero };
