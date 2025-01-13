import { Card } from "@/components/ui/card";
import { Investment } from "../investments"
import { BarChart } from "@/components/charts/bar";
import { cn, IntlNumberFormat } from "@/lib/utils";
import { useCallback } from "react";
import { getSwarm } from "@/data/swarms/previews";

interface PortfolioOverviewProps {
    investments: Investment[];
    className?: string;
}

const PortfolioOverview = ({ investments, className }: PortfolioOverviewProps) => {

    const total_owned_shares = investments.reduce((acc, item) => acc + item.number_of_shares, 0);

    const marshallInvestmentData = useCallback(() => {
        return investments.map(({ swarm_id, number_of_shares }) => {
            const swarm = getSwarm(swarm_id);
            return {
                label: swarm.name,
                value: number_of_shares,
                toolTipContent: <p>{swarm.name} - <strong>{IntlNumberFormat(number_of_shares / total_owned_shares * 100)}%</strong></p>
            }
        });
    }, [investments]);

    return (
        <Card className={cn("w-full", className)}>
            <BarChart data={marshallInvestmentData()} />
        </Card>
    );

}

export { PortfolioOverview };
export type { PortfolioOverviewProps };