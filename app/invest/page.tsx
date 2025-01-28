'use client'

import { TokenTooltip } from "@/components/ui/tokenTooltip";
import { SwarmData } from "@/data/swarms/info";
import { SwarmPreviewCard } from "@/components/swarms/preview";
import { useState, useMemo } from 'react';
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/ui/input";
import { SwarmType } from "@/components/swarms/swarm.types";

export default function Invest() {
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState<SwarmType | 'all'>('all');

    const filteredAndSortedSwarms = useMemo(() => {
        return [...SwarmData]
            .filter(swarm => 
                // Filter by pool existence
                swarm.pool && 
                // Filter by search
                (swarm.name.toLowerCase().includes(search.toLowerCase()) ||
                swarm.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())) ||
                swarm.role.toLowerCase().includes(search.toLowerCase())) &&
                // Filter by type
                (selectedType === 'all' || swarm.swarmType === selectedType)
            )
            .sort((a, b) => (b.multiple || 0) - (a.multiple || 0));
    }, [search, selectedType]);

    const types: Array<{ value: SwarmType | 'all', label: string }> = [
        { value: 'all', label: 'All Swarms' },
        { value: 'inception', label: 'Inception' },
        { value: 'early', label: 'Early Access' },
        { value: 'partner', label: 'Partner' },
    ];

    return (
        <main className="container view">
            <div className="h-80 flex flex-col items-center justify-center gap-3">
                <h2 className="text-center">Invest in our <span className="font-bold">AI Swarms</span></h2>
                <div className="text-muted flex flex-row flex-wrap text-lg items-center justify-center">
                    <p className="text-center text-nowrap">Generate&ensp;</p>
                    <TokenTooltip token="$UBC"><span className="metallic-text-ubc">$UBC</span></TokenTooltip>
                    <p className="text-center text-nowrap">&ensp;returns by investing your&ensp;</p>
                    <TokenTooltip token="$COMPUTE"><span className="metallic-text">$COMPUTE</span></TokenTooltip>
                    <p className="text-center text-nowrap">&ensp;tokens into our ai swarms.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                    {types.map((type) => (
                        <Button
                            key={type.value}
                            variant={selectedType === type.value ? "default" : "outline"}
                            onClick={() => setSelectedType(type.value)}
                            className="text-sm"
                        >
                            {type.label}
                        </Button>
                    ))}
                </div>
                <Input
                    placeholder="Search swarms..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-xs"
                />
            </div>

            {/* Results count */}
            <div className="mb-6 text-sm text-muted-foreground">
                Showing {filteredAndSortedSwarms.length} swarms
            </div>

            {/* Grid of sorted swarms */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedSwarms.map((swarm) => (
                    <SwarmPreviewCard 
                        key={swarm.id}
                        swarm={{
                            ...swarm,
                            revenueShare: swarm.revenueShare || 60,
                        }}
                        className="h-full"
                    />
                ))}
            </div>

            {/* No results */}
            {filteredAndSortedSwarms.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">No swarms found matching your criteria</p>
                </div>
            )}
        </main>
    );
}
