import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    // Custom Props
}

const Card = forwardRef<HTMLDivElement, CardProps>(
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

export { Card }
export type { CardProps }