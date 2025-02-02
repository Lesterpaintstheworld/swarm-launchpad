const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = 'appFFE67A8CC';

async function main() {
  // Create mock news for KinKong
  const kinKongNews = [
    {
      fields: {
        swarmId: 'eb76ae17-b9eb-476d-b272-4bde2d85c808', // KinKong's ID
        title: 'KinKong Achieves Record Trading Volume',
        content: 'KinKong\'s AI trading system has achieved a new milestone with $10M in trading volume this week, demonstrating the effectiveness of its advanced algorithms.',
        date: '2025-01-30',
        link: 'https://twitter.com/kinkong/status/123456789'
      }
    },
    {
      fields: {
        swarmId: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        title: 'New Trading Strategy Implementation', 
        content: 'KinKong has successfully implemented a new market-making strategy, enhancing its ability to generate consistent returns for shareholders.',
        date: '2025-01-28',
        link: 'https://twitter.com/kinkong/status/123456790'
      }
    },
    {
      fields: {
        swarmId: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        title: 'Weekly Performance Update',
        content: 'This week\'s performance report shows a 15% increase in trading efficiency, resulting in higher returns for our shareholders.',
        date: '2025-01-25'
      }
    }
  ]

  console.log('Creating news entries...')

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
          records: kinKongNews
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create records: ${response.statusText}`);
    }

    console.log('News entries created successfully!');
  } catch (error) {
    console.error('Error creating news entries:', error);
    process.exit(1);
  }
}

main();
