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

export function processCollaborations(collaborations: any[]) {
    // Filter collaborations and create set of ecosystem targets
    const filteredCollaborations = collaborations.filter(
        collab => collab.providerSwarm && collab.clientSwarm
    );

    const ecosystemTargets = new Set(
        collaborations
            .filter(collab => collab.providerSwarm?.id === 'ecosystem')
            .map(collab => collab.clientSwarm?.id)
            .filter(Boolean)
    );

    // Create unique nodes
    const uniqueSwarms = new Set();
    filteredCollaborations.forEach(collab => {
        uniqueSwarms.add(JSON.stringify({
            id: collab.providerSwarm.id,
            name: collab.providerSwarm.name,
            image: collab.providerSwarm.image
        }));
        uniqueSwarms.add(JSON.stringify({
            id: collab.clientSwarm.id,
            name: collab.clientSwarm.name,
            image: collab.clientSwarm.image
        }));
    });

    const nodes = Array.from(uniqueSwarms).map(s => JSON.parse(s as string));

    // Calculate link strengths
    const maxPrice = Math.max(...filteredCollaborations.map(c => c.price));
    const minPrice = Math.min(...filteredCollaborations.map(c => c.price));

    const links = filteredCollaborations.map(collab => ({
        source: collab.providerSwarm.id,
        target: collab.clientSwarm.id,
        value: collab.price,
        strength: (collab.price / maxPrice) * 0.3 + 0.2,
        serviceName: collab.serviceName
    }));

    return {
        nodes,
        links,
        ecosystemTargets,
        maxPrice,
        minPrice
    };
}
