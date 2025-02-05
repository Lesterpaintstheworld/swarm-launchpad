'use client';

import { Card } from "@/components/ui/card"
import { columns } from "./columns";
import { DataTable } from "@/components/ui/datatable";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Investment = {
    swarm_id: string;
    number_of_shares: number;
    total_shares: number;
    last_dividend_payment: number;
}

interface InvestmentsProps {
    className?: string;
}

const Investments = ({ className }: InvestmentsProps) => {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchSwarms() {
            try {
                const response = await fetch('/api/swarms');
                const swarms = await response.json();
                
                // Create sample investment data for each swarm
                const sampleInvestments = swarms.map((swarm: any) => ({
                    swarm_id: swarm.id,
                    number_of_shares: Math.floor(Math.random() * 5000), // Random number of shares between 0-5000
                    total_shares: 100000, // Fixed total shares for now
                    last_dividend_payment: 0
                }));

                console.log('Generated investments:', sampleInvestments);
                setInvestments(sampleInvestments);
            } catch (error) {
                console.error('Error fetching swarms:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchSwarms();
    }, []);

    if (isLoading) {
        return (
            <Card className={cn("w-full p-6", className)}>
                <h4 className="mb-4">Your Investments</h4>
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
                </div>
            </Card>
        );
    }

    return (
        <Card className={cn("w-full p-6", className)}>
            <h4 className="mb-4">Your Investments</h4>
            <DataTable columns={columns} data={investments} />
        </Card>
    )
}

export { Investments }
export type { InvestmentsProps, Investment }
