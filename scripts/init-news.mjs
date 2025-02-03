const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appFFE67A8CC';

if (!AIRTABLE_API_KEY) {
  console.error('Error: AIRTABLE_API_KEY environment variable is not set');
  process.exit(1);
}

// Generate market cap visualization
async function generateMarketCapVisualization(swarmMetrics) {
    // Sort swarms by market cap
    const sortedSwarms = swarmMetrics.sort((a, b) => b.marketCap - a.marketCap);
    
    // Canvas setup
    const width = 1200;
    const height = 800;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Calculate total market cap for scaling
    const totalMC = sortedSwarms.reduce((sum, s) => sum + s.marketCap, 0);
    const totalArea = width * height;

    // Position tracking
    let currentX = 0;
    let currentY = 0;
    let rowHeight = 0;

    for (const swarm of sortedSwarms) {
        // Calculate box size based on market cap proportion
        const boxArea = (swarm.marketCap / totalMC) * totalArea;
        const boxWidth = Math.sqrt(boxArea) * 1.2; // Adjust for better visibility
        const boxHeight = boxWidth;

        // Check if we need to start a new row
        if (currentX + boxWidth > width) {
            currentX = 0;
            currentY += rowHeight;
            rowHeight = 0;
        }

        // Draw box
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(currentX, currentY, boxWidth, boxHeight);

        try {
            // Load and draw swarm image
            const imagePath = path.join(process.cwd(), 'public', swarm.image);
            const img = await loadImage(imagePath);
            ctx.globalAlpha = 0.3;
            ctx.drawImage(img, currentX, currentY, boxWidth, boxHeight);
            ctx.globalAlpha = 1;
        } catch (error) {
            console.error(`Error loading image for ${swarm.name}:`, error);
        }

        // Draw swarm name
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText(swarm.name, currentX + 10, currentY + 25);

        // Draw market cap
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '14px Arial';
        ctx.fillText(
            `${Math.floor(swarm.marketCap).toLocaleString()} $COMPUTE`, 
            currentX + 10, 
            currentY + 45
        );

        // Update position tracking
        currentX += boxWidth;
        rowHeight = Math.max(rowHeight, boxHeight);
    }

    // Save the visualization
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile('market-caps.png', buffer);
    console.log('\nVisualization saved as market-caps.png');
}

async function calculateMetrics() {
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
