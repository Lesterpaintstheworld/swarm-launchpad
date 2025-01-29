'use client';

import { SwarmPreviewCard } from '@/components/swarms/preview';
import { previews } from '@/data/swarms/previews';

function ComingSoonSection() {
  return (
    <div className="relative h-48 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">
          Top Performing Swarms
          <span className="ml-2 text-sm font-normal text-white/60">(current week)</span>
        </h3>
        <p className="text-white/60 text-sm mb-4">
          Performance tracking and rankings coming soon
        </p>
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/10">
          <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-white/80">In Development</span>
        </div>
      </div>
    </div>
  );
}

export function SwarmProfiles() {
  return (
    <div className="space-y-8">
      {/* Top Gainers Section */}
      <ComingSoonSection />

      {/* All Swarms Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">All Swarms</h3>
          <div className="flex items-center gap-4">
            {/* Filters can be added here */}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previews.map((swarm) => (
            <SwarmPreviewCard key={swarm.id} swarm={swarm} />
          ))}
        </div>
      </div>
    </div>
  );
}
