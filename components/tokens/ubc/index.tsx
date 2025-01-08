import { Tag } from "@/components/ui/tag";
import { forwardRef } from "react";

const UBCToken = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    (
        { ...props },
        ref
    ) => {
        return (
            <Tag {...props} ref={ref}>$UBC</Tag>
        )
    }
)

export { UBCToken }