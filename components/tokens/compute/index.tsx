import { Tag } from "@/components/ui/tag";
import { forwardRef } from "react";

const ComputeToken = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    (
        { ...props },
        ref
    ) => {
        return (
            <Tag {...props} ref={ref}>$COMPUTE</Tag>
        )
    }
)

export { ComputeToken }