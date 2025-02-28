import { useQuery } from '@tanstack/react-query';

// Define types for DexScreener API response
interface DexScreenerPair {
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: number;
  liquidity?: {
    usd: number;
  };
  pairAddress: string;
  // Add other properties as needed
}

interface DexScreenerResponse {
  pairs: DexScreenerPair[];
}

export function useTokenPrices() {
  return useQuery({
    queryKey: ['token-prices'],
    queryFn: async () => {
      // Fetch token prices in a single call - add SOL to the list
      const response = await fetch('https://api.dexscreener.com/latest/dex/tokens/9psiRdn9cXYVps4F1kFuoNjd2EtmqNJXrCPmRppJpump,B1N1HcMm4RysYz4smsXwmk2UnS8NziqKCM6Ho8i62vXo,So11111111111111111111111111111111111111112');
      
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
        
        // For SOL token
        const solPairs = data.pairs.filter((pair: DexScreenerPair) => 
          pair.baseToken.address === 'So11111111111111111111111111111111111111112'
        );
        if (solPairs.length > 0) {
          priceMap.set('11111111111111111111111111111111', solPairs[0].priceUsd);
        }
      }
      
      // Fetch COMPUTE price from Meteora pool separately
      try {
        const meteoraResponse = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana/HN7ibjiyX399d1EfYXcWaSHZRSMfUmonYvXGFXG41Rr3');
        
        if (meteoraResponse.ok) {
          const meteoraData: DexScreenerResponse = await meteoraResponse.json();
          
          if (meteoraData.pairs && meteoraData.pairs.length > 0) {
            // Find the COMPUTE token in the pair
            const computePair = meteoraData.pairs[0];
            
            // Check if COMPUTE is the base token or quote token
            if (computePair.baseToken.address === 'B1N1HcMm4RysYz4smsXwmk2UnS8NziqKCM6Ho8i62vXo') {
              priceMap.set('B1N1HcMm4RysYz4smsXwmk2UnS8NziqKCM6Ho8i62vXo', computePair.priceUsd);
              console.log('COMPUTE price from Meteora pool:', computePair.priceUsd);
            } else if (computePair.quoteToken.address === 'B1N1HcMm4RysYz4smsXwmk2UnS8NziqKCM6Ho8i62vXo') {
              // If COMPUTE is the quote token, we need to calculate its price differently
              // This depends on the specific API response format
              const computePrice = computePair.priceUsd ? 1 / computePair.priceUsd : 0;
              priceMap.set('B1N1HcMm4RysYz4smsXwmk2UnS8NziqKCM6Ho8i62vXo', computePrice);
              console.log('COMPUTE price from Meteora pool (quote token):', computePrice);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch COMPUTE price from Meteora pool:', error);
        
        // Fallback to regular DexScreener data if Meteora fetch fails
        const computePairs = data.pairs?.filter((pair: DexScreenerPair) => 
          pair.baseToken.address === 'B1N1HcMm4RysYz4smsXwmk2UnS8NziqKCM6Ho8i62vXo'
        );
        if (computePairs && computePairs.length > 0) {
          priceMap.set('B1N1HcMm4RysYz4smsXwmk2UnS8NziqKCM6Ho8i62vXo', computePairs[0].priceUsd);
          console.log('COMPUTE price from fallback:', computePairs[0].priceUsd);
        }
      }
      
      return priceMap;
    },
    refetchInterval: 300000, // Refetch every 5 minutes instead of every minute
    staleTime: 240000, // Data is fresh for 4 minutes
    gcTime: 600000, // Cache for 10 minutes (renamed from cacheTime)
  });
}
