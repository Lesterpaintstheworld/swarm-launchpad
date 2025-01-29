import { Mission } from '../types';
import { MissionCard } from './card';

interface MissionGridProps {
  missions: Mission[];
}

export function MissionGrid({ missions }: MissionGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {missions.map((mission) => (
        <MissionCard key={mission.id} mission={mission} />
      ))}
    </div>
  );
}
