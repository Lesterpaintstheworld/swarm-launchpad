import { readFile, writeFile } from 'fs/promises';
import path from 'path';

async function main() {
    try {
        // Read the info.tsx file as text
        const infoContent = await readFile('data/swarms/info.tsx', 'utf8');

        // Extract the SwarmData array using regex
        const match = infoContent.match(/export const SwarmData: SwarmInfo\[\] = \[([\s\S]*?)\];/);
        if (!match) {
            throw new Error('Could not find SwarmData array in info.tsx');
        }

        // Parse the array content
        const arrayContent = match[1];
        
        // Convert to valid JSON by replacing some TypeScript-specific syntax
        const jsonContent = arrayContent
            .replace(/new Date\([^)]*\)/g, '""') // Replace Date objects with empty strings
            .replace(/'/g, '"') // Replace single quotes with double quotes
            .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas

        // Parse the JSON
        const swarms = JSON.parse(`[${jsonContent}]`);

        // Transform the data
        const transformedSwarms = swarms.map(swarm => ({
            id: swarm.id.replace(/-partner-id$|-inception-id$/, ''),
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
        await writeFile('scripts/data/swarms.cjs', fileContent);

        console.log('Generated swarms data file successfully!');
    } catch (error) {
        console.error('Error generating swarms data:', error);
        process.exit(1);
    }
}

main();
