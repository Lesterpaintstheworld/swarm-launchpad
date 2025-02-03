import { readFile, writeFile } from 'fs/promises';

async function main() {
    try {
        // Read the info.tsx file as text
        console.log('Reading info.tsx file...');
        const infoContent = await readFile('data/swarms/info.tsx', 'utf8');
        console.log('File length:', infoContent.length, 'characters');

        // Extract the SwarmData array using a more sophisticated approach
        const startMarker = 'export const SwarmData: SwarmInfo[] = [';
        const startIndex = infoContent.indexOf(startMarker);
        
        if (startIndex === -1) {
            console.log('\nFirst 500 characters of file:');
            console.log(infoContent.substring(0, 500));
            throw new Error('Could not find start of SwarmData array in info.tsx');
        }

        // Find the matching closing bracket by counting opening and closing brackets
        let bracketCount = 1;
        let endIndex = startIndex + startMarker.length;
        
        while (bracketCount > 0 && endIndex < infoContent.length) {
            if (infoContent[endIndex] === '[') bracketCount++;
            if (infoContent[endIndex] === ']') bracketCount--;
            endIndex++;
        }

        if (bracketCount !== 0) {
            throw new Error('Could not find matching end bracket for SwarmData array');
        }

        // Extract the array content
        const arrayContent = infoContent.substring(
            startIndex + startMarker.length, 
            endIndex
        );

        console.log('\nFound array content. Length:', arrayContent.length, 'characters');
        console.log('First 200 characters:', arrayContent.substring(0, 200));

        // Clean up the content
        console.log('Cleaning content...');
        let cleanContent = arrayContent
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
            .replace(/\/\/.*/g, '') // Remove single-line comments
            .replace(/new Date\(['"]([^'"]*)['"]\)/g, '"$1"') // Convert Date objects to strings
            .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas

        // Convert to valid JSON
        cleanContent = cleanContent
            // Add quotes to property names
            .replace(/([{,]\s*)([a-zA-Z0-9_]+):/g, '$1"$2":')
            // Replace single quotes with double quotes
            .replace(/'/g, '"')
            // Handle any remaining trailing commas
            .replace(/,(\s*[}\]])/g, '$1');

        // For debugging
        console.log('\nFirst 500 characters of cleaned content:');
        console.log(cleanContent.substring(0, 500));

        // Parse the JSON
        console.log('Parsing JSON...');
        const swarms = JSON.parse(cleanContent);
        console.log('Found', swarms.length, 'swarms');

        // Transform the data
        console.log('Transforming data...');
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
        console.log('Writing output file...');
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
