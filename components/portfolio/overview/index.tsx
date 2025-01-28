import { Card } from "@/components/ui/card";
import { Investment } from "../investments"
import { cn, IntlNumberFormat } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getSwarmUsingId } from "@/data/swarms/info";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Props as RechartsProps } from 'recharts/types/component/DefaultLegendContent';
import { useLaunchpadProgramAccount } from "@/hooks/useLaunchpadProgram";

interface PortfolioOverviewProps {
    investments: Investment[];
    className?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const PortfolioOverview = ({ investments, className }: PortfolioOverviewProps) => {
    const [investmentData, setInvestmentData] = useState<any[]>([]);
    const [totalValueInCompute, setTotalValueInCompute] = useState(0);

    useEffect(() => {
        const calculateValues = async () => {
            const values = await Promise.all(investments.map(async (investment) => {
                const swarm = getSwarmUsingId(investment.swarm_id);
                if (!swarm?.pool) return null;

                const { poolAccount } = useLaunchpadProgramAccount({ poolAddress: swarm.pool });
                if (!poolAccount.data) return null;

                const totalShares = poolAccount.data.totalShares.toNumber();
                const availableShares = poolAccount.data.availableShares.toNumber();
                const soldShares = totalShares - availableShares;
                
                const cycle = Math.floor(soldShares / 5000);
                const base = Math.pow(1.35, cycle);
                const sharePrice = Math.floor(base * 100) / 100;
                const value = investment.number_of_shares * sharePrice;

                return {
                    name: swarm.name,
                    value: value,
                    valueInCompute: value,
                };
            }));

            const validValues = values.filter(Boolean);
            const total = validValues.reduce((acc, item) => acc + item.value, 0);
            
            const dataWithPercentages = validValues.map(item => ({
                ...item,
                percentage: ((item.value / total * 100).toFixed(1))
            }));

            setInvestmentData(dataWithPercentages);
            setTotalValueInCompute(total);
        };

        calculateValues();
    }, [investments]);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background/95 border border-border p-3 rounded-lg shadow-lg">
                    <p className="font-medium">{payload[0].payload.name}</p>
                    <div className="text-muted-foreground space-y-1">
                        <p className="text-green-400">
                            {IntlNumberFormat(payload[0].payload.valueInCompute)} $COMPUTE
                        </p>
                        <p>{payload[0].payload.percentage}% of portfolio</p>
                    </div>
                </div>
            );
        }
        return null;
    };

    const renderLegend = (props: RechartsProps) => {
        const { payload } = props;
        if (!payload) return null;
        
        return (
            <ul className="flex flex-wrap gap-4 justify-center mt-4">
                {payload.map((entry: any, index: number) => (
                    <li key={`item-${index}`} className="flex items-center gap-2">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm">
                            {entry.value} ({entry.payload.percentage}%)
                        </span>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <Card className={cn("w-full p-6", className)}>
            <div className="flex justify-between items-start mb-6">
                <h3 className="font-semibold">Portfolio Distribution</h3>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                    <p className="text-xl font-bold text-green-400">
                        {IntlNumberFormat(totalValueInCompute)} $COMPUTE
                    </p>
                </div>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={investmentData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {investmentData.map((_, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={renderLegend} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export { PortfolioOverview };
export type { PortfolioOverviewProps };
