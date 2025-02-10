import { SwarmContent } from "./SwarmContent";
import { notFound } from "next/navigation";

// Move data fetching to Server Component
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
        console.log('Fetching swarm with ID:', id);
        
        // Use absolute URL with origin for production
        const origin = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const response = await fetch(`${origin}/api/swarms/${id}`, {
            cache: 'no-store',
            headers: {
                'Accept': 'application/json'
            }
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
    const origin = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const [servicesRes, collabsRes] = await Promise.all([
      fetch(`${origin}/api/services?swarmId=${id}`),
      fetch(`${origin}/api/collaborations?swarmId=${id}`)
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

