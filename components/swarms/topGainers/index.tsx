import { SwarmPreviewData } from '@/components/swarms/swarm.types';
import { BarChart } from '@/components/charts/bar';
import Image from 'next/image';

interface SwarmTopGainersProps {
    swarms: SwarmPreviewData[];
    className?: string;
}

export const SwarmTopGainers = ({ swarms, className }: SwarmTopGainersProps) => {
    // Sort swarms by multiple in descending order and take top 10
    const topGainers = swarms
        .sort((a, b) => (b.multiple || 0) - (a.multiple || 0))
        .slice(0, 10);

    const chartData = topGainers.map(swarm => ({
        label: swarm.name,
        value: swarm.multiple || 0,
        toolTipContent: (
            <div className="flex items-center gap-2">
                <Image 
                    src={swarm.image} 
                    alt={swarm.name} 
                    width={20} 
                    height={20} 
                    className="rounded-full"
                />
                <span>{swarm.name}</span>
                <span className="font-bold">{(swarm.multiple || 0).toFixed(1)}%</span>
            </div>
        )
    }));

    return (
        <div className={className}>
            <h2 className="text-2xl font-bold mb-4">Top Swarm Gainers Last 24 Hours</h2>
            <div className="bg-black/50 rounded-lg p-6">
                <div className="h-[400px]">
                    <BarChart 
                        data={chartData}
                        barColor="from-yellow-600 to-yellow-400"
                    />
                </div>
            </div>
        </div>
    );
};
