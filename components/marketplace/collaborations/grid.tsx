import { CollaborationCard } from './card';

interface Collaboration {
  id: string;
  sourceSwarm: {
    id: string;
    name: string;
    image: string;
  };
  targetSwarm: {
    id: string;
    name: string;
    image: string;
  };
  serviceName: string;
  status: 'active' | 'completed' | 'pending';
}

interface CollaborationGridProps {
  collaborations: Collaboration[];
}

export function CollaborationGrid({ collaborations }: CollaborationGridProps) {
  return (
    <div className="space-y-4">
      {collaborations.map((collaboration) => (
        <CollaborationCard
          key={collaboration.id}
          id={collaboration.id}
          sourceSwarm={collaboration.sourceSwarm}
          targetSwarm={collaboration.targetSwarm}
          serviceName={collaboration.serviceName}
          status={collaboration.status}
          price={collaboration.price}
        />
      ))}
    </div>
  );
}
