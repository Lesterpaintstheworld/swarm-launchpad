import 'dotenv/config';
import { description as affiliateDescription } from '../data/swarms/descriptions/affiliate.ts';

// Get environment variables
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = 'Swarms';

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error('Missing required environment variables. Please check your .env file');
    process.exit(1);
}

const descriptions = {
    'profitbeeai': affiliateDescription,
    // Add more mappings as we add more description files
};

async function updateSwarmDescription(swarmId, fullDescription) {
    try {
        // First, find the record ID by querying with swarmId
        const findResponse = await fetch(
            `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?filterByFormula={swarmId}="${swarmId}"`,
            {
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_API_KEY}`
                }
            }
        );

        if (!findResponse.ok) {
            throw new Error(`Failed to find record: ${findResponse.statusText}`);
        }

        const findData = await findResponse.json();
        if (!findData.records || findData.records.length === 0) {
            console.warn(`No record found for swarmId: ${swarmId}`);
            return;
        }

        const recordId = findData.records[0].id;

        // Update the record with the new description
        const updateResponse = await fetch(
            `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}/${recordId}`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fields: {
                        description: fullDescription
                    }
                })
            }
        );

        if (!updateResponse.ok) {
            throw new Error(`Failed to update record: ${updateResponse.statusText}`);
        }

        console.log(`Updated description for swarm: ${swarmId}`);
        return await updateResponse.json();
    } catch (error) {
        console.error(`Error updating swarm ${swarmId}:`, error);
        throw error;
    }
}

async function main() {
    try {
        console.log('Starting description updates...');

        for (const [swarmId, description] of Object.entries(descriptions)) {
            await updateSwarmDescription(swarmId, description);
            // Add a small delay between updates to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('Successfully updated all swarm descriptions');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
