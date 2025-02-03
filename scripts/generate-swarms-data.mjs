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

        // Extract and clean the content
        let content = infoContent.substring(startIndex + startMarker.length, endIndex);

        // Function to properly format a JavaScript object into valid JSON
        function formatToJSON(str) {
            let result = str
                // Handle property names
                .replace(/([{,]\s*)([a-zA-Z0-9_]+):/g, '$1"$2":')
                // Handle string values
                .replace(/:\s*'([^']*?)'/g, ':"$1"')
                // Handle Date objects
                .replace(/new Date\(['"]([^'"]*)['"]\)/g, '"$1"')
                // Remove trailing commas
                .replace(/,(\s*[}\]])/g, '$1')
                // Remove comments
                .replace(/\/\*[\s\S]*?\*\//g, '')
                .replace(/\/\/.*/g, '')
                // Remove control characters
                .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
                // Handle team array
                .replace(/team:\s*\[([\s\S]*?)\]/g, (match, teamContent) => {
                    // Format team member objects
                    const formattedTeam = teamContent
                        .replace(/{\s*name:/g, '{"name":')
                        .replace(/,\s*picture:/g, ',"picture":')
                        .replace(/,\s*telegram:/g, ',"telegram":')
                        .replace(/,\s*X:/g, ',"X":')
                        .replace(/'/g, '"');
                    return `"team":[${formattedTeam}]`;
                })
                // Normalize whitespace
                .replace(/\s+/g, ' ')
                .trim();

            // Add quotes around property values that need them
            result = result.replace(/:\s*([^",\{\[\]\}\s][^,\}\]]*)/g, (match, value) => {
                if (/^-?\d+\.?\d*$/.test(value)) return match; // Don't quote numbers
                if (/^true|false|null$/.test(value)) return match; // Don't quote booleans or null
                return `:"${value}"`;
            });

            return result;
        }

        // Split into individual objects and process each one
        const objects = content.split('},').map((obj, index, array) => {
            let objStr = obj;
            if (index < array.length - 1) objStr += '}';
            
            let formattedObj = ''; // Declare outside try block
            
            try {
                // Format the object
                formattedObj = formatToJSON(objStr);
                console.log('\nProcessing object:', index + 1);
                console.log('Original:', objStr.substring(0, 200) + '...');
                console.log('Formatted:', formattedObj.substring(0, 200) + '...');
                
                // Test parse
                JSON.parse(formattedObj);
                return formattedObj;
            } catch (e) {
                console.log('\nError in object:', index + 1);
                console.log('Original:', objStr.substring(0, 200) + '...');
                if (formattedObj) {
                    console.log('Formatted:', formattedObj.substring(0, 200) + '...');
                }
                console.log('Error:', e.message);
                
                // Try to fix common issues
                try {
                    // Handle array values
                    formattedObj = objStr.replace(/:\s*\[(.*?)\]/g, (match, contents) => {
                        const fixedContents = contents
                            .replace(/'/g, '"')
                            .replace(/,\s*]/g, ']');
                        return `: [${fixedContents}]`;
                    });
                    
                    // Format the fixed object
                    formattedObj = formatToJSON(formattedObj);
                    
                    // Test parse
                    JSON.parse(formattedObj);
                    console.log('Fixed object successfully');
                    return formattedObj;
                } catch (e2) {
                    console.log('Could not fix object:', e2.message);
                    return null;
                }
            }
        }).filter(Boolean);

        // Combine into array
        const validContent = `[${objects.join(',')}]`;

        // Final parse and transform
        console.log('\nParsing final JSON...');
        const swarms = JSON.parse(validContent);
        console.log('Found', swarms.length, 'swarms');

        const transformedSwarms = swarms.map(swarm => {
            // Skip if this is a gallery item or team member
            if (swarm.type === 'image' || (!swarm.id && swarm.name && swarm.picture)) {
                return null;
            }

            if (!swarm || typeof swarm.id !== 'string') {
                console.log('Invalid swarm object:', swarm);
                return null;
            }
            
            return {
                id: swarm.id.replace(/-partner-id$|-inception-id$/, ''),
                image: swarm.image,
                name: swarm.name,
                pool: swarm.pool || '',
                weeklyRevenue: swarm.weeklyRevenue || 0,
                totalRevenue: swarm.totalRevenue || 0,
                gallery: Array.isArray(swarm.gallery) ? swarm.gallery : [],
                description: swarm.description,
                tags: Array.isArray(swarm.tags) ? swarm.tags : [],
                swarmType: swarm.swarmType || '',
                multiple: swarm.multiple || 1,
                launchDate: swarm.launchDate || '',
                revenueShare: swarm.revenueShare || 0,
                wallet: swarm.wallet || '',
                banner: swarm.banner || '',
                socials: swarm.socials || {},
                team: Array.isArray(swarm.team) ? swarm.team : [],
                links: Array.isArray(swarm.links) ? swarm.links : []
            };
        }).filter(Boolean); // Remove null entries

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
