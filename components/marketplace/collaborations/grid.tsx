import { CollaborationCard } from './card';

function validateStatus(status: string): 'active' | 'completed' | 'pending' {
  switch (status.toLowerCase()) {
    case 'active':
      return 'active';
    case 'completed':
      return 'completed';
    case 'pending':
      return 'pending';
    default:
      return 'pending'; // Default fallback status
  }
}

interface Collaboration {
  id: string;
  providerSwarm: {
    id: string;
    name: string;
    image: string;
  };
  clientSwarm: {
    id: string;
    name: string;
    image: string;
  };
  serviceName: string;
  status: string;
  price: number;
}

interface CollaborationGridProps {
  collaborations: Collaboration[];
}

export function CollaborationGrid({ collaborations }: CollaborationGridProps) {
  // Sort collaborations by price in descending order
  const sortedCollaborations = [...collaborations].sort((a, b) => b.price - a.price);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sortedCollaborations.map((collaboration) => (
        <CollaborationCard
          key={collaboration.id}
          id={collaboration.id}
          providerSwarm={collaboration.providerSwarm}
          clientSwarm={collaboration.clientSwarm}
          serviceName={collaboration.serviceName}
          status={validateStatus(collaboration.status)}
          price={collaboration.price}
        />
      ))}
    </div>
  );
}
