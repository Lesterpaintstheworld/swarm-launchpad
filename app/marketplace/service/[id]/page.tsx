'use client';

import { useParams } from 'next/navigation';
import { getService } from '@/data/services/services';
import { getSwarm } from '@/data/swarms/previews';
import { Shield, Star, Cpu, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function ServicePage() {
  const { id } = useParams();
  const service = getService(id as string);
  const swarm = service ? getSwarm(service.swarmId) : null;

  if (!service || !swarm) {
    return <div>Service not found</div>;
  }

  const serviceTypeIcon = {
    'subscription': <Clock className="w-5 h-5 text-white/60" />,
    'one-off': <Star className="w-5 h-5 text-white/60" />,
    'pay-as-you-go': <Cpu className="w-5 h-5 text-white/60" />
  };

  const serviceTypeLabel = {
    'subscription': 'Subscription Service',
    'one-off': 'One-time Purchase',
    'pay-as-you-go': 'Pay as you go'
  };

  const crumbs = [
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Services', href: '/marketplace?tab=services' },
    { label: service.name }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <div className="container py-8">
        {/* Breadcrumb */}
        <Breadcrumb crumbs={crumbs} className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{service.name}</h1>
                {service.verified && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-emerald-400">Verified</span>
                  </div>
                )}
              </div>
              <p className="text-lg text-white/60">{service.description}</p>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {service.categories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1.5 text-sm rounded-full bg-white/5 text-white/80 border border-white/10"
                >
                  {category}
                </span>
              ))}
            </div>

            {/* Capabilities Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Capabilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.capabilities.map((capability) => (
                  <div
                    key={capability}
                    className="p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <span className="text-white/80">{capability}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {serviceTypeIcon[service.serviceType]}
                  <span className="text-sm font-medium text-white/80">
                    {serviceTypeLabel[service.serviceType]}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="text-sm font-medium text-white">
                    {service.successRate}% Success Rate
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-white/60">Price</div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {service.basePrice.toLocaleString()}
                  </span>
                  <span className="metallic-text text-xl font-bold">
                    $COMPUTE
                  </span>
                </div>
              </div>

              <button className="w-full px-6 py-3 text-base font-semibold rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white">
                Purchase Service
              </button>
            </div>

            {/* Provider Card */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-lg font-semibold">Service Provider</h3>
              <Link 
                href={`/invest/${swarm.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
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
                  <div className="text-sm text-white/60">{swarm.role}</div>
                </div>
              </Link>
            </div>

            {/* Stats Card */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-lg font-semibold">Service Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="text-sm text-white/60">Avg. Completion</div>
                  <div className="font-medium">{service.averageCompletionTime}</div>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="text-sm text-white/60">Tasks Completed</div>
                  <div className="font-medium">
                    {service.providers[0].completedTasks.toLocaleString()}
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
