'use client'

// Global cache for swarm data with expiration
const swarmCache: Record<string, { data: any, timestamp: number }> = {};
const pendingRequests: { [key: string]: Promise<any> | undefined } = {};
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes

const fetchSwarmWithCache = async (swarmId: string) => {
  const now = Date.now();
  
  // Return cached data if available and not expired
  if (swarmCache[swarmId] && (now - swarmCache[swarmId].timestamp < CACHE_EXPIRATION)) {
    return swarmCache[swarmId].data;
  }

  // Return existing promise if request is pending
  if (pendingRequests[swarmId]) {
    return pendingRequests[swarmId];
  }

  // Create new request with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
  
  pendingRequests[swarmId] = fetch(`/api/swarms/${swarmId}`, { signal: controller.signal })
    .then(async (response) => {
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error('Failed to fetch swarm');
      const data = await response.json();
      swarmCache[swarmId] = { data, timestamp: now };
      delete pendingRequests[swarmId];
      return data;
    })
    .catch((error) => {
      clearTimeout(timeoutId);
      delete pendingRequests[swarmId];
      console.error(`Error fetching swarm ${swarmId}:`, error);
      // Return cached data even if expired rather than failing completely
      if (swarmCache[swarmId]) {
        console.log(`Using expired cache for ${swarmId}`);
        return swarmCache[swarmId].data;
      }
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

// First, let's create a more specific interface for the initial mapped items
interface InitialInvestmentData {
    name: string;
    value: number;
    valueInCompute: number;
    percentage: undefined;
}

// Keep the existing InvestmentDataItem interface for the final data
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

    const totalValueInCompute = useMemo(() => {
        return chartData.reduce((acc, item) => acc + item.value, 0);
    }, [chartData]);

    useEffect(() => {
        let isMounted = true;
        const abortController = new AbortController();

        async function fetchData() {
            if (!program || investments.length === 0) {
                if (isMounted) setChartData([]);
                return;
            }

            try {
                // Create a stable reference to program.account.pool to avoid dependency issues
                const poolFetcher = typedProgram.account.pool.fetch.bind(typedProgram.account.pool);
                
                // Use a map to batch similar requests and reduce API calls
                const poolDataPromises = new Map();
                
                const values = await Promise.all(investments.map(async (investment) => {
                    try {
                        const swarm = await fetchSwarmWithCache(investment.swarm_id);
                        if (!swarm?.pool) return null;
                        
                        const poolPubkey = new PublicKey(swarm.pool);
                        
                        // Reuse pool data promise if we've already started fetching it
                        if (!poolDataPromises.has(swarm.pool)) {
                            poolDataPromises.set(
                                swarm.pool, 
                                poolFetcher(poolPubkey)
                                    .catch(err => {
                                        console.error(`Error fetching pool data for ${swarm.pool}:`, err);
                                        return null;
                                    })
                            );
                        }
                        
                        const poolData = await poolDataPromises.get(swarm.pool);
                        if (!poolData) return null;
                        
                        const totalShares = poolData.totalShares.toNumber();
                        const availableShares = poolData.availableShares.toNumber();
                        const soldShares = totalShares - availableShares;
                        
                        const cycle = Math.floor(soldShares / 5000);
                        const base = Math.pow(1.35, cycle);
                        const sharePrice = Math.round(base * 100) / 100;
                        
                        const value = Math.round(investment.number_of_shares * sharePrice);

                        return {
                            name: swarm.name,
                            value: value,
                            valueInCompute: value,
                            percentage: undefined
                        } as InitialInvestmentData;
                    } catch (error) {
                        console.error(`Error calculating value for swarm ${investment.swarm_id}:`, error);
                        return null;
                    }
                }));

                if (!isMounted) return;

                // Update the type predicate to use InitialInvestmentData
                const validValues = values.filter((item): item is InitialInvestmentData => item !== null);
                
                // Calculate percentages and convert to final format
                const totalValue = validValues.reduce((acc, item) => acc + item.value, 0);
                const valuesWithPercentages: InvestmentDataItem[] = validValues.map(item => ({
                    ...item,
                    percentage: ((item.value / totalValue * 100) || 0).toFixed(1)
                }));

                setChartData(valuesWithPercentages);
            } catch (error) {
                console.error('Error calculating investment values:', error);
                if (isMounted) setChartData([]);
            }
        }

        fetchData();

        return () => {
            isMounted = false;
            abortController.abort();
        };
    }, [investments, program, typedProgram.account.pool]); // Added typedProgram.account.pool to dependencies

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
