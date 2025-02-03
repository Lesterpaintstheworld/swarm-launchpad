import { readFile, writeFile } from 'fs/promises';

async function main() {
    try {
        // First, read all the description files
        const descriptions = {
            KinOSDescription: await readFile('data/swarms/descriptions/kinos.ts', 'utf8').then(content => {
                const match = content.match(/export const description = ['"](.*)['"];/);
                return match ? match[1] : '';
            }),
            KinKongDescription: await readFile('data/swarms/descriptions/kinkong.ts', 'utf8').then(content => {
                const match = content.match(/export const description = ['"](.*)['"];/);
                return match ? match[1] : '';
            }),
            SwarmVenturesDescription: await readFile('data/swarms/descriptions/swarmventures.ts', 'utf8').then(content => {
                const match = content.match(/export const description = ['"](.*)['"];/);
                return match ? match[1] : '';
            }),
            TerminalVelocityDescription: await readFile('data/swarms/descriptions/terminalvelocity.ts', 'utf8').then(content => {
                const match = content.match(/export const description = ['"](.*)['"];/);
                return match ? match[1] : '';
            }),
            SyntheticSoulsDescription: await readFile('data/swarms/descriptions/syntheticsouls.ts', 'utf8').then(content => {
                const match = content.match(/export const description = ['"](.*)['"];/);
                return match ? match[1] : '';
            }),
            DuoAIDescription: await readFile('data/swarms/descriptions/duoai.ts', 'utf8').then(content => {
                const match = content.match(/export const description = ['"](.*)['"];/);
                return match ? match[1] : '';
            }),
            SlopFatherDescription: await readFile('data/swarms/descriptions/slopfather.ts', 'utf8').then(content => {
                const match = content.match(/export const description = ['"](.*)['"];/);
                return match ? match[1] : '';
            })
        };

        // Read the info.tsx file
        console.log('Reading info.tsx file...');
        const infoContent = await readFile('data/swarms/info.tsx', 'utf8');
        console.log('File length:', infoContent.length, 'characters');

        // Extract the SwarmData array
        const startMarker = 'export const SwarmData: SwarmInfo[] = [';
        const startIndex = infoContent.indexOf(startMarker);
        
        if (startIndex === -1) {
            throw new Error('Could not find start of SwarmData array in info.tsx');
        }

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

        // Extract the content
        let content = infoContent.substring(startIndex + startMarker.length, endIndex);

        // First pass: Clean up basic syntax
        content = content
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
            .replace(/\/\/.*/g, '') // Remove single-line comments
            .replace(/new Date\(['"]([^'"]*)['"]\)/g, '"$1"') // Convert Date objects to strings
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();

        // Second pass: Handle property names and values
        content = content
            .replace(/([{,]\s*)([a-zA-Z0-9_]+):/g, '$1"$2":') // Add quotes to property names
            .replace(/'/g, '"') // Replace single quotes with double quotes
            .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas

        // Replace description references with actual content
        Object.entries(descriptions).forEach(([key, value]) => {
            const escapedValue = value.replace(/"/g, '\\"'); // Escape quotes in descriptions
            content = content.replace(new RegExp(key, 'g'), `"${escapedValue}"`);
        });

        // Try to parse the content
        console.log('\nAttempting to parse content...');
        
        // Parse each object individually to find issues
        const objects = content.split('},{').map((obj, index, array) => {
            // Add back the brackets that were split
            let fixedObj = obj;
            if (index === 0) fixedObj = obj + '}';
            else if (index === array.length - 1) fixedObj = '{' + obj;
            else fixedObj = '{' + obj + '}';

            try {
                JSON.parse(fixedObj);
                return fixedObj;
            } catch (e) {
                console.log('\nError parsing object:', fixedObj);
                console.log('Error:', e.message);
                return null;
            }
        }).filter(Boolean);

        // Combine the valid objects back into an array
        const validContent = '[' + objects.join(',') + ']';

        // Parse and transform
        console.log('\nParsing final JSON...');
        const swarms = JSON.parse(validContent);
        console.log('Found', swarms.length, 'swarms');

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

        // Write output
        const fileContent = `const SwarmData = ${JSON.stringify(transformedSwarms, null, 2)};

module.exports = { SwarmData };
`;

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
