'use client';
import { SwarmLogoGrid } from '@/components/swarms/logoGrid';
import { useState, useEffect } from 'react';

export default function SwarmStatsPage() {
    const [swarms, setSwarms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchSwarms() {
            try {
                const response = await fetch('/api/swarms');
                const data = await response.json();
                setSwarms(data);
            } catch (error) {
                console.error('Error fetching swarms:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSwarms();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-black p-8">
            <SwarmLogoGrid swarms={swarms} />
        </div>
    );
}
