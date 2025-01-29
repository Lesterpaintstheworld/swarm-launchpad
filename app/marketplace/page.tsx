'use client';

import { useState } from 'react';
import { CollaborationGrid } from '@/components/marketplace/collaborations/grid';
import { CollaborationGraph } from '@/components/marketplace/collaborations/graph';
import { MarketplaceNavigation } from '@/components/marketplace/navigation';
import { MarketplaceSearch } from '@/components/marketplace/search';
import { MarketplaceTab, SortOption } from '@/components/marketplace/types';
import { ServiceGrid } from '@/components/marketplace/services/grid';
import { MissionGrid } from '@/components/marketplace/missions/grid';
import { services } from '@/data/services/services';
import { missions } from '@/data/missions/missions';
import { collaborations } from '@/data/collaborations/collaborations';
import { SwarmProfiles } from '@/components/marketplace/profiles';


export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<MarketplaceTab>('services');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const [collaborationView, setCollaborationView] = useState<'list' | 'graph'>('list');

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
      {/* Hero Section with Gradient Overlay */}
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

      {/* Main Content */}
      <div className="container py-8">
        <div className="space-y-6">
          {/* Navigation with Glassmorphism */}
          <div className="p-1 rounded-xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/10 shadow-2xl">
            <MarketplaceNavigation 
              activeTab={activeTab}
              onTabChange={setActiveTab}
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
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-white">Available Services</h2>
                      <div className="text-sm text-white/60">
                        {services.length} services found
                      </div>
                    </div>
                    <ServiceGrid services={services} />
                  </div>
                )}
                {activeTab === 'missions' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-white">Available Missions</h2>
                      <div className="text-sm text-white/60">
                        {missions.length} missions found
                      </div>
                    </div>
                    <MissionGrid missions={missions} />
                  </div>
                )}
                {activeTab === 'collaborations' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-white">Active Collaborations</h2>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-white/60">
                          {collaborations.length} collaborations found
                        </div>
                        <div className="flex items-center bg-white/5 rounded-lg p-1">
                          <button
                            onClick={() => setCollaborationView('list')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                              collaborationView === 'list' 
                                ? 'bg-white/10 text-white' 
                                : 'text-white/60 hover:text-white'
                            }`}
                          >
                            List
                          </button>
                          <button
                            onClick={() => setCollaborationView('graph')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                              collaborationView === 'graph' 
                                ? 'bg-white/10 text-white' 
                                : 'text-white/60 hover:text-white'
                            }`}
                          >
                            Graph
                          </button>
                        </div>
                      </div>
                    </div>
                    {collaborationView === 'list' ? (
                      <CollaborationGrid collaborations={collaborations} />
                    ) : (
                      <CollaborationGraph collaborations={collaborations} />
                    )}
                  </div>
                )}
                {activeTab === 'profiles' && <SwarmProfiles />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
