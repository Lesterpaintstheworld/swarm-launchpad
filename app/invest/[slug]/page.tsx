import { SwarmContent } from "./SwarmContent";

async function getInitialPrice() {
  try {
    const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana/HiYsmVjeFy4ZLx8pkPSxBjswFkoEjecVGB4zJed2e6Y');
    const data = await response.json();
    return data.pair?.priceUsd ? parseFloat(data.pair.priceUsd) : null;
  } catch (error) {
    console.error('Failed to fetch initial price:', error);
    return null;
  }
}

async function getSwarm(id: string) {
  try {
    const response = await fetch(`/api/swarms/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch swarm');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching swarm:', error);
    return null;
  }
}

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function SwarmPage({ params }: PageProps) {
    const [swarm, initialPrice] = await Promise.all([
        getSwarm(params.slug),
        getInitialPrice()
    ]);

    if (!swarm) {
        return null;
    }

    return <SwarmContent swarm={swarm} initialPrice={initialPrice} />;
}

