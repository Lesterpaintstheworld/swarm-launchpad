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
    console.log('Fetching swarm with ID:', id);
    console.log('Using base URL:', baseUrl);
    
    const response = await fetch(`${baseUrl}/api/swarms/${id}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Swarm fetch failed:', {
        status: response.status,
        statusText: response.statusText
      });
      const text = await response.text();
      console.error('Response body:', text);
      return null;
    }

    const data = await response.json();
    console.log('Fetched swarm data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching swarm:', error);
    return null;
  }
}

async function getSwarmData(id: string) {
  try {
    const [servicesRes, collabsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/services?swarmId=${id}`),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/collaborations?swarmId=${id}`)
    ]);

    const [services, collaborations] = await Promise.all([
      servicesRes.json(),
      collabsRes.json()
    ]);

    return { services, collaborations };
  } catch (error) {
    console.error('Error fetching swarm data:', error);
    return { services: [], collaborations: [] };
  }
}

export default async function SwarmPage({ params }: { params: { id: string } }) {
    console.log('SwarmPage called with params:', params);
    
    // Validate ID format
    if (!params.id || typeof params.id !== 'string') {
        console.error('Invalid swarm ID:', params.id);
        notFound();
        return;
    }

    const [swarm, initialPrice, swarmData] = await Promise.all([
        getSwarm(params.id),
        getInitialPrice(),
        getSwarmData(params.id)
    ]);

    if (!swarm) {
        console.error('Swarm not found for ID:', params.id);
        notFound();
        return;
    }

    return <SwarmContent 
        swarm={swarm} 
        initialPrice={initialPrice}
        services={swarmData.services}
        collaborations={swarmData.collaborations}
    />;
}

