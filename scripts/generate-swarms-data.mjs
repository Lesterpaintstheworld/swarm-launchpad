import { readFile } from 'fs/promises';

async function main() {
    try {

        // Read the info.tsx file
        console.log('Reading info.tsx file...');
        const infoContent = await readFile('data/swarms/info.tsx', 'utf8');
        
        // Extract the SwarmData array
        const startMarker = 'export const SwarmData: SwarmInfo[] = [';
        const startIndex = infoContent.indexOf(startMarker);
        
        if (startIndex === -1) {
            throw new Error('Could not find start of SwarmData array');
        }

        // Find the first complete swarm object
        let content = infoContent.substring(startIndex + startMarker.length);
        let bracketCount = 1;
        let firstSwarmEnd = 0;
        
        // Find matching closing bracket for first swarm
        for (let i = 0; i < content.length; i++) {
            if (content[i] === '{') bracketCount++;
            if (content[i] === '}') bracketCount--;
            if (bracketCount === 1 && content[i] === '}') {
                firstSwarmEnd = i + 1;
                break;
            }
        }

        // Extract just the first swarm
        const firstSwarm = content.substring(0, firstSwarmEnd);
        console.log('First Swarm Data:');
        console.log(firstSwarm);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
