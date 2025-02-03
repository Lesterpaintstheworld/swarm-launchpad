import 'dotenv/config';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = 'Swarms';

const swarmMetadata = {
  'kinos-partner-id': {
    links: [
      { label: 'Documentation', url: 'https://docs.universalbasiccompute.ai' },
      { label: 'GitHub', url: 'https://github.com/ubcaip' }
    ],
    socials: {
      website: 'https://universalbasiccompute.ai',
      twitter: 'UniversalBasicAI',
      telegram: 'universalbasiccompute',
      telegramChannel: 'ubcannouncements',
      discord: 'universalbasiccompute',
      dexscreener: 'https://dexscreener.com/solana/HiYsmVjeFy4ZLx8pkPSxBjswFkoEjecVGB4zJed2e6Y'
    },
    gallery: [
      {
        type: 'image',
        content: '/swarms/kinos/gallery/1.png'
      },
      {
        type: 'image',
        content: '/swarms/kinos/gallery/2.png'
      }
    ],
    team: [
      {
        name: "Alex Chen",
        role: "Lead Developer",
        image: "/team/alex.jpg",
        twitter: "alexchen_dev"
      },
      {
        name: "Sarah Johnson",
        role: "AI Architect",
        image: "/team/sarah.jpg",
        twitter: "sarahj_ai"
      }
    ]
  },
  'xforge-partner-id': {
    links: [
      { label: 'Portfolio', url: 'https://xforge.universalbasiccompute.ai' }
    ],
    socials: {
      twitter: 'xforge_ubc',
      telegram: 'xforgeubc'
    },
    gallery: [
      {
        type: 'image',
        content: '/swarms/xforge/gallery/1.png'
      }
    ],
    team: [
      {
        name: "Michael Zhang",
        role: "Technical Lead",
        image: "/team/michael.jpg",
        twitter: "mzhang_dev"
      }
    ]
  }
};

async function updateSwarmMetadata(swarmId, metadata) {
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

    // Update the record with the new metadata
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
            links: JSON.stringify(metadata.links || []),
            socials: JSON.stringify(metadata.socials || {}),
            gallery: JSON.stringify(metadata.gallery || []),
            team: JSON.stringify(metadata.team || [])
          }
        })
      }
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Failed to update record: ${updateResponse.statusText}\n${errorText}`);
    }

    console.log(`Updated metadata for swarm: ${swarmId}`);
    return await updateResponse.json();
  } catch (error) {
    console.error(`Error updating swarm ${swarmId}:`, error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Starting metadata updates...');

    for (const [swarmId, metadata] of Object.entries(swarmMetadata)) {
      console.log(`Processing ${swarmId}...`);
      await updateSwarmMetadata(swarmId, metadata);
      // Add a small delay between updates to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Successfully updated all swarm metadata');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
