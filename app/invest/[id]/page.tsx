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

'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SwarmContent } from './SwarmContent';

interface SwarmData {
    id: string;
    name: string;
    description?: string;
    pool?: string;
    gallery?: Array<{
        type: string;
        content: string;
    }>;
    launchDate?: string;
}

export default function SwarmPage() {
    const params = useParams();
    const [swarm, setSwarm] = useState<SwarmData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSwarmData() {
            if (!params.id) return;
            
            try {
                const response = await fetch(`/api/swarms/${params.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch swarm data');
                }
                const data = await response.json();
                setSwarm(data);
            } catch (err) {
                setError('Failed to load swarm data');
                console.error('Error fetching swarm:', err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchSwarmData();
    }, [params.id]);

    if (isLoading) {
        return (
            <main className="container view">
                <div className="h-80 flex flex-col items-center justify-center gap-1">
                    <h2 className="text-center">Loading swarm...</h2>
                </div>
            </main>
        );
    }

    if (error || !swarm) {
        return (
            <main className="container view">
                <div className="h-80 flex flex-col items-center justify-center gap-1">
                    <h2 className="text-center">Error loading swarm</h2>
                    <p className="text-center text-balance text-muted text-lg">
                        {error || 'Swarm not found'}
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="container view">
            <SwarmContent swarm={swarm} />
        </main>
    );
}
