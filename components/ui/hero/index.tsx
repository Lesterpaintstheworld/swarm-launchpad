import { Countdown } from '../countdown';
import css from './hero.module.css';

interface HeroProps {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    className?: string;
}

const Hero = ({ title, subtitle, className }: HeroProps) => {
    return (
        <div className={`${css.hero__wrapper} ${className}`}>
            <div className={css.hero__container}>
                <h1 className={css.hero__title}>
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-xl text-muted-foreground max-w-[800px] mx-auto mb-24 text-balance">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
};

export { Hero };
