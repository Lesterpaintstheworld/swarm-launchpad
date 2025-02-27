import { useQuery } from '@tanstack/react-query';

// Define types for DexScreener API response
interface DexScreenerPair {
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: number;
  // Add other properties as needed
}

interface DexScreenerResponse {
  pairs: DexScreenerPair[];
}

export function useTokenPrices() {
  return useQuery({
    queryKey: ['token-prices'],
    queryFn: async () => {
      // Fetch both token prices in a single call
      const response = await fetch('https://api.dexscreener.com/latest/dex/tokens/9psiRdn9cXYVps4F1kFuoNjd2EtmqNJXrCPmRppJpump,B1N1HcMm4RysYz4smsXwmk2UnS8NziqKCM6Ho8i62vXo');
      
      if (!response.ok) {
        throw new Error('Failed to fetch token prices');
      }
      
      const data: DexScreenerResponse = await response.json();
      
      // Process the response to create a map of token address to price
      const priceMap = new Map<string, number>();
      
      if (data.pairs) {
        // For UBC token
        const ubcPairs = data.pairs.filter((pair: DexScreenerPair) => 
          pair.baseToken.address === '9psiRdn9cXYVps4F1kFuoNjd2EtmqNJXrCPmRppJpump'
        );
        if (ubcPairs.length > 0) {
          priceMap.set('9psiRdn9cXYVps4F1kFuoNjd2EtmqNJXrCPmRppJpump', ubcPairs[0].priceUsd);
        }
        
        // For COMPUTE token
        const computePairs = data.pairs.filter((pair: DexScreenerPair) => 
          pair.baseToken.address === 'B1N1HcMm4RysYz4smsXwmk2UnS8NziqKCM6Ho8i62vXo'
        );
        if (computePairs.length > 0) {
          priceMap.set('B1N1HcMm4RysYz4smsXwmk2UnS8NziqKCM6Ho8i62vXo', computePairs[0].priceUsd);
        }
      }
      
      return priceMap;
    },
    refetchInterval: 60000, // Refetch every minute
  });
}
