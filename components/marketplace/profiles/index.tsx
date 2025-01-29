import { SwarmPreviewGrid } from '@/components/swarms/previewGrid';
import { SwarmTopGainers } from '@/components/swarms/topGainers';
import { previews } from '@/data/swarms/previews';

export function SwarmProfiles() {
  return (
    <div className="space-y-8">
      {/* Top Gainers Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Top Performing Swarms</h3>
        <SwarmTopGainers 
          swarms={previews.slice(0, 3)} 
          className="bg-white/5 border border-white/10 rounded-xl p-6"
        />
      </div>

      {/* All Swarms Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">All Swarms</h3>
          <div className="flex items-center gap-4">
            {/* You can add filters here if needed */}
          </div>
        </div>
        <SwarmPreviewGrid />
      </div>
    </div>
  );
}
