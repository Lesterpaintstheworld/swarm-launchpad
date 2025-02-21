import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Token as TokenType } from "../tokens.types";
import Image from "next/image";

interface TokenProps extends React.HTMLAttributes<HTMLParagraphElement> {
    token: TokenType;
    hover?: boolean;
}

const Token = forwardRef<HTMLParagraphElement, TokenProps>(
    (
        { token, hover = true, className, ...props },
        ref
    ) => {
        return (
            <Tag
                {...props}
                ref={ref}
                className={cn(
                    "transition-all duration-200 cursor-pointer flex flex-row items-center gap-2",
                    hover && "hover:scale-110 hover:rotate-3",
                    className
                )}
            >
                {token?.icon &&
                    <Image
                        src={token?.icon as string}
                        alt={token?.label as string}
                        width={12}
                        height={12}
                    />
                }
                {token?.label}
            </Tag>
        )
    }
)

Token.displayName = 'ComputeToken';

export { Token }
