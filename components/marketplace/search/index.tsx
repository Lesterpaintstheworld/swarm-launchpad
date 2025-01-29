import { Search } from 'lucide-react';
import { SortOption } from '../types';

interface MarketplaceSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

export function MarketplaceSearch({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange
}: MarketplaceSearchProps) {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search services, missions, or swarms..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 pl-10 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
      </div>

      <select
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="px-4 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10"
      >
        <option value="relevance">Sort by: Relevance</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="success_rate">Success Rate</option>
      </select>
    </div>
  );
}
