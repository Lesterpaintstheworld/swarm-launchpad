import { useState, useEffect } from 'react';

export function useDexScreenerPrice() {
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana/HiYsmVjeFy4ZLx8pkPSxBjswFkoEjecVGB4zJed2e6Y');
        const data = await response.json();
        if (data.pair) {
          setPrice(parseFloat(data.pair.priceUsd));
        }
      } catch (error) {
        console.error('Failed to fetch price:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPrice();
    // Refresh every 60 seconds
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  return { price, isLoading };
}
