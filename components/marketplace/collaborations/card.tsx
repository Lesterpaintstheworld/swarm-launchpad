import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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

  // Map service names to their banner images
  const serviceBanners = {
    'Development Package': '/services/xforge.png',
    'Essential Swarm Package': '/services/kinos-essential.png',
    'Inception Package': '/services/kinos-inception.png'
  };

  return (
    <div className="group relative w-full rounded-xl bg-gradient-to-r from-white/5 via-white/[0.07] to-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
      {/* Service Banner Background */}
      {serviceBanners[serviceName] && (
        <div className="absolute inset-0 z-0">
          <Image
            src={serviceBanners[serviceName]}
            alt={serviceName}
            fill
            className="object-cover opacity-[0.05]"
          />
        </div>
      )}
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
      
      {/* Glow effect */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
      
      <div className="relative p-4">
        <Link 
          href={`/marketplace/collaboration/${id}`}
          className="absolute inset-0 z-20"
          aria-label="View collaboration details"
        />
        <div className="flex items-center justify-between gap-4">
          {/* Provider Swarm (now on left) */}
          <Link 
            href={`/invest/${targetSwarm.id}`}
            className="flex items-center gap-3 min-w-[160px] hover:bg-white/5 p-2 rounded-xl transition-all duration-300 group/link"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-full opacity-0 group-hover/link:opacity-100 blur transition-opacity duration-500" />
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 group-hover/link:border-white/40 transition-colors duration-300">
                <Image
                  src={targetSwarm.image}
                  alt={targetSwarm.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover/link:scale-110"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm text-white group-hover/link:text-pink-200 transition-colors duration-300">
                {targetSwarm.name}
              </span>
              <span className="text-xs text-white/40">Provider</span>
            </div>
          </Link>

          {/* Connection Line with Service Details */}
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            {/* Service Name Above */}
            <div className={`px-3 py-1 rounded-full text-xs border ${statusStyles[status]} backdrop-blur-sm transition-all duration-300 group-hover:scale-110 relative`}>
              <div className="absolute inset-0 bg-white/5 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative">{serviceName}</span>
            </div>
            
            {/* Single Line with Animation */}
            <div className="h-[2px] w-full relative overflow-hidden">
              {/* Base line */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 group-hover:from-pink-500/40 group-hover:via-purple-500/40 group-hover:to-blue-500/40 transition-all duration-500" />
              
              {/* Continuous animated light effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-[50%] animate-[moveLight_3s_linear_infinite] -translate-x-[100%]" />
            </div>

            {/* Price Below */}
            <div className="mt-1 font-bold text-white/90">
              <span className="metallic-text text-sm">{price.toLocaleString()} $COMPUTE</span>
            </div>
          </div>

          {/* Client Swarm (now on right) */}
          <Link 
            href={`/invest/${sourceSwarm.id}`}
            className="flex items-center gap-4 min-w-[200px] hover:bg-white/5 p-3 rounded-xl transition-all duration-300 group/link"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-full opacity-0 group-hover/link:opacity-100 blur transition-opacity duration-500" />
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20 group-hover/link:border-white/40 transition-colors duration-300">
                <Image
                  src={sourceSwarm.image}
                  alt={sourceSwarm.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover/link:scale-110"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-white group-hover/link:text-blue-200 transition-colors duration-300">
                {sourceSwarm.name}
              </span>
              <span className="text-sm text-white/40">Client</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
