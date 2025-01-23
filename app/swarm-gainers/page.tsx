import { previews } from '@/data/swarms/previews';
import { BarChart } from '@/components/charts/bar';
import Image from 'next/image';

export default function SwarmGainersPage() {
    const topGainers = [...previews]
        .sort((a, b) => (b.multiple || 0) - (a.multiple || 0))
        .slice(0, 10);

    const chartData = topGainers.map(swarm => ({
        label: '', // Empty label since we'll show images below
        value: swarm.multiple || 0,
        toolTipContent: (
            <div className="flex items-center gap-2 p-2">
                <Image 
                    src={swarm.image} 
                    alt={swarm.name} 
                    width={24} 
                    height={24} 
                    className="rounded-full"
                />
                <span className="text-white">{swarm.name}</span>
                <span className="text-yellow-400 font-bold">{swarm.multiple?.toFixed(1)}%</span>
            </div>
        )
    }));

    return (
        <div className="min-h-screen bg-black p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-2">TOP SWARM GAINERS</h1>
                <h2 className="text-xl text-yellow-400 mb-8">LAST 24 HOURS</h2>
                
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-yellow-400/20">
                    <div className="h-[600px]">
                        <BarChart 
                            data={chartData}
                            barColor="from-yellow-600 to-yellow-400"
                            showValues
                            valueFormat={(value) => `${value.toFixed(1)}%`}
                            showAxis={true}
                            yAxisLabel="Gain (%)"
                        />
                    </div>

                    {/* Images directly below each bar */}
                    <div className="flex justify-between px-12 -mt-8">
                        {topGainers.map((swarm) => (
                            <div key={swarm.id} className="flex flex-col items-center w-16">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400/50 bg-white shadow-lg shadow-yellow-400/20">
                                    <Image
                                        src={swarm.image}
                                        alt={swarm.name}
                                        width={48}
                                        height={48}
                                        className="object-cover"
                                    />
                                </div>
                                <span className="text-yellow-400 text-xs mt-2 text-center">
                                    {swarm.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
