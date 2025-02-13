'use client';

export function calculateLinkWidth(value: number, minPrice: number, maxPrice: number) {
    const minWidth = 1;
    const maxWidth = 8;
    const scale = (Math.log(value) - Math.log(minPrice)) / (Math.log(maxPrice) - Math.log(minPrice));
    return minWidth + (scale * (maxWidth - minWidth));
}

export function calculateNodeSize(multiple: number | undefined): number {
    if (!multiple) return 30; // Default size
    return Math.max(25, Math.min(40, 25 + (multiple * 0.2)));
}

export function processCollaborations(collaborations: any[], swarms: any[]) {
    console.log('Processing collaborations:', collaborations);

    // Filter collaborations and create set of ecosystem targets
    const filteredCollaborations = collaborations.filter(collab => {
        const isValid = collab.providerSwarm && collab.clientSwarm;
        if (!isValid) {
            console.warn('Invalid collaboration:', collab);
        }
        return isValid;
    });

    console.log('Filtered collaborations:', filteredCollaborations);

    const ecosystemTargets = new Set(
        collaborations
            .filter(collab => collab.providerSwarm?.id === 'ecosystem')
            .map(collab => collab.clientSwarm?.id)
            .filter(Boolean)
    );

    // Create unique nodes
    const uniqueSwarms = new Set();
    filteredCollaborations.forEach(collab => {
        if (collab.providerSwarm?.id && collab.providerSwarm?.name && collab.providerSwarm?.image) {
            uniqueSwarms.add(JSON.stringify({
                id: collab.providerSwarm.id,
                name: collab.providerSwarm.name,
                image: collab.providerSwarm.image
            }));
        }
        if (collab.clientSwarm?.id && collab.clientSwarm?.name && collab.clientSwarm?.image) {
            uniqueSwarms.add(JSON.stringify({
                id: collab.clientSwarm.id,
                name: collab.clientSwarm.name,
                image: collab.clientSwarm.image
            }));
        }
    });

    // Add Shareholders node
    uniqueSwarms.add(JSON.stringify({
        id: 'shareholders',
        name: 'Shareholders',
        image: '/images/shareholders.png',
        isShareholderNode: true
    }));

    const nodes = Array.from(uniqueSwarms).map(s => JSON.parse(s as string));
    console.log('Created nodes:', nodes);

    // Calculate link strengths
    const prices = filteredCollaborations.map(c => c.price).filter(p => !isNaN(p) && p > 0);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);

    // Create regular links
    const links = filteredCollaborations.map(collab => ({
        source: collab.providerSwarm.id,
        target: collab.clientSwarm.id,
        value: collab.price || minPrice,
        strength: ((collab.price || minPrice) / maxPrice) * 0.3 + 0.2,
        serviceName: collab.serviceName
    }));

    // Calculate revenue flows for swarms with weeklyRevenue
    const revenueFlows = swarms
        .filter(swarm => {
            console.log('Checking swarm revenue details:', {
                id: swarm.id,
                weeklyRevenue: swarm.weeklyRevenue,
                revenueShare: swarm.revenueShare,
                hasRevenue: Boolean(swarm.weeklyRevenue && swarm.weeklyRevenue > 0)
            });
            return swarm.weeklyRevenue && swarm.weeklyRevenue > 0;
        })
        .map(swarm => {
            const revenueShare = swarm.revenueShare || 60; // default to 60% if not specified
            const revenueDistributed = Math.floor((swarm.weeklyRevenue! * revenueShare) / 100);
            
            console.log('Revenue flow calculation:', {
                id: swarm.id,
                weeklyRevenue: swarm.weeklyRevenue,
                revenueShare,
                revenueDistributed,
                flowValue: revenueDistributed * 10 // Increase the value to make flows more visible
            });

            return {
                source: swarm.id,
                target: 'shareholders',
                value: revenueDistributed * 10, // Increase the value to make flows more visible
                strength: 0.3,
                serviceName: 'revenue',
                isRevenueFlow: true,
                weeklyRevenue: swarm.weeklyRevenue,
                revenueShare: revenueShare,
                revenueDistributed: revenueDistributed // Add the actual distributed amount
            };
        });

    // Add revenue flows to the main links array
    links.push(...revenueFlows);

    console.log('Created revenue flows:', revenueFlows);

    console.log('Created links:', links);

    return {
        nodes,
        links,
        ecosystemTargets,
        maxPrice,
        minPrice
    };
}
