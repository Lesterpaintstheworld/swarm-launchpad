const { services } = require('./data/services.cjs');
require('dotenv').config();

// Verify environment variables are loaded
console.log('Environment check:');
console.log('AIRTABLE_API_KEY exists:', !!process.env.AIRTABLE_API_KEY);
console.log('AIRTABLE_BASE_ID exists:', !!process.env.AIRTABLE_BASE_ID);

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function initializeServices() {
    console.log('Starting service initialization...');

    for (const service of services) {
        console.log(`\nProcessing service ${service.id}...`);

        try {
            const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Services`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    records: [{
                        fields: {
                            serviceId: service.id,
                            name: service.name,
                            description: service.description,
                            fullDescription: service.fullDescription,
                            basePrice: service.basePrice,
                            categories: JSON.stringify(service.categories),
                            providers: JSON.stringify(service.providers),
                            computePerTask: service.computePerTask,
                            averageCompletionTime: service.averageCompletionTime,
                            capabilities: JSON.stringify(service.capabilities),
                            serviceType: service.serviceType,
                            swarmId: service.swarmId,
                            banner: service.banner || '',
                            activeSubscriptions: service.activeSubscriptions || 0
                        }
                    }]
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
            }

            const data = await response.json();
            console.log(`Service created: ${service.name}`);

            // Add delay between requests to respect Airtable's rate limits
            await sleep(1000);

        } catch (error) {
            console.error('Error creating service:', error);
            console.error('Error details:', error.message);
        }
    }

    console.log('\nService initialization completed!');
}

// Run the script
initializeServices().catch(console.error);
