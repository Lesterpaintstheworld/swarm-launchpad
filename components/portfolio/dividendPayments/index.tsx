'use client';

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/datatable";
import { useLaunchpadProgramAccount } from "@/hooks/useLaunchpadProgram";
import { useEffect, useState } from "react";

interface DividendPaymentsProps {
    className?: string;
}

const DividendPayments = ({ className }: DividendPaymentsProps) => {
    const [dividends, setDividends] = useState<any[]>([]);
    const { position: kinKongPosition } = useLaunchpadProgramAccount({ poolAddress: 'FwJfuUfrX91VH1Li4PJWCNXXRR4gUXLkqbEgQPo6t9fz' });
    const { position: xForgePosition } = useLaunchpadProgramAccount({ poolAddress: 'AaFvJBvjuCTs93EVNYqMcK5upiTaTh33SV7q4hjaPFNi' });
    const { position: kinOSPosition } = useLaunchpadProgramAccount({ poolAddress: '37u532qgHbjUHic6mQK51jkT3Do7qkWLEUQCx22MDBD8' });

    useEffect(() => {
        const calculateDividends = () => {
            const data = [];
            const now = new Date();
            
            // Helper function to calculate ownership percentage
            const calculateOwnership = (position: any, totalShares: number) => {
                if (!position?.shares) return 0;
                return position.shares.toNumber() / totalShares;
            };

            // KinKong dividends
            const kinKongOwnership = calculateOwnership(kinKongPosition?.data, 100000);
            if (kinKongOwnership > 0) {
                data.push({
                    id: '1',
                    swarm: 'Kin Kong',
                    amount: Math.floor(12000 * kinKongOwnership),
                    date: now.toISOString(),
                    status: 'pending'
                });
            }

            // XForge dividends
            const xForgeOwnership = calculateOwnership(xForgePosition?.data, 100000);
            if (xForgeOwnership > 0) {
                data.push({
                    id: '2',
                    swarm: 'XForge',
                    amount: Math.floor(160000 * xForgeOwnership),
                    date: now.toISOString(),
                    status: 'pending'
                });
            }

            // KinOS dividends
            const kinOSOwnership = calculateOwnership(kinOSPosition?.data, 100000);
            if (kinOSOwnership > 0) {
                data.push({
                    id: '3',
                    swarm: 'KinOS',
                    amount: Math.floor(46000 * kinOSOwnership),
                    date: now.toISOString(),
                    status: 'pending'
                });
            }

            setDividends(data);
        };

        calculateDividends();
    }, [kinKongPosition?.data, xForgePosition?.data, kinOSPosition?.data]);

    return (
        <Card className={cn("p-6", className)}>
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
