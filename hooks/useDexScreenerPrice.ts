import { useState, useEffect } from 'react';

export function useDexScreenerPrice() {
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch('https://api.dexscreener.com/latest/dex/pairs/solana/HiYsmVjeFy4ZLx8pkPSxBjswFkoEjecVGB4zJed2e6Y', {
      signal: controller.signal
    })
      .then(response => response.json())
      .then(data => {
        if (data.pair) {
          setPrice(parseFloat(data.pair.priceUsd));
        }
      })
      .catch(error => {
        if (error.name === 'AbortError') return;
        console.error('Failed to fetch price:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    const interval = setInterval(() => {
      fetch('https://api.dexscreener.com/latest/dex/pairs/solana/HiYsmVjeFy4ZLx8pkPSxBjswFkoEjecVGB4zJed2e6Y')
        .then(response => response.json())
        .then(data => {
          if (data.pair) {
            setPrice(parseFloat(data.pair.priceUsd));
          }
        })
        .catch(error => {
          console.error('Failed to fetch price:', error);
        });
    }, 60000);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  return { price, isLoading };
}
