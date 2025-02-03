import 'dotenv/config';

const previewData = {
    records: [
        {
            id: 'kinos-partner-id',
            description: 'The foundational infrastructure swarm powering the entire UBC ecosystem. As the core operating system for autonomous AI, KinOS provides essential runtime services, enabling swarms to operate independently and efficiently.'
        },
        {
            id: 'digitalkin-partner-id',
            description: 'Enterprise-grade AI agents that autonomously handle complex digital tasks. Specializing in R&D, finance, and administrative automation with 24/7 availability.'
        },
        {
            id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
            description: 'AI-powered trading specialist focused on the AI token sector, offering 75% profit sharing and weekly $UBC distributions.'
        },
        {
            id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
            description: 'The guardian of SwarmLaunchpad, combining specialized AI agents to identify, evaluate, and nurture promising AI projects through rigorous vetting and community-aligned value creation.'
        },
        {
            id: '03616e66-a21e-425b-a93b-16d6396e883f',
            description: 'World\'s first autonomous AI band creating original music and content with 100% profit sharing to investors.'
        },
        {
            id: '7d3c9e5b-1f8a-4d3c-b8d4-9e5b1f8a4d3c',
            description: 'Universal AI gaming companion that adapts to any game and playing style for personalized gameplay experiences.'
        },
        {
            id: 'f7a92b3c-d8e4-4c1a-9f5d-1234567890ab',
            description: 'Transform any story idea into a professional screenplay and complete production plan through our AI-powered filmmaking system. From concept to camera-ready, all powered by coordinated AI agents.'
        },
        {
            id: 'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d',
            description: 'Democratizing institutional-grade trading with AI-powered market analysis, whale tracking, and protective features. Empowering everyday investors with professional-level tools and insights.'
        },
        {
            id: 'b2c3d4e5-f6g7-5b6c-9d0e-1f2g3h4i5j6k',
            description: 'Coordinated AI swarm optimizing mental health practice operations and patient care'
        },
        {
            id: 'c3d4e5f6-g7h8-6c7d-ae1f-2g3h4i5j6k7l',
            description: 'An AI publishing system that transforms manuscripts into market-ready books, handling everything from editing to production while maintaining creative quality.'
        },
        {
            id: 'd4e5f6g7-h8i9-7d8e-bf2g-3h4i5j6k7l8m',
            description: 'An AI-powered smart toy that helps children learn through conversation and play, adapting its teaching to each child\'s unique way of understanding.'
        },
        {
            id: 'e5f6g7h8-i9j0-8e9f-cg3h-4i5j6k7l8m9n',
            description: 'AI recruitment swarm reducing time-to-hire while improving candidate quality and fit'
        },
        {
            id: 'f6g7h8i9-j0k1-9f0g-dh4i-5j6k7l8m9n0o',
            description: 'Healthcare operations swarm maximizing patient care through efficient practice management'
        },
        {
            id: 'g7h8i9j0-k1l2-0g1h-ei5j-6k7l8m9n0o1p',
            description: 'AI swarm automating product sourcing, market analysis, and sales optimization to build profitable e-commerce operation'
        },
        {
            id: 'h8i9j0k1-l2m3-1h2i-fj6k-7l8m9n0o1p2q',
            description: 'Autonomous AI swarm revolutionizing affiliate marketing through automated content creation, link optimization, and multi-channel campaign management across specialized niches.'
        },
        {
            id: 'mentor-swarm-id',
            description: 'A smart desk lamp that reads your homework and guides you to answers through thoughtful questions, like having a patient tutor available 24/7.'
        },
        {
            id: 'speaker-swarm-id',
            description: 'Never be caught off guard again. AI-powered training for mastering high-pressure conversations and social scenarios.'
        },
        {
            id: 'travel-swarm-id',
            description: 'AI-powered travel concierge orchestrating perfect journeys through intelligent planning, personalized recommendations, and real-time travel assistance.'
        },
        {
            id: 'grant-swarm-id',
            description: 'AI swarm revolutionizing non-profit funding by automating grant discovery, application writing, and compliance reporting through coordinated AI agents.'
        },
        {
            id: 'resume-swarm-id',
            description: 'AI swarm crafting targeted resumes by analyzing job descriptions, highlighting relevant experience, and optimizing for ATS'
        },
        {
            id: 'forge-partner-id',
            description: 'Development orchestration swarm bridging UBC with technical partners through AI-enhanced project management and quality assurance.'
        },
        {
            id: 'propertykin-inception-id',
            description: 'AI-powered real estate arbitrage bot scanning multiple listing sources to identify undervalued properties and instantly connect them with verified buyers through smart contract escrow.'
        },
        {
            id: 'wealthhive-inception-id',
            description: 'Educational AI swarm democratizing AI investment knowledge through interactive learning and community-driven growth.'
        },
        {
            id: 'altered-alley-inception-id',
            description: 'Creating the foundational infrastructure for autonomous AI agents to interact, collaborate, and generate value through immersive digital spaces.'
        },
        {
            id: 'logicatlas-inception-id',
            description: 'AI-powered supply chain orchestration system optimizing manufacturer-distributor relationships through real-time intelligence and automation.'
        }
    ]
};

// Get environment variables
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = 'Swarms';

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error('Missing required environment variables. Please check your .env file');
    process.exit(1);
}

async function updateSwarmDescription(swarmId, shortDescription) {
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

        // Update the record with the new short description
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
                        shortDescription: shortDescription
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

        for (const record of previewData.records) {
            if (record.id && record.description) {
                await updateSwarmDescription(record.id, record.description);
                // Add a small delay between updates to avoid rate limits
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log('Successfully updated all swarm descriptions');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
