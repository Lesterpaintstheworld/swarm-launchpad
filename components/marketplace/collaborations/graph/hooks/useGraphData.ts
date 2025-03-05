'use client';

import { useState, useEffect, useCallback } from 'react';
import { SwarmData, Collaboration } from '../types';

export function useGraphData() {
    const [swarms, setSwarms] = useState<SwarmData[]>([]);
    const [localCollaborations, setLocalCollaborations] = useState<Collaboration[]>([]);
    const [swarmMap, setSwarmMap] = useState<Map<string, SwarmData>>(new Map());
    const [isLoading, setIsLoading] = useState(true);

    const memoizedProcessData = useCallback((
        swarmsData: SwarmData[], 
        collaborationsData: Collaboration[]
    ) => {
        setSwarms(swarmsData);
        setLocalCollaborations(collaborationsData);
        
        const map = new Map<string, SwarmData>();
        swarmsData.forEach((swarm: SwarmData) => {
            map.set(swarm.id, swarm);
        });
        setSwarmMap(map);
    }, []);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const [swarmsResponse, collaborationsResponse] = await Promise.all([
                    fetch('/api/swarms'),
                    fetch('/api/collaborations')
                ]);

                if (!swarmsResponse.ok || !collaborationsResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const [swarmsData, collaborationsData] = await Promise.all([
                    swarmsResponse.json(),
                    collaborationsResponse.json()
                ]);

                console.log('Fetched swarms data:', swarmsData);
                console.log('Fetched collaborations data:', collaborationsData);

                memoizedProcessData(swarmsData, collaborationsData);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Provide fallback data for development/testing
                const fallbackSwarms = [
                    {
                        id: 'swarm1',
                        name: 'Data Processing Swarm',
                        swarmType: 'Processing',
                        description: 'Processes large datasets efficiently',
                        multiple: 2.5,
                        revenueShare: 60,
                        image: '/images/swarm-placeholder.png',
                        weeklyRevenue: 5000
                    },
                    {
                        id: 'swarm2',
                        name: 'AI Research Swarm',
                        swarmType: 'Research',
                        description: 'Conducts AI research and development',
                        multiple: 3.2,
                        revenueShare: 70,
                        image: '/images/swarm-placeholder.png',
                        weeklyRevenue: 7500
                    }
                ];
                
                const fallbackCollaborations = [
                    {
                        id: 'collab1',
                        providerSwarm: fallbackSwarms[0],
                        clientSwarm: fallbackSwarms[1],
                        serviceName: 'Data Processing',
                        price: 2000,
                        status: 'active'
                    }
                ];
                
                memoizedProcessData(fallbackSwarms, fallbackCollaborations);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [memoizedProcessData]);

    return {
        swarms,
        localCollaborations,
        swarmMap,
        isLoading
    };
}
