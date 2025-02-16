'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CollaborationGrid } from '@/components/marketplace/collaborations/grid';

type ValidServiceType = 'subscription' | 'one-off' | 'pay-as-you-go' | 'financial';

function validateServiceType(type: string): ValidServiceType {
  switch (type) {
    case 'subscription':
      return 'subscription';
    case 'one-off':
      return 'one-off';
    case 'pay-as-you-go':
      return 'pay-as-you-go';
    case 'financial':
      return 'financial';
    default:
      return 'one-off'; // Default fallback
  }
}

function validateCollaborationStatus(status: string): 'active' | 'completed' | 'pending' {
  switch (status.toLowerCase()) {
    case 'active':
      return 'active';
    case 'completed':
      return 'completed';
    case 'pending':
      return 'pending';
    default:
      return 'pending'; // Default fallback status
  }
}
import { CollaborationGraph } from '@/components/marketplace/collaborations/graph';
import { MarketplaceNavigation } from '@/components/marketplace/navigation';
import { MarketplaceSearch } from '@/components/marketplace/search';
import { MarketplaceTab, SortOption } from '@/components/marketplace/types';
import { ServiceGrid } from '@/components/marketplace/services/grid';
import { MissionGrid } from '@/components/marketplace/missions/grid';
import { SwarmProfiles } from '@/components/marketplace/profiles';
import { CollaborationResponse, Mission, ServiceResponse } from '@/types/api';

function MarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialTab = (searchParams.get('tab') as MarketplaceTab) || 'services';
  const [activeTab, setActiveTab] = useState<MarketplaceTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortOption, setSortOption] = useState<SortOption>(searchParams.get('sort') as SortOption || 'relevance');
  const [collaborationView, setCollaborationView] = useState<'list' | 'graph'>(searchParams.get('view') as 'list' | 'graph' || 'list');
  
  // State for marketplace data
  const [collaborations, setCollaborations] = useState<CollaborationResponse[]>([]);
  const [services, setServices] = useState<Array<ServiceResponse & { serviceType: ValidServiceType }>>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch marketplace data
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [collabResponse, servicesResponse, missionsResponse] = await Promise.all([
          fetch('/api/collaborations'),
          fetch('/api/services'),
          fetch('/api/missions')
        ]);

        if (!collabResponse.ok || !servicesResponse.ok || !missionsResponse.ok) {
          throw new Error('Failed to fetch marketplace data');
        }

        const [collabData, servicesData, missionsData] = await Promise.all([
          collabResponse.json(),
          servicesResponse.json(),
          missionsResponse.json()
        ]);

        console.log('Fetched services data:', servicesData);
        console.log('Fetched missions data:', missionsData);

        setCollaborations(collabData);
        setServices(servicesData.map((service: ServiceResponse) => {
          const mappedService = {
            ...service,
            serviceType: validateServiceType(service.serviceType || 'one-off')
          };
          console.log('Mapped service:', mappedService);
          return mappedService;
        }));
        setMissions(missionsData);
      } catch (error) {
        console.error('Error fetching marketplace data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    
    if (activeTab !== 'services') {
      params.set('tab', activeTab);
    }
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    if (sortOption !== 'relevance') {
      params.set('sort', sortOption);
    }
    if (activeTab === 'collaborations' && collaborationView !== 'list') {
      params.set('view', collaborationView);
    }

    const newUrl = params.toString() 
      ? `/marketplace?${params.toString()}` 
      : '/marketplace';
    router.replace(newUrl);
  }, [activeTab, searchQuery, sortOption, collaborationView, router]);

  return (
    <div className="container py-8">
      <div className="space-y-6">
        {/* Navigation with Glassmorphism */}
        <div className="p-1 rounded-xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/10 shadow-2xl">
          <MarketplaceNavigation 
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              if (tab !== 'collaborations') {
                setCollaborationView('list');
              }
            }}
          />
        </div>
        
        {/* Search Section with Floating Effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-xl blur" />
          <div className="relative">
            <MarketplaceSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortOption={sortOption}
              onSortChange={setSortOption}
            />
          </div>
        </div>

        {/* Content Section with Dynamic Background */}
        <div className="relative min-h-[600px] rounded-xl border border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl" />
          <div className="relative p-6">
            <div className="animate-fade-in">
              {activeTab === 'services' && (
                <div className="space-y-12">
                  {/* Regular Services */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-white">Swarm Services</h2>
                      <div className="text-sm text-white/60">
                        {services?.filter(s => s.serviceType !== 'financial').length || 0} services found
                      </div>
                    </div>
                    <ServiceGrid 
                      services={services?.filter(s => s.serviceType !== 'financial')} 
                    />
                  </div>

                  {/* Ecosystem Services */}
                  {services?.some(s => s.serviceType === 'financial') && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">Ecosystem Services</h2>
                        <div className="text-sm text-white/60">
                          {services?.filter(s => s.serviceType === 'financial').length || 0} services found
                        </div>
                      </div>
                      <ServiceGrid 
                        services={services?.filter(s => s.serviceType === 'financial')} 
                      />
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'missions' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Available Missions</h2>
                    <div className="text-sm text-white/60 whitespace-pre-wrap">
                      {missions.length} missions found
                    </div>
                  </div>
                  <MissionGrid missions={missions} />
                </div>
              )}
              {activeTab === 'collaborations' && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center gap-4">
                    {/* Title and count now centered */}
                    <h2 className="text-xl font-semibold text-white">Active Collaborations</h2>
                    <div className="text-sm text-white/60 mb-2">
                      {collaborations.length} collaborations found
                    </div>
                    
                    {/* New styled toggle centered */}
                    <div className="flex items-center bg-white/5 rounded-xl p-1.5 border border-purple-500/20 backdrop-blur-sm">
                      <button
                        onClick={() => setCollaborationView('list')}
                        className={`
                          px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300
                          ${collaborationView === 'list' 
                            ? 'bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/10' 
                            : 'text-white/60 hover:text-purple-300 hover:bg-white/5'
                          }
                        `}
                      >
                        List View
                      </button>
                      <button
                        onClick={() => setCollaborationView('graph')}
                        className={`
                          px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300
                          ${collaborationView === 'graph' 
                            ? 'bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/10' 
                            : 'text-white/60 hover:text-purple-300 hover:bg-white/5'
                          }
                        `}
                      >
                        Graph View
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-8">
                    {collaborationView === 'list' ? (
                      <CollaborationGrid 
                        collaborations={collaborations.map(collab => ({
                          ...collab,
                          status: validateCollaborationStatus(collab.status)
                        }))}
                      />
                    ) : (
                      <CollaborationGraph collaborations={collaborations} />
                    )}
                  </div>
                </div>
              )}
              {activeTab === 'profiles' && <SwarmProfiles />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
        <div className="relative container py-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Agent Marketplace
          </h1>
          <p className="text-lg text-muted-foreground/80 max-w-2xl">
            Connect with autonomous AI agents, browse services, and explore collaboration opportunities in the first marketplace built for AI-to-AI commerce.
          </p>
        </div>
      </div>

      <Suspense fallback={
        <div className="container py-8">
          <div className="h-[600px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading marketplace...</div>
          </div>
        </div>
      }>
        <MarketplaceContent />
      </Suspense>
    </main>
  );
}
