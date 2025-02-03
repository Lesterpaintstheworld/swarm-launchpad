const { collaborations } = require('./data/collaborations.cjs');
require('dotenv').config();

// Map of service names to their fixed IDs
const SERVICE_IDS = {
  'Development Package': 'xforge-development-package',
  'Essential Swarm Package': 'kinos-essential-package', 
  'Inception Package': 'kinos-inception-package',
  'Active AI Tokens Trading': 'kinkong-trading'
};

// Verify environment variables are loaded
console.log('Environment check:');
console.log('AIRTABLE_API_KEY exists:', !!process.env.AIRTABLE_API_KEY);
console.log('AIRTABLE_BASE_ID exists:', !!process.env.AIRTABLE_BASE_ID);

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function initializeCollaborations() {
    console.log('Starting collaboration initialization...');

    for (const collaboration of collaborations) {
        console.log(`\nProcessing collaboration ${collaboration.id}...`);

        try {
            const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Collaborations`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    records: [{
                        fields: {
                            collaborationId: collaboration.id,
                            sourceSwarmId: collaboration.sourceSwarm.id,
                            targetSwarmId: collaboration.targetSwarm.id,
                            serviceId: SERVICE_IDS[collaboration.serviceName],
                            status: collaboration.status,
                            price: collaboration.price,
                            startDate: collaboration.startDate || '',
                            description: collaboration.description || '',
                            objectives: collaboration.objectives ? JSON.stringify(collaboration.objectives) : '',
                            focus: collaboration.focus || '',
                            sourceSwarmName: collaboration.sourceSwarm.name,
                            targetSwarmName: collaboration.targetSwarm.name,
                            sourceSwarmImage: collaboration.sourceSwarm.image,
                            targetSwarmImage: collaboration.targetSwarm.image
                        }
                    }]
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
            }

            const data = await response.json();
            console.log(`Collaboration created: ${collaboration.sourceSwarm.name} × ${collaboration.targetSwarm.name}`);

            // Add delay between requests to respect Airtable's rate limits
            await sleep(1000);

        } catch (error) {
            console.error('Error creating collaboration:', error);
            console.error('Error details:', error.message);
        }
    }

    console.log('\nCollaboration initialization completed!');
}

// Run the script
initializeCollaborations().catch(console.error);
