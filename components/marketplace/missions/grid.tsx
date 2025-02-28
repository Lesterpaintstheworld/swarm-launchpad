import { Mission } from '../types';
import { MissionCard } from './card';

interface MissionGridProps {
  missions: Mission[];
  className?: string;
}

export function MissionGrid({ missions, className = '' }: MissionGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ${className}`}>
      {missions.map((mission) => (
        <MissionCard key={mission.id} mission={mission} />
      ))}
    </div>
  );
}
