export type MarketplaceTab = 'services' | 'missions' | 'collaborations' | 'profiles';

export type TabItem = {
  id: MarketplaceTab;
  label: string;
  icon: React.ReactNode;
};

export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'success_rate';
