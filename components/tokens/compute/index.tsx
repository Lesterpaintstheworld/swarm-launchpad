import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const ComputeToken = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    (
        { className, ...props },
        ref
    ) => {
        return (
            <Tag
                {...props}
                ref={ref}
                className={cn("transition-all duration-200 hover:scale-110 hover:rotate-3 cursor-pointer", className)}
            >
                $COMPUTE
            </Tag>
        )
    }
)

ComputeToken.displayName = 'ComputeToken';

export { ComputeToken }
