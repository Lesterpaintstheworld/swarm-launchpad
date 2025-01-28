import { Card } from "@/components/ui/card";
import { Investment } from "../investments"
import { cn, IntlNumberFormat } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { getSwarm } from "@/data/swarms/previews";
import { calculateSharePrice } from '@/lib/utils';
import { useLaunchpadProgram } from "@/hooks/useLaunchpadProgram";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Props as RechartsProps } from 'recharts/types/component/DefaultLegendContent';

interface PortfolioOverviewProps {
    investments: Investment[];
    className?: string;
}

interface CustomLegendPayload {
    value: string;
    color: string;
    payload: {
        name: string;
        value: number;
        valueInCompute: number;
        percentage: string;
        sharePrice: number;
    };
}

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        value: number;
        payload: {
            name: string;
            value: number;
            valueInCompute: number;
            percentage: string;
            sharePrice: number;
        };
    }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const PortfolioOverview = ({ investments, className }: PortfolioOverviewProps) => {
    const total_owned_shares = investments.reduce((acc, item) => acc + item.number_of_shares, 0);

    const [investmentData, setInvestmentData] = useState<any[]>([]);
    const [totalValueInCompute, setTotalValueInCompute] = useState(0);

    // Create a single program hook
    const { program } = useLaunchpadProgram();

    useEffect(() => {
        const fetchData = async () => {
            const data = await Promise.all(investments.map(async (investment) => {
                const { swarm_id, number_of_shares } = investment;
                const swarm = getSwarm(swarm_id);
                
                if (!swarm.pool || !program) return null;

                try {
                    const poolAccount = await program.account.pool.fetch(new PublicKey(swarm.pool));
                
                    const totalShares = poolAccount.totalShares.toNumber();
                    const availableShares = poolAccount.availableShares.toNumber();
                    const soldShares = totalShares - availableShares;
                
                    // Calculate price based on bonding curve
                    const cycle = Math.floor(soldShares / 5000);
                    const base = Math.pow(1.35, cycle);
                    const sharePrice = Math.floor(base * 0.1); // Divide by 1000 to fix scaling

                    const valueInCompute = number_of_shares * sharePrice;

                    return {
                        name: swarm.name,
                        value: number_of_shares,
                        valueInCompute,
                        percentage: (number_of_shares / total_owned_shares * 100).toFixed(1),
                        sharePrice
                    };
                } catch (error) {
                    console.error(`Error fetching pool account for ${swarm_id}:`, error);
                    return null;
                }
            }));

            const validData = data.filter(Boolean);
            setInvestmentData(validData);
            setTotalValueInCompute(validData.reduce((acc, item) => acc + item.valueInCompute, 0));
        };

        fetchData();
    }, [investments, total_owned_shares, program]);


    const CustomTooltip = ({ active, payload }: TooltipProps) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background/95 border border-border p-3 rounded-lg shadow-lg">
                    <p className="font-medium">{payload[0].payload.name}</p>
                    <div className="text-muted-foreground space-y-1">
                        <p>{IntlNumberFormat(payload[0].value)} shares ({payload[0].payload.percentage}%)</p>
                        <p className="text-green-400">
                            {IntlNumberFormat(payload[0].payload.valueInCompute)} $COMPUTE
                        </p>
                        <p className="text-sm">
                            Price per share: {IntlNumberFormat(payload[0].payload.sharePrice)} $COMPUTE
                        </p>
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
                {payload.map((entry, index) => {
                    const typedEntry = entry as unknown as CustomLegendPayload;
                    return (
                        <li key={`item-${index}`} className="flex items-center gap-2">
                            <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: typedEntry.color }}
                            />
                            <span className="text-sm">
                                {typedEntry.value} ({typedEntry.payload.percentage}%)
                            </span>
                        </li>
                    );
                })}
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
                            {investmentData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={(props) => renderLegend(props as RechartsProps)} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export { PortfolioOverview };
export type { PortfolioOverviewProps };
