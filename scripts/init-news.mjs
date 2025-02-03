const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appFFE67A8CC';

if (!AIRTABLE_API_KEY) {
  console.error('Error: AIRTABLE_API_KEY environment variable is not set');
  process.exit(1);
}

async function main() {
  // Create news for XForge collaborations
  const xForgeCollaborationNews = [
    // KinKong x XForge news
    {
      fields: {
        swarmId: 'eb76ae17-b9eb-476d-b272-4bde2d85c808', // KinKong's ID
        title: 'KinKong Partners with XForge for Advanced Trading System Development',
        content: 'We are excited to announce our technical partnership with XForge to enhance our AI trading algorithms and market analysis systems. This collaboration will focus on optimizing our trading performance and implementing new risk management protocols.',
        date: '2025-02-03'
      }
    },
    // SwarmsVentures x XForge news
    {
      fields: {
        swarmId: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234', // SwarmsVentures' ID
        title: 'SwarmsVentures Teams Up with XForge to Build Next-Gen Project Evaluation Systems',
        content: 'SwarmsVentures has initiated a development partnership with XForge to create sophisticated project evaluation and due diligence systems. This collaboration will enhance our ability to identify and nurture promising AI projects.',
        date: '2025-02-03'
      }
    },
    // Synthetic Souls x XForge news
    {
      fields: {
        swarmId: '03616e66-a21e-425b-a93b-16d6396e883f', // Synthetic Souls' ID
        title: 'Synthetic Souls Announces Technical Partnership with XForge',
        content: 'We\'re thrilled to partner with XForge to develop advanced AI music generation and production systems. This collaboration will focus on creating cutting-edge composition engines and optimizing our distribution mechanisms.',
        date: '2025-02-03'
      }
    }
  ];

  console.log('Creating news entries...');

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/News`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          records: xForgeCollaborationNews
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create records: ${response.statusText}\n${JSON.stringify(errorData, null, 2)}`);
    }

    console.log('News entries created successfully!');
  } catch (error) {
    console.error('Error creating news entries:', error);
    process.exit(1);
  }
}

main();
