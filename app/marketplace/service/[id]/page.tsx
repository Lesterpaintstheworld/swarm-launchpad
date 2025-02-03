'use client';

import { useParams } from 'next/navigation';
import { getService } from '@/data/services/services';
import { Shield, Cpu, Clock } from 'lucide-react';

import { getSwarm } from '@/data/swarms/info';
import { ClientMarkdown } from '@/components/ui/clientMarkdown';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/shadcn/button';
import { ConnectButton } from '@/components/solana/connectButton';
import { useWallet } from '@solana/wallet-adapter-react';

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
    'pay-as-you-go': <Cpu className="w-4 h-4" />,
    'financial': <Cpu className="w-4 h-4" />
  };

  const serviceTypeLabel = {
    'subscription': 'Subscription',
    'one-off': 'One-time Purchase',
    'pay-as-you-go': 'Pay as you go',
    'financial': 'Financial Service'
  };

  const crumbs = [
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Services', href: '/marketplace?tab=services' },
    { label: service.name }
  ];


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
            <div className="prose prose-invert prose-lg max-w-none">
              <ClientMarkdown markdown={service.fullDescription} />
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
                disabled={true}
              >
                Coming Soon
              </Button>
            ) : (
              <ConnectButton className="w-full" />
            )}

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

          {/* Service Stats Card */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-6">
            <h3 className="text-lg font-semibold text-white">Service Stats</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-white/60 mb-1">Completions</div>
                <div className="flex items-center gap-2">
                  <div className="animate-pulse h-4 w-16 bg-white/10 rounded" />
                  <span className="text-xs text-white/40">Coming Soon</span>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-white/60 mb-1">Avg. Rating</div>
                <div className="flex items-center gap-2">
                  <div className="animate-pulse h-4 w-12 bg-white/10 rounded" />
                  <span className="text-xs text-white/40">Coming Soon</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-white/60 mb-1">Response Time</div>
                <div className="flex items-center gap-2">
                  <div className="animate-pulse h-4 w-20 bg-white/10 rounded" />
                  <span className="text-xs text-white/40">Coming Soon</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-white/60 mb-1">Active Users</div>
                <div className="flex items-center gap-2">
                  <div className="animate-pulse h-4 w-14 bg-white/10 rounded" />
                  <span className="text-xs text-white/40">Coming Soon</span>
                </div>
              </div>
            </div>

            {/* Monthly Activity Chart */}
            <div className="pt-4 border-t border-white/10">
              <div className="text-sm text-white/60 mb-3">Monthly Activity</div>
              <div className="h-32 bg-white/5 rounded-lg flex items-center justify-center">
                <span className="text-sm text-white/40">Chart Coming Soon</span>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-white/60">Recent Transactions</div>
                <span className="text-xs text-white/40">Coming Soon</span>
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-3 w-24 bg-white/10 rounded animate-pulse mb-1" />
                      <div className="h-2 w-16 bg-white/10 rounded animate-pulse" />
                    </div>
                    <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="pt-4 border-t border-white/10">
              <div className="text-sm text-white/60 mb-3">Performance Metrics</div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Uptime</span>
                    <span className="text-xs text-white/40">Coming Soon</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-0 bg-gradient-to-r from-blue-500 to-blue-400 animate-pulse" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Task Success Rate</span>
                    <span className="text-xs text-white/40">Coming Soon</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-0 bg-gradient-to-r from-green-500 to-green-400 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
