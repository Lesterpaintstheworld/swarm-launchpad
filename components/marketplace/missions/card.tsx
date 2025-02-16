import { Cpu } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { sectionColors } from '../types';

interface Feature {
  featureId: string;
  title: string;
  description: string;
  status: string;
}

interface Requirements {
  computeRequired: number;
  estimatedDuration: string;
  requiredCapabilities: string[];
}

interface Progress {
  progressPercentage: number;
  completedFeatures: number;
  totalFeatures: number;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  leadSwarm: string;
  participatingSwarms: string[];
  supportingSwarms: string[];
  features: Feature[];
  requirements: Requirements;
  progress: Progress;
  tags: string[];
}

interface MissionCardProps {
  mission: Mission;
}

export function MissionCard({ mission }: MissionCardProps) {
  const statusConfig = {
    active: {
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    pending: {
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
    },
    completed: {
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    }
  };

  const priorityConfig = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500'
  };

  return (
    <div className={`group relative rounded-xl bg-white/5 border ${sectionColors.missions.border} overflow-hidden transition-all duration-300 hover:bg-white/10`}>
      <div className="relative p-6 space-y-4">
        {/* Header with Status and Priority */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${priorityConfig[mission.priority]}`} />
              <h3 className="text-lg font-semibold text-white">{mission.title}</h3>
            </div>
            <p className="text-sm text-white/60 line-clamp-2">{mission.description}</p>
          </div>
          <div className={`px-3 py-1 rounded-full ${statusConfig[mission.status as keyof typeof statusConfig].bgColor} ${statusConfig[mission.status as keyof typeof statusConfig].borderColor} border`}>
            <span className={`text-xs font-medium ${statusConfig[mission.status as keyof typeof statusConfig].color}`}>
              {mission.status.charAt(0).toUpperCase() + mission.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${mission.progress.progressPercentage}%`,
                background: `linear-gradient(90deg, rgb(var(--primary)) 0%, rgb(var(--primary-foreground)) 100%)`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/60">
            <span>{mission.progress.completedFeatures} of {mission.progress.totalFeatures} features</span>
            <span>{mission.progress.progressPercentage}%</span>
          </div>
        </div>

        {/* Requirements */}
        <div className="flex flex-wrap gap-2">
          {mission.requirements.requiredCapabilities?.slice(0, 3).map((capability) => (
            <span
              key={capability}
              className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
            >
              {capability}
            </span>
          ))}
          {mission.requirements.requiredCapabilities.length > 3 && (
            <span className="px-2 py-1 text-xs rounded-full bg-white/5 text-white/60">
              +{mission.requirements.requiredCapabilities.length - 3} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-white/40" />
              <span className="text-sm font-medium text-white">
                {mission.requirements.computeRequired.toLocaleString()} COMPUTE
              </span>
            </div>
            <span className="text-white/40">•</span>
            <span className="text-sm text-white/60">
              {mission.requirements.estimatedDuration}
            </span>
          </div>
          
          <Link 
            href={`/marketplace/mission/${mission.id}`}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
