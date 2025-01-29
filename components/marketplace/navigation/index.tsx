import { Cpu, GitBranch, Network, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TabItem, MarketplaceTab } from '../types';

const tabs: TabItem[] = [
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

interface MarketplaceNavigationProps {
  activeTab: MarketplaceTab;
  onTabChange: (tab: MarketplaceTab) => void;
}

export function MarketplaceNavigation({ activeTab, onTabChange }: MarketplaceNavigationProps) {
  return (
    <div className="flex items-center space-x-1 bg-background/95 p-1 rounded-lg backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
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
  );
}
