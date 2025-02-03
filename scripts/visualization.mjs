import { createCanvas } from 'canvas';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function generateMarketCapVisualization(swarmMetrics) {
    // Sort swarms by market cap
    const sortedSwarms = swarmMetrics.sort((a, b) => b.marketCap - a.marketCap);
    
    // Canvas setup
    const width = 1600;
    const height = 1000;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Swarm Market Caps', 20, 40);

    // Calculate layout
    const startY = 80;
    const boxHeight = 100;
    const boxPadding = 10;
    const maxBoxWidth = width - 40;

    // Find max market cap for scaling
    const maxMarketCap = Math.max(...sortedSwarms.map(s => s.marketCap));

    // Draw boxes
    sortedSwarms.forEach((swarm, index) => {
        const y = startY + (index * (boxHeight + boxPadding));
        const boxWidth = (swarm.marketCap / maxMarketCap) * maxBoxWidth;

        // Box background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(20, y, boxWidth, boxHeight);

        // Swarm name
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(swarm.name, 30, y + 30);

        // Market cap value
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '14px Arial';
        ctx.fillText(
            `${Math.floor(swarm.marketCap).toLocaleString()} $COMPUTE`, 
            30, 
            y + 55
        );

        // Percentage of total
        const totalMC = sortedSwarms.reduce((sum, s) => sum + s.marketCap, 0);
        const percentage = ((swarm.marketCap / totalMC) * 100).toFixed(1);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '12px Arial';
        ctx.fillText(`${percentage}%`, 30, y + 75);
    });

    // Save the visualization
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(path.join(__dirname, 'market-caps.png'), buffer);
    console.log('\nVisualization saved as market-caps.png');
}
