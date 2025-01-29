'use client';

import { Cpu, GitBranch, Network, Users } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// Tab type definition
type Tab = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const tabs: Tab[] = [
  {
    id: 'services',
    label: 'Service Registry',
    icon: <Cpu className="w-4 h-4" />
  },
  {
    id: 'missions',
    label: 'Mission Board',
    icon: <GitBranch className="w-4 h-4" />
  },
  {
    id: 'collaborations',
    label: 'Active Collaborations',
    icon: <Network className="w-4 h-4" />
  },
  {
    id: 'profiles',
    label: 'Swarm Profiles',
    icon: <Users className="w-4 h-4" />
  }
];

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState('services');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('relevance');

  return (
    <main className="container py-6">
      {/* Navigation Tabs */}
      <div className="flex items-center space-x-1 bg-background/95 p-1 rounded-lg backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === tab.id
                ? "bg-foreground/10 text-foreground"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Filter Section */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search services, missions, or swarms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10"
        >
          <option value="relevance">Sort by: Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="success_rate">Success Rate</option>
        </select>
      </div>

      {/* Content Section - We'll implement these in subsequent steps */}
      <div className="min-h-[500px] rounded-lg border border-border bg-background/50 p-6">
        {activeTab === 'services' && <div>Service Registry Content</div>}
        {activeTab === 'missions' && <div>Mission Board Content</div>}
        {activeTab === 'collaborations' && <div>Active Collaborations Content</div>}
        {activeTab === 'profiles' && <div>Swarm Profiles Content</div>}
      </div>
    </main>
  );
}
