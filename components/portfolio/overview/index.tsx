'use client'

const swarmCache: Record<string, any> = {};
let pendingRequests: Record<string, Promise<any>> = {};

const fetchSwarmWithCache = async (swarmId: string) => {
  // Return cached data if available
  if (swarmCache[swarmId]) {
    return swarmCache[swarmId];
  }

  // Return existing promise if request is pending
  if (pendingRequests[swarmId]) {
    return pendingRequests[swarmId];
  }

  // Create new request
  pendingRequests[swarmId] = fetch(`/api/swarms/${swarmId}`)
    .then(async (response) => {
      if (!response.ok) throw new Error('Failed to fetch swarm');
      const data = await response.json();
      swarmCache[swarmId] = data;
      delete pendingRequests[swarmId];
      return data;
    })
    .catch((error) => {
      delete pendingRequests[swarmId];
      throw error;
    });

  return pendingRequests[swarmId];
};

interface PoolAccount {
    totalShares: {
        toNumber: () => number;
    };
    availableShares: {
        toNumber: () => number;
    };
}

interface ProgramAccounts {
    pool: {
        fetch(address: PublicKey): Promise<PoolAccount>;
    };
}

import { Card } from "@/components/ui/card";
import { Investment } from "../investments"
import { cn, IntlNumberFormat } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";

interface InvestmentDataItem {
    name: string;
    value: number;
    valueInCompute: number;
    percentage?: string;
}

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: InvestmentDataItem;
    }>;
}

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: InvestmentDataItem;
    }>;
}

interface CustomPayload {
    value: string;
    payload: InvestmentDataItem;
    color: string;
}
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Props as RechartsProps } from 'recharts/types/component/DefaultLegendContent';
import { PublicKey } from "@solana/web3.js";
import { useLaunchpadProgram } from "@/hooks/useLaunchpadProgram";

interface PortfolioOverviewProps {
    investments: Investment[];
    className?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const PortfolioOverview = ({ investments, className }: PortfolioOverviewProps) => {
    const [chartData, setChartData] = useState<InvestmentDataItem[]>([]);
    const { program } = useLaunchpadProgram();
    const typedProgram = program as unknown as {
        account: ProgramAccounts;
    };
    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            if (!program || investments.length === 0) {
                if (isMounted) setChartData([]);
                return;
            }

            try {
                const values = await Promise.all(investments.map(async (investment) => {
                    try {
                        const swarm = await fetchSwarmWithCache(investment.swarm_id);
                        if (!swarm?.pool) return null;
                        
                        const poolPubkey = new PublicKey(swarm.pool);
                        const poolData = await typedProgram.account.pool.fetch(poolPubkey);
                        
                        const totalShares = poolData.totalShares.toNumber();
                        const availableShares = poolData.availableShares.toNumber();
                        const soldShares = totalShares - availableShares;
                        
                        const cycle = Math.floor(soldShares / 5000);
                        const base = Math.pow(1.35, cycle);
                        const sharePrice = Math.round(base * 100) / 100;
                        
                        const value = Math.round(investment.number_of_shares * sharePrice);
                        const totalValue = values?.reduce((acc, item) => acc + (item?.value || 0), 0) || 0;

                        return {
                            name: swarm.name,
                            value: value,
                            valueInCompute: value,
                            percentage: ((value / totalValue * 100) || 0).toFixed(1)
                        };
                    } catch (error) {
                        console.error(`Error calculating value for swarm ${investment.swarm_id}:`, error);
                        return null;
                    }
                }));

                if (!isMounted) return;

                const validValues = values.filter((item): item is InvestmentDataItem => item !== null);
                setChartData(validValues);
            } catch (error) {
                console.error('Error calculating investment values:', error);
                if (isMounted) setChartData([]);
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [investments, program]);

    const totalValueInCompute = useMemo(() => {
        return chartData.reduce((acc, item) => acc + item.value, 0);
    }, [chartData]);

    const CustomTooltip = ({ active, payload }: TooltipProps) => {
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
                {((payload as unknown[]).map((entry, index) => {
                    const typedEntry = entry as {
                        value: string;
                        payload: InvestmentDataItem;
                    };
                    return (
                        <li key={`item-${index}`} className="flex items-center gap-2">
                            <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm">
                                {typedEntry.value} ({typedEntry.payload.percentage}%)
                            </span>
                        </li>
                    );
                }))}
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
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((_, index) => (
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
