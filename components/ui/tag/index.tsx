import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface TagProps extends React.HTMLAttributes<HTMLParagraphElement> { }

const Tag = forwardRef<HTMLParagraphElement, TagProps>(
    (
        { children, className, ...props },
        ref
    ) => {
        return (
            <p className={cn("bg-card font-medium text-xs py-1 px-2 rounded-sm border border-border w-fit text-nowrap", className)} {...props} ref={ref}>
                {children}
            </p>
        );
    }
);

export { Tag };
export type { TagProps };