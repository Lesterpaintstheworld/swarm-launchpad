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
'use client';

import { getService } from '@/data/services/services';
import { getSwarm } from '@/data/swarms/previews';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Cpu, Clock } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { ConnectButton } from '@/components/solana/connectButton';
import { useWallet } from '@solana/wallet-adapter-react';
import { sectionColors } from '@/components/marketplace/types';

export default function ServiceDetailsPage({ params }: { params: { id: string } }) {
  const service = getService(params.id);
  const { connected } = useWallet();

  if (!service) {
    notFound();
  }

  const swarm = getSwarm(service.swarmId);
  const crumbs = [
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Services', href: '/marketplace?tab=services' },
    { label: service.name }
  ];

  const serviceTypeLabel = {
    'subscription': 'Weekly Subscription',
    'one-off': 'One-time Purchase',
    'pay-as-you-go': 'Pay as you go'
  };

  const handlePurchase = () => {
    // TODO: Implement purchase logic
    console.log('Purchasing service:', service.id);
  };

  return (
    <main className="container py-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb crumbs={crumbs} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Banner & Header */}
          <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            {service.banner && (
              <div className="relative h-[200px]">
                <Image
                  src={service.banner}
                  alt={service.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">{service.name}</h1>
                  <p className="text-lg text-white/60 mt-4">{service.fullDescription}</p>
                </div>
                {service.verified && (
                  <div className={`px-3 py-1 h-fit rounded-full ${sectionColors.services.accent} border ${sectionColors.services.border}`}>
                    <span className={`text-sm font-medium ${sectionColors.services.text}`}>
                      Verified
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Service Capabilities</h2>
            <div className="grid grid-cols-2 gap-4">
              {service.capabilities.map((capability) => (
                <div 
                  key={capability}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                >
                  <div className={`w-2 h-2 rounded-full ${sectionColors.services.text}`} />
                  <span className="text-white/80">{capability}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Provider Information */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">About the Provider</h2>
            {swarm && (
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={swarm.image}
                    alt={swarm.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-medium">{swarm.name}</h3>
                  <p className="text-white/60 text-sm">{swarm.role}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Service Purchase Card */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-6 sticky top-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Service Price</h2>
                <div className="flex items-baseline gap-2">
                  <Cpu className="w-5 h-5 text-white/40" />
                  <span className="text-3xl font-bold text-white">
                    {service.computePerTask.toLocaleString()}
                  </span>
                  <span className="metallic-text text-xl font-semibold">
                    $COMPUTE
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Service Type</span>
                  <div className="flex items-center gap-2">
                    {service.serviceType === 'subscription' ? <Clock className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
                    <span className="text-white">{serviceTypeLabel[service.serviceType]}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Average Completion</span>
                  <span className="text-white">{service.averageCompletionTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Success Rate</span>
                  <span className="text-white">{service.successRate}%</span>
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

              <p className="text-xs text-white/40 text-center">
                By purchasing this service, you agree to the terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
'use client';

import { useParams } from 'next/navigation';
import { getService as getServiceData } from '@/data/services/services';
import { getSwarm } from '@/data/swarms/previews';
import { Shield, Star, Cpu, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ServiceProvider } from '@/data/services/types';
import { cn } from '@/lib/utils';

export default function ServicePage() {
  const { id } = useParams();
  const service = getServiceData(id as string);
  const swarm = service ? getSwarm(service.swarmId) : null;

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

  return (
    <main className="container py-12">
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

            <button className="w-full px-6 py-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Purchase Service
            </button>

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
