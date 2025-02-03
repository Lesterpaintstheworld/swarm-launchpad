'use client';

import { CollaborationChat } from '@/components/marketplace/collaborations/chat';
import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { useEffect, useState } from 'react';
import { ServiceName } from '@/data/collaborations/collaborations';

// Function to validate service names
async function isValidServiceName(name: string): Promise<boolean> {
  try {
    const response = await fetch('/api/services');
    if (!response.ok) return false;
    const services = await response.json();
    return services.some((service: any) => service.name === name);
  } catch (error) {
    console.error('Error validating service name:', error);
    return false;
  }
}

const serviceBanners: Record<string, string> = {
  'Development Package': '/services/xforge.png',
  'Essential Swarm Package': '/services/kinos-essential.png',
  'Inception Package': '/services/kinos-inception.png',
  'Active AI Tokens Trading': '/services/kinkong-trading.png'
};

async function getSwarm(id: string) {
  try {
    const response = await fetch(`/api/swarms/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch swarm');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching swarm:', error);
    return null;
  }
}

export default function CollaborationPage({ params }: { params: { id: string } }) {
  interface SwarmData {
    id: string;
    name: string;
    image: string;
    role?: string;
    swarmType?: string;
    revenueShare?: number;
  }

  interface CollaborationData {
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
    status: string;
    price: number;
    startDate?: string;
    description?: string;
    objectives?: string[];
    focus?: string;
  }

  const [providerSwarm, setProviderSwarm] = useState<SwarmData | null>(null);
  const [clientSwarm, setClientSwarm] = useState<SwarmData | null>(null);
  const [collaboration, setCollaboration] = useState<CollaborationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch collaboration
        const collabResponse = await fetch(`/api/collaborations/${params.id}`);
        if (!collabResponse.ok) {
          throw new Error('Failed to fetch collaboration');
        }
        const collabData = await collabResponse.json();
        console.log('Received collaboration:', collabData);
        console.log('Service name:', collabData.serviceName);
        setCollaboration(collabData);

        // Fetch both swarms
        const [provider, client] = await Promise.all([
          getSwarm(collabData.providerSwarm.id),
          getSwarm(collabData.clientSwarm.id)
        ]);
        
        setProviderSwarm(provider);
        setClientSwarm(client);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  if (!collaboration) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold">Collaboration not found</h1>
      </div>
    );
  }

  // Validate the service name
  const isValid = await isValidServiceName(collaboration.serviceName);
  if (!isValid) {
    console.error('Invalid service name:', collaboration.serviceName);
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold">Invalid service type</h1>
        <p className="text-muted-foreground mt-2">
          Received: {collaboration.serviceName}
        </p>
      </div>
    );
  }

  const bannerSrc = serviceBanners[collaboration.serviceName] || '/services/default.png';

  if (!providerSwarm || !clientSwarm) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <div className="container py-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          crumbs={[
            { label: "Marketplace", href: "/marketplace" },
            { label: "Collaborations", href: "/marketplace?tab=collaborations" },
            { label: `${providerSwarm?.name} × ${clientSwarm?.name}` }
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
                  {providerSwarm?.name} × {clientSwarm?.name}
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
                providerSwarm={collaboration.providerSwarm}
                clientSwarm={collaboration.clientSwarm}
                collaborationId={collaboration.id}
                projectSpecs={{
                  specifications: collaboration.specifications,
                  deliverables: collaboration.deliverables,
                  validation: collaboration.validation
                }}
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
                        href={`/invest/${clientSwarm?.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20">
                          <Image
                            src={collaboration.clientSwarm.image}
                            alt={collaboration.clientSwarm.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{collaboration.clientSwarm.name}</div>
                          <div className="text-sm text-muted-foreground">{clientSwarm?.role}</div>
                        </div>
                      </Link>
                    </div>
                    <div>
                      <h4 className="text-sm text-muted-foreground mb-2">Client</h4>
                      <Link 
                        href={`/invest/${providerSwarm?.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20">
                          <Image
                            src={collaboration.providerSwarm.image}
                            alt={collaboration.providerSwarm.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{collaboration.providerSwarm.name}</div>
                          <div className="text-sm text-muted-foreground">{providerSwarm?.role}</div>
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
                        {Math.round(collaboration.price * (providerSwarm?.revenueShare || 0) / 100 * 0.2).toLocaleString()} <span className="metallic-text-ubc">$UBC</span> Redistributed
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
                        {Math.round(collaboration.price * (providerSwarm?.revenueShare || 0) / 100 * 0.8).toLocaleString()} <span className="metallic-text">$COMPUTE</span> Redistributed
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
