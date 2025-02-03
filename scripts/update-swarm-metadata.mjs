import 'dotenv/config';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = 'Swarms';

const swarmMetadata = {
  'kinos': {
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
  'digitalkin': {
    gallery: [
      {
        type: "image",
        content: "/swarms/digitalkin/1.png"
      },
      {
        type: "image",
        content: "/swarms/digitalkin/2.png"
      },
      {
        type: "image",
        content: "/swarms/digitalkin/3.png"
      }
    ]
  },
  'kinkong': {
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
  },
  'swarmventures': {
    twitterAccount: "swarmventures",
    gallery: [
      {
        type: "image",
        content: "/swarms/swarmventures/1.jpg"
      },
      {
        type: "image",
        content: "/swarms/swarmventures/2.jpg"
      },
      {
        type: "image",
        content: "/swarms/swarm-ventures.jpg"
      }
    ]
  },
  'syntheticsouls': {
    twitterAccount: "syntheticsouls_",
    gallery: [
      {
        type: "image",
        content: "/swarms/syntheticsouls/Lyra 16-9 web.jpg"
      }
    ]
  },
  'duoai': {
    gallery: [
      {
        type: "image",
        content: "/swarms/duoai.jpg"
      }
    ]
  },
  'xforge': {
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
  'propertykin': {
    gallery: [
      {
        type: "image",
        content: "/swarms/propertykin/1_PropertyKin-The-Future-of-Real-Estate-Arbitrage.png"
      },
      {
        type: "image",
        content: "/swarms/propertykin/2_The-PropertyKin-Advantage-AI-Powered-Contract-Flipping.png"
      },
      {
        type: "image",
        content: "/swarms/propertykin/3_Seize-the-Ground-Floor-A-Market-Untapped.png"
      },
      {
        type: "image",
        content: "/swarms/propertykin/4_Invest-in-the-INCEPTION-SWARM-Early-Access-Exponential-Growth.png"
      },
      {
        type: "image",
        content: "/swarms/propertykin/5_PropertyKin-A-Platform-Built-for-the-Future.png"
      },
      {
        type: "image",
        content: "/swarms/propertykin/6_Join-the-Revolution-Reimagine-Real-Estate-with-PropertyKin.png"
      },
      {
        type: "image",
        content: "/swarms/propertykin/7_Timeline-of-a-Contract-Flip.png"
      }
    ]
  },
  'therapykin': {
    gallery: [
      {
        type: "image",
        content: "/swarms/mental-health.jpg"
      }
    ]
  },
  'publishkin': {
    gallery: [
      {
        type: "image",
        content: "/swarms/book.png"
      }
    ]
  },
  'playwise': {
    gallery: [
      {
        type: "image",
        content: "/swarms/toy.png"
      }
    ]
  },
  'talentkin': {
    gallery: [
      {
        type: "image",
        content: "/swarms/talentaid.jpg"
      }
    ]
  },
  'carehive': {
    gallery: [
      {
        type: "image",
        content: "/swarms/carehive.jpg"
      }
    ]
  },
  'commercenest': {
    gallery: [
      {
        type: "image",
        content: "/swarms/commercenest.jpg"
      }
    ]
  },
  'profitbeeai': {
    gallery: [
      {
        type: "image",
        content: "/swarms/affiliate.jpeg"
      }
    ]
  },
  'deskmate': {
    gallery: [
      {
        type: "image",
        content: "/swarms/mentor.png"
      }
    ]
  },
  'stumped': {
    gallery: [
      {
        type: "image",
        content: "/swarms/stumped.jpg"
      }
    ]
  },
  'travelaidai': {
    gallery: [
      {
        type: "image",
        content: "/swarms/travel.jpeg"
      }
    ]
  },
  'grantkin': {
    gallery: [
      {
        type: "image",
        content: "/swarms/grant.jpeg"
      }
    ]
  },
  'careerkin': {
    gallery: [
      {
        type: "image",
        content: "/swarms/resume.jpeg"
      }
    ]
  },
  'robinhoodagent': {
    gallery: [
      {
        type: "image",
        content: "/swarms/robinhood/1_Robinhood-Agent-Democratizing-AI-Trading.png"
      },
      {
        type: "image",
        content: "/swarms/robinhood/2_What-Robinhood-Agent-Does.png"
      },
      {
        type: "image",
        content: "/swarms/robinhood/3_Investment-Tools-Exclusive-to-Shareholders.png"
      },
      {
        type: "image",
        content: "/swarms/robinhood/4_Core-Mission.png"
      },
      {
        type: "image",
        content: "/swarms/robinhood/6_Security-and-Ethics.png"
      },
      {
        type: "image",
        content: "/swarms/robinhood/7_Technical-Integration.png"
      },
      {
        type: "image",
        content: "/swarms/robinhood/8_Updates-and-Alerts.png"
      },
      {
        type: "image",
        content: "/swarms/robinhood/9_Funding-Goal.png"
      },
      {
        type: "image",
        content: "/swarms/robinhood/10_Join-Robinhood-Agent.png"
      }
    ]
  },
  'studiokin': {
    gallery: [
      {
        type: "image",
        content: "/swarms/screenplay/1_Screenplay-and-Production-Swarm-Redefining-Filmmaking-with-AI.png"
      },
      {
        type: "image",
        content: "/swarms/screenplay/2_Introducing-KinOS-AI-Swarm-for-Filmmaking.png"
      },
      {
        type: "image",
        content: "/swarms/screenplay/3_Why-Invest-Now-A-Ground-Floor-Opportunity.png"
      },
      {
        type: "image",
        content: "/swarms/screenplay/4_Investment-Structure-Inception-Swarm.png"
      },
      {
        type: "image",
        content: "/swarms/screenplay/5_Current-Status-and-Next-Steps.png"
      },
      {
        type: "image",
        content: "/swarms/screenplay/6_Join-Us-in-Building-the-Future-of-Entertainment.png"
      },
      {
        type: "image",
        content: "/swarms/screenplay/7_The-AI-Driven-Future-of-Filmmaking.png"
      },
      {
        type: "image",
        content: "/swarms/screenplay/8_Join-the-Swarm.png"
      }
    ]
  },
  'wealthhive': {
    gallery: [
      {
        type: "image",
        content: "/swarms/wealthhive.png"
      }
    ]
  },
  'aialley': {
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
  'logicatlas': {
    socials: {
      twitter: 'LogicAtlas'
    },
    team: [
      {
        name: "Derek Lisko",
        picture: "/swarms/logicatlas.jpg",
        telegram: "dereklisko",
        X: "DerekRLisko"
      }
    ],
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

    // Prepare the fields object with stringified data
    const fields = {};
    
    if (metadata.links) {
      fields.links = JSON.stringify(metadata.links);
    }
    if (metadata.socials) {
      fields.socials = JSON.stringify(metadata.socials);
    }
    if (metadata.gallery) {
      fields.gallery = JSON.stringify(metadata.gallery);
    }
    if (metadata.team) {
      fields.team = JSON.stringify(metadata.team);
    }

    console.log(`Updating ${swarmId} with fields:`, fields);

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
          fields: fields
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
