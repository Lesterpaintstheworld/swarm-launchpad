import { SwarmData } from '../data/swarms/info.js';
import fs from 'fs/promises';

// Transform the data to the new format
const transformedSwarms = SwarmData.map(swarm => ({
    id: swarm.id.replace(/-partner-id$|-inception-id$/, ''), // Remove suffixes
    image: swarm.image,
    name: swarm.name,
    pool: swarm.pool || '',
    weeklyRevenue: swarm.weeklyRevenue || 0,
    totalRevenue: swarm.totalRevenue || 0,
    gallery: swarm.gallery || [],
    description: swarm.description,
    tags: swarm.tags || [],
    swarmType: swarm.swarmType || '',
    multiple: swarm.multiple || 1,
    launchDate: swarm.launchDate || '',
    revenueShare: swarm.revenueShare || 0,
    wallet: swarm.wallet || '',
    banner: swarm.banner || '',
    socials: swarm.socials || {},
    team: swarm.team || [],
    links: swarm.links || []
}));

// Generate the output file content
const fileContent = `const SwarmData = ${JSON.stringify(transformedSwarms, null, 2)};

module.exports = { SwarmData };
`;

// Write to scripts/data/swarms.cjs
await fs.writeFile('scripts/data/swarms.cjs', fileContent);

console.log('Generated swarms data file successfully!');
