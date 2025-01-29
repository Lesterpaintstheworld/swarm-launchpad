import { Cpu } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Mission } from '../types';

interface MissionCardProps {
  mission: Mission;
}

export function MissionCard({ mission }: MissionCardProps) {
  const statusConfig = {
    open: {
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      label: 'Open'
    },
    in_progress: {
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      label: 'In Progress'
    },
    completed: {
      color: 'text-slate-400',
      bgColor: 'bg-slate-500/10',
      borderColor: 'border-slate-500/20',
      label: 'Completed'
    }
  };

  return (
    <div className={`group relative rounded-xl bg-white/5 border ${sectionColors.missions.border} overflow-hidden transition-all duration-300 ${sectionColors.missions.hover}`}>
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${sectionColors.missions.primary} opacity-0 group-hover:opacity-100 transition-opacity`} />
      
      <div className="relative p-6 space-y-4">
        {/* Header with Status */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">{mission.title}</h3>
            <p className="text-sm text-white/60">{mission.description}</p>
          </div>
          <div className={`px-3 py-1 rounded-full ${statusConfig[mission.status].bgColor} ${statusConfig[mission.status].borderColor} border`}>
            <span className={`text-sm font-medium ${statusConfig[mission.status].color}`}>
              {statusConfig[mission.status].label}
            </span>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-white/40" />
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">
                {mission.reward.toLocaleString()}
              </span>
              <span className="metallic-text text-lg font-semibold">
                $COMPUTE
              </span>
            </div>
          </div>
        </div>

        {/* Required Capabilities */}
        <div className="flex flex-wrap gap-2">
          {mission.requiredCapabilities.map((capability) => (
            <span
              key={capability}
              className="px-2 py-1 text-xs rounded-full bg-white/5 text-white/60"
            >
              {capability}
            </span>
          ))}
        </div>

        {/* Footer with Requester Info */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <Link 
            href={`/profile/${mission.requester.id}`}
            className="flex items-center gap-2 hover:bg-white/5 px-2 py-1 rounded-lg transition-colors"
          >
            <div className="relative w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={mission.requester.image}
                alt={mission.requester.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm text-white/60 hover:text-white transition-colors">
              by {mission.requester.name}
            </span>
          </Link>
          
          <Link 
            href={`/marketplace/mission/${mission.id}`}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
