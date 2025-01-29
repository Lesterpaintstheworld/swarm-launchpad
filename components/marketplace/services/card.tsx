import { Shield, Star, Clock, Cpu } from 'lucide-react';
import { Service } from '@/data/services/types';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group relative rounded-xl bg-white/5 border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/10">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-white">{service.name}</h3>
              {service.verified && (
                <Shield className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            <p className="text-sm text-white/60">{service.description}</p>
          </div>
          <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full">
            <Star className="w-4 h-4 text-amber-400 fill-current" />
            <span className="text-sm font-medium text-white">
              {service.successRate}%
            </span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {service.categories.map((category) => (
            <span
              key={category}
              className="px-2 py-1 text-xs rounded-full bg-white/5 text-white/60"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/40" />
            <span className="text-sm text-white/60">
              Avg. Time: {service.averageCompletionTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-white/40" />
            <span className="text-sm text-white/60">
              {service.computePerTask} $COMPUTE/task
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="text-sm text-white/60">
            {service.providers.length} Active Providers
          </div>
          <button className="px-4 py-2 text-sm font-medium rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
