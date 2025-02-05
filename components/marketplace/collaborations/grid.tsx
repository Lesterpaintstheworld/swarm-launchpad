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
  // Define status priority order (active first, then others)
  const statusOrder: Record<string, number> = {
    'active': 0,
    'pending': 1,
    'completed': 2,
    'paused': 3
  };

  // Sort collaborations by status first, then by price
  const sortedCollaborations = [...collaborations].sort((a, b) => {
    // First compare by status
    const statusA = statusOrder[a.status.toLowerCase()] ?? 999; // Default high number for unknown status
    const statusB = statusOrder[b.status.toLowerCase()] ?? 999;
    if (statusA !== statusB) {
      return statusA - statusB;
    }
    // If status is the same, sort by price (descending)
    return b.price - a.price;
  });

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
