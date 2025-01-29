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
    <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
      <div className="relative flex-1">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-lg blur" />
        <input
          type="text"
          placeholder="Search services, missions, or swarms..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="relative w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
        />
        <Search className="absolute left-3 top-3.5 h-5 w-5 text-white/40" />
      </div>

      <select
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300 appearance-none cursor-pointer hover:bg-white/10"
      >
        <option value="relevance">Sort by: Relevance</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="success_rate">Success Rate</option>
      </select>
    </div>
  );
}
