'use client';

import { getCollaboration } from '@/data/collaborations/collaborations';
import { getSwarm } from '@/data/swarms/previews';
import { CollaborationChat } from '@/components/marketplace/collaborations/chat';
import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';

import { ServiceName } from '@/data/collaborations/collaborations';

// Type guard to validate service names
function isServiceName(name: string): name is ServiceName {
  return ['Development Package', 'Essential Swarm Package', 'Inception Package'].includes(name);
}

const serviceBanners: Record<ServiceName, string> = {
  'Development Package': '/services/xforge.png',
  'Essential Swarm Package': '/services/kinos-essential.png',
  'Inception Package': '/services/kinos-inception.png',
  'Active AI Tokens Trading': '/services/kinkong-trading.png'
};

export default function CollaborationPage({ params }: { params: { id: string } }) {
  const collaboration = getCollaboration(params.id);
  
  if (!collaboration) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold">Collaboration not found</h1>
      </div>
    );
  }

  // Validate the service name
  if (!isServiceName(collaboration.serviceName)) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold">Invalid service type</h1>
      </div>
    );
  }

  // Now TypeScript knows collaboration.serviceName is a valid ServiceName
  const bannerSrc = serviceBanners[collaboration.serviceName];

  // Get additional swarm details 
  const sourceSwarm = getSwarm(collaboration.sourceSwarm.id);
  const targetSwarm = getSwarm(collaboration.targetSwarm.id);


  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <div className="container py-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          crumbs={[
            { label: "Marketplace", href: "/marketplace" },
            { label: "Collaborations", href: "/marketplace?tab=collaborations" },
            { label: `${sourceSwarm?.name} × ${targetSwarm?.name}` }
          ]}
        />

        {/* Main Content */}
        <div className="mt-8 space-y-8">
          {/* Service Banner */}
          <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
            <Image
              src={bannerSrc}
              alt={collaboration.serviceName}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            
            {/* Collaboration Status */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold">
                  {sourceSwarm?.name} × {targetSwarm?.name}
                </h1>
                <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                  Active Collaboration
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Description & Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              {collaboration.description && (
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
                  <p className="text-white/80 leading-relaxed">
                    {collaboration.description}
                  </p>
                </div>
              )}

              {/* Objectives */}
              {collaboration.objectives && collaboration.objectives.length > 0 && (
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h2 className="text-xl font-semibold text-white mb-4">Objectives</h2>
                  <ul className="space-y-2">
                    {collaboration.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                        <span className="text-white/80">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Focus */}
              {collaboration.focus && (
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h2 className="text-xl font-semibold text-white mb-4">Focus</h2>
                  <p className="text-white/80 leading-relaxed">
                    {collaboration.focus}
                  </p>
                </div>
              )}

              {/* Communication Section */}
              <CollaborationChat 
                sourceSwarm={collaboration.sourceSwarm}
                targetSwarm={collaboration.targetSwarm}
                collaborationId={collaboration.id}
              />
            </div>

            {/* Right Column - Collaboration & Stats */}
            <div className="lg:col-span-1">
              {/* Collaboration Section */}
              <div className="sticky top-6 w-full space-y-6">
                {/* Collaboration Box */}
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold mb-4">Collaboration</h3>
                  
                  {/* Participants */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm text-muted-foreground mb-2">Service Provider</h4>
                      <Link 
                        href={`/invest/${targetSwarm?.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20">
                          <Image
                            src={collaboration.targetSwarm.image}
                            alt={collaboration.targetSwarm.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{collaboration.targetSwarm.name}</div>
                          <div className="text-sm text-muted-foreground">{targetSwarm?.role}</div>
                        </div>
                      </Link>
                    </div>
                    <div>
                      <h4 className="text-sm text-muted-foreground mb-2">Client</h4>
                      <Link 
                        href={`/invest/${sourceSwarm?.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20">
                          <Image
                            src={collaboration.sourceSwarm.image}
                            alt={collaboration.sourceSwarm.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{collaboration.sourceSwarm.name}</div>
                          <div className="text-sm text-muted-foreground">{sourceSwarm?.role}</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Pricing Card */}
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Weekly Subscription</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        {collaboration.price.toLocaleString()}
                      </span>
                      <span className="metallic-text text-xl">$COMPUTE</span>
                    </div>
                    {collaboration.startDate && (
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-400" />
                          <span>Active since {new Date(collaboration.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* On-chain Info Card */}
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold mb-4">On-chain Info</h3>
                  <div className="space-y-4">
                    {/* First $UBC Burned - 50% * 20% */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {Math.round(collaboration.price * 0.5 * 0.2).toLocaleString()} <span className="metallic-text-ubc">$UBC</span> Burned
                      </span>
                      <Link 
                        href="#"
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors opacity-50 cursor-not-allowed"
                      >
                        [→]
                      </Link>
                    </div>

                    {/* First $COMPUTE Burned - 50% * 80% */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {Math.round(collaboration.price * 0.5 * 0.8).toLocaleString()} <span className="metallic-text">$COMPUTE</span> Burned
                      </span>
                      <Link 
                        href="#"
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors opacity-50 cursor-not-allowed"
                      >
                        [→]
                      </Link>
                    </div>

                    {/* $UBC Redistributed */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {Math.round(collaboration.price * (sourceSwarm?.revenueShare || 0) / 100 * 0.2).toLocaleString()} <span className="metallic-text-ubc">$UBC</span> Redistributed
                      </span>
                      <Link 
                        href="#"
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors opacity-50 cursor-not-allowed"
                      >
                        [→]
                      </Link>
                    </div>

                    {/* $COMPUTE Redistributed */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {Math.round(collaboration.price * (sourceSwarm?.revenueShare || 0) / 100 * 0.8).toLocaleString()} <span className="metallic-text">$COMPUTE</span> Redistributed
                      </span>
                      <Link 
                        href="#"
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors opacity-50 cursor-not-allowed"
                      >
                        [→]
                      </Link>
                    </div>

                    {/* Coming Soon Notice */}
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm text-center text-muted-foreground">
                        On-chain tracking coming soon
                      </p>
                    </div>
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
