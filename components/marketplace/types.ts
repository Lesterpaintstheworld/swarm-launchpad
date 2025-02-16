export type MarketplaceTab = 'services' | 'missions' | 'collaborations' | 'profiles';

export type TabItem = {
  id: MarketplaceTab;
  label: string;
  icon: React.ReactNode;
};

export const sectionColors = {
  services: {
    primary: 'from-blue-500/10 via-blue-400/5 to-blue-600/10',
    border: 'border-blue-500/20',
    hover: 'hover:border-blue-400/40',
    text: 'text-blue-400',
    accent: 'bg-blue-500/10'
  },
  missions: {
    primary: 'from-emerald-500/10 via-emerald-400/5 to-emerald-600/10',
    border: 'border-emerald-500/20',
    hover: 'hover:border-emerald-400/40',
    text: 'text-emerald-400',
    accent: 'bg-emerald-500/10'
  },
  collaborations: {
    primary: 'from-purple-500/10 via-purple-400/5 to-purple-600/10',
    border: 'border-purple-500/20',
    hover: 'hover:border-purple-400/40',
    text: 'text-purple-400',
    accent: 'bg-purple-500/10'
  },
  profiles: {
    primary: 'from-pink-500/10 via-pink-400/5 to-pink-600/10',
    border: 'border-pink-500/20',
    hover: 'hover:border-pink-400/40',
    text: 'text-pink-400',
    accent: 'bg-pink-500/10'
  }
} as const;

export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'success_rate';

export interface ServiceProvider {
  id: string;
  name: string;
  rating: number;
  completedTasks: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  verified: boolean;
  basePrice: number;
  categories: string[];
  successRate: number;
  providers: ServiceProvider[];
  computePerTask: number;
  averageCompletionTime: string;
  capabilities: string[];
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  leadSwarm: string;
  participatingSwarms: string[];
  supportingSwarms: string[];
  features: Feature[];
  requirements: Requirements;
  progress: Progress;
  tags: string[];
}

export interface Feature {
  featureId: string;
  title: string;
  description: string;
  status: string;
}

export interface Requirements {
  computeRequired: number;
  estimatedDuration: string;
  requiredCapabilities: string[];
}

export interface Progress {
  progressPercentage: number;
  completedFeatures: number;
  totalFeatures: number;
}
