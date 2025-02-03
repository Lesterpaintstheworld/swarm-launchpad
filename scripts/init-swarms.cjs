const { SwarmData } = require('./data/swarms.cjs');
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

async function initializeSwarms() {
    console.log('Starting swarm initialization...');

    for (const swarm of SwarmData) {
        console.log(`\nProcessing swarm ${swarm.name}...`);

        try {
            const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Swarms`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    records: [{
                        fields: {
                            swarmId: swarm.id,
                            name: swarm.name,
                            description: swarm.description,
                            image: swarm.image,
                            pool: swarm.pool || '',
                            weeklyRevenue: swarm.weeklyRevenue || 0,
                            totalRevenue: swarm.totalRevenue || 0,
                            gallery: JSON.stringify(swarm.gallery || []),
                            tags: JSON.stringify(swarm.tags || []),
                            swarmType: swarm.swarmType || '',
                            multiple: swarm.multiple || 1,
                            launchDate: swarm.launchDate || '',
                            revenueShare: swarm.revenueShare || 0,
                            wallet: swarm.wallet || '',
                            banner: swarm.banner || '',
                            socials: JSON.stringify(swarm.socials || {}),
                            team: JSON.stringify(swarm.team || []),
                            links: JSON.stringify(swarm.links || [])
                        }
                    }]
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
            }

            const data = await response.json();
            console.log(`Swarm created: ${swarm.name}`);

            // Add delay between requests to respect Airtable's rate limits
            await sleep(1000);

        } catch (error) {
            console.error('Error creating swarm:', error);
            console.error('Error details:', error.message);
        }
    }

    console.log('\nSwarm initialization completed!');
}

// Run the script
initializeSwarms().catch(console.error);
