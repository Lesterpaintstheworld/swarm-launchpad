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
    console.log('Fetching swarm with slug:', slug);
    console.log('Full URL:', `${baseUrl}/api/swarms/${slug}`);
    
    const response = await fetch(`${baseUrl}/api/swarms/${slug}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Failed to fetch swarm:', response.statusText);
      return null;
    }

    const data = await response.json();
    console.log('Received swarm data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching swarm:', error);
    return null;
  }
}

interface PageProps {
    params: {
        id: string;
    };
}

export default async function SwarmPage({ params }: PageProps) {
    console.log('Rendering SwarmPage with id:', params.id);
    
    const [swarm, initialPrice] = await Promise.all([
        getSwarm(params.id),
        getInitialPrice()
    ]);

    if (!swarm) {
        console.log('No swarm found, returning 404');
        notFound();
    }

    console.log('Rendering SwarmContent with:', { swarm, initialPrice });
    return <SwarmContent swarm={swarm} initialPrice={initialPrice} />;
}

