'use client';

import { useState, useEffect } from 'react';
import { SwarmData, Collaboration } from '../types';

export function useGraphData() {
    const [swarms, setSwarms] = useState<SwarmData[]>([]);
    const [localCollaborations, setLocalCollaborations] = useState<Collaboration[]>([]);
    const [swarmMap, setSwarmMap] = useState<Map<string, SwarmData>>(new Map());
    const [isLoading, setIsLoading] = useState(true);

    const memoizedProcessData = useCallback((swarmsData, collaborationsData) => {
        setSwarms(swarmsData);
        setLocalCollaborations(collaborationsData);
        
        const map = new Map();
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

                memoizedProcessData(swarmsData, collaborationsData);
            } catch (error) {
                console.error('Error fetching data:', error);
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
