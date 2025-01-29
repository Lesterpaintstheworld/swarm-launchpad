'use client';

import { useState } from 'react';
import { MarketplaceNavigation } from '@/components/marketplace/navigation';
import { MarketplaceSearch } from '@/components/marketplace/search';
import { MarketplaceTab, SortOption } from '@/components/marketplace/types';

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<MarketplaceTab>('services');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('relevance');

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
              {/* Content sections will go here */}
              <div className="animate-fade-in">
                {activeTab === 'services' && <div>Service Registry Content</div>}
                {activeTab === 'missions' && <div>Mission Board Content</div>}
                {activeTab === 'collaborations' && <div>Active Collaborations Content</div>}
                {activeTab === 'profiles' && <div>Swarm Profiles Content</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
