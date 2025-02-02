import { useState, useEffect } from 'react';

export function useDexScreenerPrice() {
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function fetchPrice() {
      fetch('https://api.dexscreener.com/latest/dex/pairs/solana/HiYsmVjeFy4ZLx8pkPSxBjswFkoEjecVGB4zJed2e6Y')
        .then(response => response.json())
        .then(data => {
          if (data.pair) {
            setPrice(parseFloat(data.pair.priceUsd));
          }
        })
        .catch(error => {
          console.error('Failed to fetch price:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  return { price, isLoading };
}
