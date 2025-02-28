import { Cpu, GitBranch, Network, Users, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TabItem, MarketplaceTab, sectionColors } from '../types';

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
  },
  {
    id: 'p2p',
    label: 'Secondary Market',
    icon: <ArrowRightLeft className="w-4 h-4" />
  }
];

interface MarketplaceNavigationProps {
  activeTab: MarketplaceTab;
  onTabChange: (tab: MarketplaceTab) => void;
}

export function MarketplaceNavigation({ activeTab, onTabChange }: MarketplaceNavigationProps) {
  return (
    <div className="flex border border-border rounded-lg bg-white/5 items-center md:justify-between flex-wrap space-x-2 p-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "group relative flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-md transition-colors duration-300",
            activeTab === tab.id
              ? `bg-gradient-to-br ${sectionColors[tab.id].primary} ${sectionColors[tab.id].text} shadow-lg`
              : `text-white/60 hover:${sectionColors[tab.id].text} hover:bg-white/5`
          )}
        >
          {/* Glow effect on active */}
          {activeTab === tab.id && (
            <div className="absolute inset-0 rounded-lg bg-white/5 blur-sm" />
          )}

          {/* Icon with transition */}
          <div className={cn(
            "transition-transform duration-300",
            activeTab === tab.id ? "scale-110" : "group-hover:scale-110"
          )}>
            {tab.icon}
          </div>

          {/* Label */}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
