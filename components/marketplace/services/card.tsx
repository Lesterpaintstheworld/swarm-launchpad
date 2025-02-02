import { Cpu, Clock } from 'lucide-react';
import Link from 'next/link';
import { Service } from '@/data/services/types';
import { getSwarm } from '@/data/swarms/previews';
import Image from 'next/image';
import { sectionColors } from '../types';

const getCardStyles = (serviceType: string) => {
  if (serviceType === 'financial') {
    return {
      border: 'border-yellow-500/30',
      hover: 'hover:border-yellow-500/50',
      gradient: 'from-yellow-500/10 via-yellow-400/5 to-yellow-600/10'
    };
  }
  return {
    border: sectionColors.services.border,
    hover: sectionColors.services.hover,
    gradient: sectionColors.services.primary
  };
};

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const swarm = getSwarm(service.swarmId);
  const styles = getCardStyles(service.serviceType);

  const serviceTypeIcon = {
    'subscription': <Clock className="w-4 h-4 text-white/40" />,
    'one-off': <Cpu className="w-4 h-4 text-white/40" />,
    'pay-as-you-go': <Cpu className="w-4 h-4 text-white/40" />,
    'financial': <Cpu className="w-4 h-4 text-yellow-400/60" />
  };

  const serviceTypeLabel = {
    'subscription': 'Subscription',
    'one-off': 'One-time Purchase',
    'pay-as-you-go': 'Pay as you go',
    'financial': 'Financial Service'
  };

    console.log('Service:', service); // Debug log
    
    return (
      <div className={`group relative rounded-xl bg-white/5 border ${styles.border} overflow-hidden transition-all duration-300 ${styles.hover}`}>
      {/* Banner image and swarm attribution */}
      {service.banner && (
        <div className="relative">
          {/* Banner */}
          <div className="relative w-full h-[120px]">
            <Image
              src={service.banner}
              alt={service.name}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          
          {/* Swarm attribution with overlapping logo */}
          {swarm && (
            <div className="absolute -bottom-8 left-6 flex items-center gap-3">
              <Link 
                href={`/invest/${swarm.id}`}
                className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-blue-400/30 hover:border-blue-400/50 transition-colors shadow-lg shadow-black/20"
              >
                <Image
                  src={swarm.image}
                  alt={swarm.name}
                  fill
                  className="object-cover"
                />
                {/* Glowing edge effect */}
                <div className="absolute inset-0 ring-2 ring-blue-400/20 rounded-xl" />
              </Link>
              <Link 
                href={`/invest/${swarm.id}`}
                className="text-sm text-blue-300/90 hover:text-blue-300 transition-colors"
              >
                by <span className="font-medium">{swarm.name}</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
      
      <div className="relative p-6 pt-12 space-y-4">
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
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white/80">
                {serviceTypeLabel[service.serviceType]}
              </span>
              {(service.activeSubscriptions && service.activeSubscriptions > 0) && (
                <span className="text-xs text-white/60">
                  {service.activeSubscriptions} active subscriptions
                </span>
              )}
            </div>
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

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-white/5">
          <Link 
            href={`/marketplace/service/${service.id}`}
            className="w-full px-4 py-2 text-sm font-semibold rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors text-blue-400 hover:text-blue-300 text-center"
          >
            View Offer
          </Link>
        </div>
      </div>
    </div>
  );
}
