'use client';

import Image from 'next/image';
import Link from 'next/link';

const getGradientColors = (sourceId: string) => {
  if (sourceId === 'ecosystem') {
    return {
      from: 'from-yellow-300/20',
      via: 'via-yellow-400/20',
      to: 'to-yellow-500/20',
      hover: {
        from: 'from-yellow-300/40',
        via: 'via-yellow-400/40',
        to: 'to-yellow-500/40'
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
  status: 'active' | 'completed' | 'pending';
  price: number;
}

export function CollaborationCard({ 
  id, 
  providerSwarm, 
  clientSwarm, 
  serviceName, 
  status, 
  price 
}: CollaborationCardProps) {
  const statusStyles = {
    active: 'text-green-400 bg-green-500/10 border-green-500/20',
    completed: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    pending: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
  };

  return (
    <div className="group relative w-full rounded-xl bg-gradient-to-r from-white/5 via-white/[0.07] to-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
      <div className="relative p-4">
        <Link 
          href={`/marketplace/collaboration/${id}`}
          className="absolute inset-0 z-20"
          aria-label="View collaboration details"
        />
        
        <div className="flex items-center justify-between gap-4">
          {/* Client Swarm - Now First */}
          <div className="flex flex-col items-center space-y-2">
            <Link 
              href={`/invest/${providerSwarm.id}`}
              className="group/link"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-xl opacity-0 group-hover/link:opacity-100 blur transition-opacity duration-500" />
                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/20 group-hover/link:border-white/40 transition-colors duration-300">
                  <Image
                    src={providerSwarm.image}
                    alt={providerSwarm.name}
                    fill
                    sizes="(max-width: 56px) 100vw"
                    className="object-cover transition-transform duration-300 group-hover/link:scale-110"
                  />
                </div>
              </div>
            </Link>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-sm font-medium text-white/60">{providerSwarm.name}</span>
              <span className="text-[10px] text-white/40">Client</span>
            </div>
          </div>

          {/* Connection Line with Service Name */}
          <div className="flex-1 mx-2 flex flex-col items-center">
            <div className={`px-3 py-1 rounded-full text-xs border ${statusStyles[status]} backdrop-blur-sm transition-all duration-300 group-hover:scale-110 relative`}>
              <div className="absolute inset-0 bg-white/5 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative">{serviceName}</span>
            </div>
            
            <div className="h-[2px] w-full relative overflow-hidden my-2">
              <div className={`absolute inset-0 bg-gradient-to-r ${getGradientColors(providerSwarm.id).from} ${getGradientColors(providerSwarm.id).via} ${getGradientColors(providerSwarm.id).to} group-hover:${getGradientColors(providerSwarm.id).hover.from} group-hover:${getGradientColors(providerSwarm.id).hover.via} group-hover:${getGradientColors(providerSwarm.id).hover.to} transition-all duration-500`} />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-[50%] animate-[moveLight_3s_linear_infinite] -translate-x-[100%]" />
            </div>

            <span className="text-xs font-medium text-white/90">
              <span className="metallic-text">{price.toLocaleString()} $COMPUTE</span>
            </span>
          </div>

          {/* Provider Swarm - Now Last */}
          <div className="flex flex-col items-center space-y-2">
            <Link 
              href={`/invest/${clientSwarm.id}`}
              className="group/link"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-xl opacity-0 group-hover/link:opacity-100 blur transition-opacity duration-500" />
                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/20 group-hover/link:border-white/40 transition-colors duration-300">
                  <Image
                    src={clientSwarm.image}
                    alt={clientSwarm.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/link:scale-110"
                  />
                </div>
              </div>
            </Link>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-sm font-medium text-white/60">{clientSwarm.name}</span>
              <span className="text-[10px] text-white/40">Provider</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
