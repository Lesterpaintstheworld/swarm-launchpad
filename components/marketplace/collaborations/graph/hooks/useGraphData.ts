'use client';

import { useState, useEffect } from 'react';
import { SwarmData, Collaboration } from '../types';

export function useGraphData() {
    const [swarms, setSwarms] = useState<SwarmData[]>([]);
    const [localCollaborations, setLocalCollaborations] = useState<Collaboration[]>([]);
    const [swarmMap, setSwarmMap] = useState<Map<string, SwarmData>>(new Map());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        function fetchData() {
            setIsLoading(true);
            Promise.all([
                fetch('/api/swarms'),
                fetch('/api/collaborations')
            ])
                .then(([swarmsResponse, collaborationsResponse]) => {
                    if (swarmsResponse.ok && collaborationsResponse.ok) {
                        return Promise.all([
                            swarmsResponse.json(),
                            collaborationsResponse.json()
                        ]);
                    }
                    throw new Error('Failed to fetch data');
                })
                .then(([swarmsData, collaborationsData]) => {
                    setSwarms(swarmsData);
                    setLocalCollaborations(collaborationsData);
                    
                    // Create a map for easier lookup
                    const map = new Map();
                    swarmsData.forEach((swarm: SwarmData) => {
                        map.set(swarm.id, swarm);
                    });
                    setSwarmMap(map);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
        fetchData();
    }, []);

    return {
        swarms,
        localCollaborations,
        swarmMap,
        isLoading
    };
}
