'use client';

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/datatable";
import { useLaunchpadProgramAccount } from "@/hooks/useLaunchpadProgram";
import { useEffect, useState } from "react";

export interface DividendPayment {
    id: string;
    swarm_id: string;
    amount: number;
    ubcAmount: number;
    timestamp: string;
    status: 'pending' | 'claimed';
}

interface DividendPaymentsProps {
    className?: string;
}

const DividendPayments = ({ className }: DividendPaymentsProps) => {
    const [dividends, setDividends] = useState<DividendPayment[]>([]);
    const [revenueData, setRevenueData] = useState<Record<string, { weeklyRevenue: number, revenueShare: number }>>({});
    const { position: kinKongPosition } = useLaunchpadProgramAccount({ poolAddress: 'FwJfuUfrX91VH1Li4PJWCNXXRR4gUXLkqbEgQPo6t9fz' });
    const { position: xForgePosition } = useLaunchpadProgramAccount({ poolAddress: 'AaFvJBvjuCTs93EVNYqMcK5upiTaTh33SV7q4hjaPFNi' });
    const { position: kinOSPosition } = useLaunchpadProgramAccount({ poolAddress: '37u532qgHbjUHic6mQK51jkT3Do7qkWLEUQCx22MDBD8' });
    const { position: therapyKinPosition } = useLaunchpadProgramAccount({ poolAddress: '5wWLpeH2DDrAS9Lxx1nGnwtMTvu7U9txf4BuXxdN6V6H' });

    // Fetch revenue data
    useEffect(() => {
        let isMounted = true;
        const controllers = new Map();
        
        const fetchRevenueData = async () => {
            try {
                const swarms = ['xforge', 'kinos', 'kinkong', 'therapykin'];
                
                const revenues = await Promise.all(
                    swarms.map(async (swarmId) => {
                        // Create an abort controller for each request
                        const controller = new AbortController();
                        controllers.set(swarmId, controller);
                        
                        try {
                            const response = await fetch(`/api/swarms/${swarmId}/revenue`, {
                                signal: controller.signal
                            });
                            
                            if (!response.ok) {
                                return [swarmId, {
                                    weeklyRevenue: 0,
                                    revenueShare: 100
                                }];
                            }
                            
                            const data = await response.json();
                            return [swarmId, {
                                weeklyRevenue: data.weeklyRevenue || 0,
                                revenueShare: data.revenueShare || 100
                            }];
                        } catch (error) {
                            if (error instanceof Error && error.name === 'AbortError') {
                                return [swarmId, { weeklyRevenue: 0, revenueShare: 100 }];
                            }
                            console.error(`Error fetching revenue for ${swarmId}:`, error);
                            return [swarmId, { weeklyRevenue: 0, revenueShare: 100 }];
                        }
                    })
                );
                
                if (isMounted) {
                    setRevenueData(Object.fromEntries(revenues));
                }
            } catch (error) {
                console.error('Error fetching revenue data:', error);
            }
        };

        fetchRevenueData();
        
        return () => {
            isMounted = false;
            // Abort all pending requests on cleanup
            controllers.forEach(controller => controller.abort());
        };
    }, []);

    useEffect(() => {
        const calculateDividends = () => {
            const now = new Date();
        
            // Helper function to calculate ownership percentage
            const calculateOwnership = (position: { shares?: { toNumber: () => number } } | undefined, totalShares: number) => {
                if (!position?.shares) return 0;
                const shares = position.shares.toNumber();
                return shares > 0 ? shares / totalShares : 0;
            };

            const data: DividendPayment[] = [];

            // Only add dividend entries if there is actual ownership
            const xForgeOwnership = calculateOwnership(xForgePosition?.data, 100000);
            if (xForgeOwnership > 0 && revenueData.xforge) {
                // Apply revenueShare as a percentage (divide by 100)
                const revenue = revenueData.xforge.weeklyRevenue * (revenueData.xforge.revenueShare / 100);
                data.push({
                    id: '1',
                    swarm_id: 'xforge',
                    amount: Math.floor(revenue * 0.90 * xForgeOwnership),
                    ubcAmount: Math.floor(revenue * 0.10 * xForgeOwnership),
                    timestamp: now.toISOString(),
                    status: 'pending'
                });
            }

            const kinOSOwnership = calculateOwnership(kinOSPosition?.data, 100000);
            if (kinOSOwnership > 0 && revenueData.kinos) {
                // Apply revenueShare as a percentage (divide by 100)
                const revenue = revenueData.kinos.weeklyRevenue * (revenueData.kinos.revenueShare / 100);
                data.push({
                    id: '2',
                    swarm_id: 'kinos',
                    amount: Math.floor(revenue * 0.90 * kinOSOwnership),
                    ubcAmount: Math.floor(revenue * 0.10 * kinOSOwnership),
                    timestamp: now.toISOString(),
                    status: 'pending'
                });
            }

            const kinKongOwnership = calculateOwnership(kinKongPosition?.data, 100000);
            if (kinKongOwnership > 0 && revenueData.kinkong) {
                // Apply revenueShare as a percentage (divide by 100)
                const revenue = revenueData.kinkong.weeklyRevenue * (revenueData.kinkong.revenueShare / 100);
                data.push({
                    id: '3',
                    swarm_id: 'kinkong',
                    amount: 0, // 0% to COMPUTE
                    ubcAmount: Math.floor(revenue * kinKongOwnership), // 100% to UBC
                    timestamp: now.toISOString(),
                    status: 'pending'
                });
            }

            const therapyKinOwnership = calculateOwnership(therapyKinPosition?.data, 100000);
            if (therapyKinOwnership > 0 && revenueData.therapykin) {
                // Apply revenueShare as a percentage (divide by 100)
                const revenue = revenueData.therapykin.weeklyRevenue * (revenueData.therapykin.revenueShare / 100);
                data.push({
                    id: '4',
                    swarm_id: 'therapykin',
                    amount: 0, // 0% to COMPUTE
                    ubcAmount: Math.floor(revenue * therapyKinOwnership), // 100% to UBC
                    timestamp: now.toISOString(),
                    status: 'pending'
                });
            }

            setDividends(data);
        };

        calculateDividends();
    }, [kinKongPosition?.data, xForgePosition?.data, kinOSPosition?.data, therapyKinPosition?.data, revenueData]);

    return (
        <Card className={cn("w-full p-6", className)}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-semibold">Dividend Payments</h3>
                    <p className="text-sm text-muted-foreground">Weekly revenue distributions from your swarm investments</p>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={dividends}
            />
        </Card>
    );
};

export { DividendPayments };
export type { DividendPaymentsProps };
