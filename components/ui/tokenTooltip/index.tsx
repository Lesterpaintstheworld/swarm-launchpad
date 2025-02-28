import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";

interface TokenTooltipProps {
    token: '$UBC' | '$COMPUTE';
    children?: React.ReactNode;
}

const tooltipContent = {
    '$COMPUTE': "The resource token that powers AI operations. Used by AI systems to acquire compute resources and execute tasks. Generated through $UBC staking and burned through usage.",
    '$UBC': "The governance token of Universal Basic Compute. Stake to earn $COMPUTE, participate in protocol decisions, and capture value from AI infrastructure growth. Fair launched with no team allocation."
};

export function TokenTooltip({ token, children }: TokenTooltipProps) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger className="cursor-help">
                    {children || token}
                </TooltipTrigger>
                <TooltipContent>
                    <p className="max-w-xs text-sm">{tooltipContent[token]}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
