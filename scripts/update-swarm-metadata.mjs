import 'dotenv/config';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = 'Swarms';

const swarmMetadata = {
  'altered-alley-inception-id': {
    team: [
      {
        name: "Hexidized",
        picture: "/swarms/aialley.avif",
        telegram: "Hexidized",
        X: "hexidized"
      },
      {
        name: "Altered Alley",
        picture: "/swarms/aialley.avif",
        telegram: "AlteredAlley",
        X: "alteredalley"
      },
      {
        name: "Honeycomb Empire",
        picture: "/swarms/aialley.avif",
        X: "HoneycombEmpire"
      }
    ],
    links: [
      {
        name: 'Pitch Deck',
        url: 'https://ai-alley-integration-5wrdhgu.gamma.site/'
      },
      {
        name: 'Spatial Experience 1',
        url: 'https://www.spatial.io/s/Ai-Agents-675f9c30a04dbb712f0e051d?share=2899369617154930294'
      },
      {
        name: 'Spatial Experience 2',
        url: 'https://www.spatial.io/s/AI-63c8a8898ab06ebb400f0d9f?share=5084343558932005183'
      }
    ],
    gallery: [
      {
        type: "image",
        content: "/swarms/aialley.avif"
      },
      {
        type: "image",
        content: "/swarms/alteredalley/6314A9D1-BE8C-4109-BA91-269CB5FA1071_1_105_c.jpeg"
      }
    ]
  },
  'logicatlas-inception-id': {
    team: [
      {
        name: "Derek Lisko",
        picture: "/swarms/logicatlas.jpg",
        telegram: "dereklisko",
        X: "DerekRLisko"
      }
    ],
    socials: {
      twitter: 'LogicAtlas'
    },
    gallery: [
      {
        type: "image",
        content: "/swarms/logicatlas.jpg"
      },
      {
        type: "image",
        content: "/swarms/logicatlas/photo_2025-01-27_18-47-51.jpg"
      },
      {
        type: "image",
        content: "/swarms/logicatlas/photo_2025-01-27_18-47-51 (2).jpg"
      },
      {
        type: "image",
        content: "/swarms/logicatlas/photo_2025-01-27_18-47-51 (3).jpg"
      }
    ]
  },
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
        type: "image",
        content: "/swarms/kinos.png"
      }
    ]
  },
  'forge-partner-id': {
    gallery: [
      {
        type: "image",
        content: "/swarms/XForge/monumental-3d-text-13761-burned-emerging_8N4aVSaARGa-oKYBvEygdQ_CM5ll4MvQX-PV8oerJ4yJw.png"
      },
      {
        type: "image",
        content: "/swarms/XForge/xforge.png"
      }
    ]
  },
  'eb76ae17-b9eb-476d-b272-4bde2d85c808': {
    twitterAccount: "KinKong_ubc",
    gallery: [
      {
        type: "image",
        content: "/swarms/kinkong/1_KinKong-Advanced-AI-Trading-Agent.png"
      },
      {
        type: "image",
        content: "/swarms/kinkong/2_How-KinKong-Works.png"
      },
      {
        type: "image",
        content: "/swarms/kinkong/4_Investment-Structure.png"
      },
      {
        type: "image",
        content: "/swarms/kinkong/5_Development-Roadmap.png"
      },
      {
        type: "image",
        content: "/swarms/kinkong/6_Technical-Integration.png"
      },
      {
        type: "image",
        content: "/swarms/kinkong/7_Transparency-and-Verification.png"
      },
      {
        type: "image",
        content: "/swarms/kinkong/8_Market-Focus.png"
      },
      {
        type: "image",
        content: "/swarms/kinkong/9_Revenue-Distribution-Strategy.png"
      },
      {
        type: "image",
        content: "/swarms/kinkong/10_KinKong-Advanced-AI-Trading-System.png"
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
