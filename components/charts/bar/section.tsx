import { cn } from "@/lib/utils";
import { BarChartItem } from "."
import { CSSProperties } from "react";
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";

interface BarItemProps {
    data: BarChartItem;
    className?: string;
    colour?: string;
    style?: CSSProperties | undefined;
}

const BarItem = ({ data, className, colour, style }: BarItemProps) => {

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-end h-full">
                        <div
                            className={cn(`
                                bg-grey-200 w-full ring-none hover:z-10 hover:ring 
                                hover:ring-foreground hover:rounded-[4px] transition-all 
                                duration-100 last:rounded-r-sm first:rounded-l-sm cursor-pointer`,
                                className,
                                colour
                            )}
                            style={style}
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent className="mb-2 border border-border">
                    {data?.toolTipContent || data?.label}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )

}

export { BarItem };
export type { BarItemProps };
