import Image from 'next/image';
import Link from 'next/link';

const getGradientColors = (sourceId: string) => {
  if (sourceId === 'ecosystem') {
    return {
      from: 'from-yellow-300/30',  // Brighter yellow
      via: 'via-yellow-400/30',    // Mid yellow
      to: 'to-yellow-500/30',      // Deeper yellow
      hover: {
        from: 'from-yellow-300/50',
        via: 'via-yellow-400/50',
        to: 'to-yellow-500/50'
      }
    };
  }
  return {
    from: 'from-pink-500/20',
    via: 'via-purple-500/20',
    to: 'to-blue-500/20',
    hover: {
      from: 'from-pink-500/40',
      via: 'via-purple-500/40',
      to: 'to-blue-500/40'
    }
  };
};

interface CollaborationCardProps {
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

export function CollaborationCard({ id, sourceSwarm, targetSwarm, serviceName, status, price }: CollaborationCardProps) {
  const statusStyles = {
    active: 'text-green-400 bg-green-500/10 border-green-500/20',
    completed: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    pending: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
  };

  return (
    <div className="group relative w-full rounded-xl bg-gradient-to-r from-white/5 via-white/[0.07] to-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
      <div className="relative p-5">
        <Link 
          href={`/marketplace/collaboration/${id}`}
          className="absolute inset-0 z-20"
          aria-label="View collaboration details"
        />
        
        {/* Service Provider */}
        <div className="flex items-center gap-4 mb-4">
          {/* Provider Swarm */}
          <div className="flex flex-col items-center gap-3">
            <Link 
              href={`/invest/${targetSwarm.id}`}
              className="group/link"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-xl opacity-0 group-hover/link:opacity-100 blur transition-opacity duration-500" />
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/20 group-hover/link:border-white/40 transition-colors duration-300">
                  <Image
                    src={targetSwarm.image}
                    alt={targetSwarm.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/link:scale-110"
                  />
                </div>
              </div>
              <span className="mt-2 block text-sm text-center font-medium text-white/60 group-hover/link:text-pink-200 transition-colors duration-300">
                {targetSwarm.name}
              </span>
            </Link>
            <span className="text-xs text-white/40">Provider</span>
          </div>

          {/* Connection Line with Service Details */}
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className={`px-4 py-1.5 rounded-full text-xs border ${statusStyles[status]} backdrop-blur-sm transition-all duration-300 group-hover:scale-110 relative`}>
              <div className="absolute inset-0 bg-white/5 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative">{serviceName}</span>
            </div>
            
            <div className="h-[2px] w-full relative overflow-hidden my-1">
              <div className={`absolute inset-0 bg-gradient-to-r ${getGradientColors(sourceSwarm.id).from} ${getGradientColors(sourceSwarm.id).via} ${getGradientColors(sourceSwarm.id).to} group-hover:${getGradientColors(sourceSwarm.id).hover.from} group-hover:${getGradientColors(sourceSwarm.id).hover.via} group-hover:${getGradientColors(sourceSwarm.id).hover.to} transition-all duration-500`} />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-[50%] animate-[moveLight_3s_linear_infinite] -translate-x-[100%]" />
            </div>

            <div className="mt-1 font-bold text-white/90">
              <span className="metallic-text text-sm">{price.toLocaleString()} $COMPUTE</span>
            </div>
          </div>

          {/* Client Swarm */}
          <div className="flex flex-col items-center gap-3">
            <Link 
              href={`/invest/${sourceSwarm.id}`}
              className="group/link"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-xl opacity-0 group-hover/link:opacity-100 blur transition-opacity duration-500" />
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/20 group-hover/link:border-white/40 transition-colors duration-300">
                  <Image
                    src={sourceSwarm.image}
                    alt={sourceSwarm.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/link:scale-110"
                  />
                </div>
              </div>
              <span className="mt-2 block text-sm text-center font-medium text-white/60 group-hover/link:text-blue-200 transition-colors duration-300">
                {sourceSwarm.name}
              </span>
            </Link>
            <span className="text-xs text-white/40">Client</span>
          </div>
        </div>
      </div>
    </div>
  );
}
