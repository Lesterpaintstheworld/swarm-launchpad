import { readFile, writeFile } from 'fs/promises';
import path from 'path';

async function main() {
    try {
        // Read the info.tsx file as text
        console.log('Reading info.tsx file...');
        const infoContent = await readFile('data/swarms/info.tsx', 'utf8');
        console.log('File length:', infoContent.length, 'characters');

        // Extract the SwarmData array using a more flexible regex
        const startMarker = 'export const SwarmData: SwarmInfo[] = [';
        const endMarker = '];';
        
        const startIndex = infoContent.indexOf(startMarker);
        console.log('Start marker index:', startIndex);
        
        if (startIndex === -1) {
            // Log a portion of the file content to see what we're working with
            console.log('\nFirst 500 characters of file:');
            console.log(infoContent.substring(0, 500));
            throw new Error('Could not find start of SwarmData array in info.tsx');
        }

        const endIndex = infoContent.indexOf(endMarker, startIndex);
        console.log('End marker index:', endIndex);
        
        if (endIndex === -1) {
            throw new Error('Could not find end of SwarmData array in info.tsx');
        }

        // Extract the array content
        console.log('\nFirst 200 characters of extracted array:');
        console.log(arrayContent.substring(0, 200));
        const arrayContent = infoContent.substring(
            startIndex + startMarker.length, 
            endIndex + 1
        );

        // Clean up the content
        const cleanContent = arrayContent
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
            .replace(/\/\/.*/g, '') // Remove single-line comments
            .replace(/new Date\(['"]([^'"]*)['"]\)/g, '"$1"') // Convert Date objects to strings
            .replace(/'/g, '"') // Replace single quotes with double quotes
            .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
            .replace(/\n\s*\n/g, '\n'); // Remove empty lines

        // Parse the JSON
        const swarms = JSON.parse(cleanContent);

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
        if (error.message.includes('JSON')) {
            console.error('JSON parsing error. Content:', error.content);
        }
        process.exit(1);
    }
}

main();
