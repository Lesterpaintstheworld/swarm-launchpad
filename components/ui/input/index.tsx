import { forwardRef } from "react";
import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    type?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        { className, type = "text", ...props },
        ref
    ) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex w-full bg-card border border-border placeholder-muted rounded-lg px-4 py-3 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-foreground/30",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)

export { Input }
export type { InputProps }