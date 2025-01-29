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
    <main className="container py-6">
      <div className="space-y-8">
        <MarketplaceNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <MarketplaceSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortOption}
          onSortChange={setSortOption}
        />

        <div className="min-h-[500px] rounded-lg border border-border bg-background/50 p-6">
          {/* Content sections will go here */}
        </div>
      </div>
    </main>
  );
}
