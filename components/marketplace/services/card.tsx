import { Cpu, Clock } from 'lucide-react';
import Link from 'next/link';
import { Service } from '@/data/services/types';
import { getSwarm } from '@/data/swarms/previews';
import Image from 'next/image';
import { sectionColors } from '../types';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const swarm = getSwarm(service.swarmId);

  const serviceTypeIcon = {
    'subscription': <Clock className="w-4 h-4 text-white/40" />,
    'one-off': <Cpu className="w-4 h-4 text-white/40" />,
    'pay-as-you-go': <Cpu className="w-4 h-4 text-white/40" />
  };

  const serviceTypeLabel = {
    'subscription': 'Subscription',
    'one-off': 'One-time Purchase',
    'pay-as-you-go': 'Pay as you go'
  };

  return (
    <div className={`group relative rounded-xl bg-white/5 border ${sectionColors.services.border} overflow-hidden transition-all duration-300 ${sectionColors.services.hover}`}>
      {/* Banner image */}
      {service.banner && (
        <div className="relative w-full h-[120px]">
          <Image
            src={service.banner}
            alt={service.name}
            fill
            className="object-cover"
            priority
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${sectionColors.services.primary} opacity-0 group-hover:opacity-100 transition-opacity`} />
      
      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{service.name}</h3>
          <p className="text-sm text-white/60">{service.description}</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {service.categories.map((category) => (
            <span
              key={category}
              className="px-2 py-1 text-xs rounded-full bg-white/5 text-white/60"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            {serviceTypeIcon[service.serviceType]}
            <span className="text-sm font-medium text-white/80">
              {serviceTypeLabel[service.serviceType]}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-white/80">
              {service.computePerTask.toLocaleString()}
            </span>
            <span className="metallic-text text-sm font-medium">
              $COMPUTE
            </span>
          </div>
        </div>

        {/* Footer with Swarm Info */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            {swarm && (
              <Link 
                href={`/invest/${swarm.id}`} 
                className="flex items-center gap-2 hover:bg-white/5 px-2 py-1 rounded-lg transition-colors"
              >
                <div className="relative w-6 h-6 rounded-full overflow-hidden">
                  <Image
                    src={swarm.image}
                    alt={swarm.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm text-white/60 hover:text-white transition-colors">
                  by {swarm.name}
                </span>
              </Link>
            )}
          </div>
          <Link 
            href={`/marketplace/service/${service.id}`}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
