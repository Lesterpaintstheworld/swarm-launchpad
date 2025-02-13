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

    // Add invisible link between Shareholders and kinos
    links.push({
        source: 'shareholders',
        target: 'kinos',
        value: minPrice,
        strength: 0.3,
        serviceName: 'ownership',
        invisible: true
    });

    console.log('Created links:', links);

    return {
        nodes,
        links,
        ecosystemTargets,
        maxPrice,
        minPrice
    };
}
