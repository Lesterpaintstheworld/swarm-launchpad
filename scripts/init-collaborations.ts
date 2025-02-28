import { collaborations } from '../data/collaborations/collaborations';
import dotenv from 'dotenv';

dotenv.config();

function getServiceId(serviceName: string): string {
  switch(serviceName) {
    case 'Development Package':
      return 'xforge-development-package';
    case 'Essential Swarm Package':
      return 'kinos-essential-package';
    case 'Inception Package':
      return 'kinos-inception-package';
    case 'Active AI Tokens Trading':
      return 'kinkong-trading';
    default:
      return '';
  }
}

// Verify environment variables are loaded
console.log('Environment check:');
console.log('AIRTABLE_API_KEY exists:', !!process.env.AIRTABLE_API_KEY);
console.log('AIRTABLE_BASE_ID exists:', !!process.env.AIRTABLE_BASE_ID);

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

function sleep(ms: number): Promise<void> {
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
                            id: collaboration.id,
                            providerSwarmId: collaboration.providerSwarm.id,
                            clientSwarmId: collaboration.clientSwarm.id,
                            serviceName: collaboration.serviceName,
                            serviceId: getServiceId(collaboration.serviceName),
                            status: collaboration.status,
                            price: collaboration.price,
                            startDate: collaboration.startDate || '',
                            description: collaboration.description || '',
                            objectives: collaboration.objectives ? JSON.stringify(collaboration.objectives) : '',
                            focus: collaboration.focus || ''
                        }
                    }]
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
            }

            const data = await response.json();
            console.log(`Collaboration created: ${collaboration.providerSwarm.name} × ${collaboration.clientSwarm.name}`);

            // Add delay between requests to respect Airtable's rate limits
            await sleep(1000);

        } catch (error) {
            console.error('Error creating collaboration:', error);
            if (error instanceof Error) {
                console.error('Error details:', error.message);
            }
        }
    }

    console.log('\nCollaboration initialization completed!');
}

// Run the script
initializeCollaborations().catch(console.error);
