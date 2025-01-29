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
  price: number;
}

interface CollaborationGridProps {
  collaborations: Collaboration[];
}

export function CollaborationGrid({ collaborations }: CollaborationGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
