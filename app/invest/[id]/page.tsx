import { SwarmContent } from "./SwarmContent";
import { notFound } from "next/navigation";

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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/swarms/${id}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching swarm:', error);
    return null;
  }
}

export default async function SwarmPage({ params }: { params: { id: string } }) {
    const [swarm, initialPrice] = await Promise.all([
        getSwarm(params.id),
        getInitialPrice()
    ]);

    if (!swarm) {
        notFound();
    }

    return <SwarmContent swarm={swarm} initialPrice={initialPrice} />;
}

