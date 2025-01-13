import { Tag } from "@/components/ui/tag";
import { forwardRef } from "react";

const UBCToken = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    (
        { className, ...props },
        ref
    ) => {
        return (
            <Tag 
                {...props} 
                ref={ref} 
                className={`transition-all duration-200 hover:scale-110 hover:rotate-3 cursor-pointer ${className || ''}`}
            >
                $UBC
            </Tag>
        )
    }
)

UBCToken.displayName = 'UBCToken';

export { UBCToken }
