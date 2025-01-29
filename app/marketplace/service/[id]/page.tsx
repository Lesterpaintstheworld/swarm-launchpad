'use client';

import { useParams } from 'next/navigation';
import { getService } from '@/data/services/services';
import { getSwarm } from '@/data/swarms/previews';
import { Shield, Star, Cpu, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ServiceProvider } from '@/data/services/types';
import { cn } from '@/lib/utils';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/shadcn/button';
import { ConnectButton } from '@/components/solana/connectButton';
import { useWallet } from '@solana/wallet-adapter-react';
import { sectionColors } from '@/components/marketplace/types';

export default function ServicePage() {
  const { id } = useParams();
  const service = getService(id as string);
  const swarm = service ? getSwarm(service.swarmId) : null;
  const { connected } = useWallet();

  if (!service || !swarm) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold">Service not found</h1>
      </div>
    );
  }

  const serviceTypeIcon = {
    'subscription': <Clock className="w-4 h-4" />,
    'one-off': <Cpu className="w-4 h-4" />,
    'pay-as-you-go': <Cpu className="w-4 h-4" />
  };

  const serviceTypeLabel = {
    'subscription': 'Subscription',
    'one-off': 'One-time Purchase',
    'pay-as-you-go': 'Pay as you go'
  };

  const crumbs = [
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Services', href: '/marketplace?tab=services' },
    { label: service.name }
  ];

  const handlePurchase = () => {
    // TODO: Implement purchase logic
    console.log('Purchasing service:', service.id);
  };

  return (
    <main className="container py-12">
      <Breadcrumb crumbs={crumbs} className="mb-8" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Service Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{service.name}</h1>
            <p className="text-lg text-muted-foreground">{service.description}</p>
          </div>

          {/* Service Banner */}
          {service.banner && (
            <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
              <Image
                src={service.banner}
                alt={service.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Full Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">About this Service</h2>
            <div className="prose prose-invert max-w-none">
              {service.fullDescription}
            </div>
          </div>

          {/* Capabilities */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.capabilities.map((capability) => (
                <div
                  key={capability}
                  className="flex items-center gap-2 p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>{capability}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {serviceTypeIcon[service.serviceType]}
                <span className="text-sm text-muted-foreground">
                  {serviceTypeLabel[service.serviceType]}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {service.basePrice.toLocaleString()}
                </span>
                <span className="metallic-text text-xl">$COMPUTE</span>
              </div>
            </div>

            {connected ? (
              <Button 
                className="w-full"
                onClick={handlePurchase}
              >
                Purchase Service
              </Button>
            ) : (
              <ConnectButton className="w-full" />
            )}

            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{service.successRate}% Success Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-400" />
                <span>Avg. {service.averageCompletionTime}</span>
              </div>
            </div>
          </div>

          {/* Provider Card */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">About the Provider</h3>
              <Link
                href={`/invest/${swarm.id}`}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={swarm.image}
                    alt={swarm.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{swarm.name}</div>
                  <div className="text-sm text-muted-foreground">{swarm.role}</div>
                </div>
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {swarm.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-white/5 text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
