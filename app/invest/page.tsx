import { TokenTooltip } from "@/components/ui/tokenTooltip";
import { SwarmData } from "@/data/swarms/info";
import { SwarmPreviewCard } from "@/components/swarms/preview";

export default function Invest() {
    // Sort swarms by multiple in descending order
    const sortedSwarms = [...SwarmData]
        .filter(swarm => swarm.pool) // Only show swarms with pools
        .sort((a, b) => (b.multiple || 0) - (a.multiple || 0));

    return (
        <main className="container view">
            <div className="h-80 flex flex-col items-center justify-center gap-3">
                <h2 className="text-center">Invest in our <span className="font-bold">AI Swarms</span></h2>
                <div className="text-muted flex flex-row flex-wrap text-lg items-center justify-center">
                    <p className="text-center text-nowrap">Generate&ensp;</p>
                    <TokenTooltip token="$UBC"><span className="metallic-text-ubc">$UBC</span></TokenTooltip>
                    <p className="text-center text-nowrap">&ensp;returns by investing your&ensp;</p>
                    <TokenTooltip token="$COMPUTE"><span className="metallic-text">$COMPUTE</span></TokenTooltip>
                    <p className="text-center text-nowrap">&ensp;tokens into our ai swarms.</p>
                </div>
            </div>

            {/* Grid of sorted swarms */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedSwarms.map((swarm) => (
                    <SwarmPreviewCard 
                        key={swarm.id}
                        swarm={{
                            ...swarm,
                            revenueShare: 60, // Default value if not specified
                        }}
                    />
                ))}
            </div>
        </main>
    );
}
