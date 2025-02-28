import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    (
        { children, className, ...props },
        ref
    ) => {
        return (
            <div
                className={cn(
                    "p-6 bg-card border border-border rounded-lg w-fit",
                    className
                )}
                {...props}
                ref={ref}
            >
                {children}
            </div>
        );
    }
)

Card.displayName = 'Card';

export { Card }