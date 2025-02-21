'use client';

import { SwarmData } from '../types';

interface GraphTooltipProps {
    swarm: SwarmData;
    previewData: SwarmData;
}

export function GraphTooltip({ swarm, previewData }: GraphTooltipProps) {
    const multiple = swarm.multiple || 1;
    const revenueShare = swarm.revenueShare || 60;

    return (
        <div className="space-y-1.5">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-white/90">{swarm.name}</h3>
                <span className="px-1.5 py-0.5 rounded-full bg-white/5 text-[10px] text-white/40">
                    {swarm.swarmType}
                </span>
            </div>
            <p className="text-xs text-white/50 line-clamp-2">{previewData.description}</p>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
                <div>
                    <div className="text-[10px] text-white/30">Multiple</div>
                    <div className="text-xs font-medium text-white/80">{multiple}x</div>
                </div>
                <div>
                    <div className="text-[10px] text-white/30">Revenue Share</div>
                    <div className="text-xs font-medium text-white/80">{revenueShare}%</div>
                </div>
            </div>
        </div>
    );
}
