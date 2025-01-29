export type MarketplaceTab = 'services' | 'missions' | 'collaborations' | 'profiles';

export type TabItem = {
  id: MarketplaceTab;
  label: string;
  icon: React.ReactNode;
};

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
