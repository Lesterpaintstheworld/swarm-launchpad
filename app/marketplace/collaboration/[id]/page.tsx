'use client';

import { useParams } from 'next/navigation';
import { getCollaboration } from '@/data/collaborations/collaborations';
import { getService } from '@/data/services/services';
import { getSwarm } from '@/data/swarms/previews';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Cpu } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function CollaborationPage() {
  const { id } = useParams();
  const collaboration = getCollaboration(id as string);
  
  if (!collaboration) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold">Collaboration not found</h1>
      </div>
    );
  }

  // Get the service details
  const service = getService(
    collaboration.serviceName === 'Development Package' ? 'xforge-development-package' :
    collaboration.serviceName === 'Essential Swarm Package' ? 'kinos-essential-package' :
    'kinos-inception-package'
  );

  // Get additional swarm details
  const sourceSwarm = getSwarm(collaboration.sourceSwarm.id);
  const targetSwarm = getSwarm(collaboration.targetSwarm.id);

  const serviceBanners = {
    'Development Package': '/services/xforge.png',
    'Essential Swarm Package': '/services/kinos-essential.png',
    'Inception Package': '/services/kinos-inception.png'
  };

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
              src={serviceBanners[collaboration.serviceName]}
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

          {/* Service Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Service Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h2 className="text-2xl font-semibold mb-4">{collaboration.serviceName}</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  {service?.description}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {service?.capabilities.map((capability) => (
                    <div
                      key={capability}
                      className="flex items-center gap-2 p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <Cpu className="w-4 h-4 text-blue-400" />
                      <span>{capability}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collaboration Details */}
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-xl font-semibold mb-4">Collaboration Details</h3>
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
            </div>

            {/* Right Column - Pricing & Stats */}
            <div className="space-y-6">
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
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-400" />
                      <span>Active since Jan 2024</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Service Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="text-green-400">{service?.successRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Avg. Response Time</span>
                    <span>{service?.averageCompletionTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Tasks</span>
                    <span>{service?.providers[0].completedTasks.toLocaleString()}</span>
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
