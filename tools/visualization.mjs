import { createCanvas, loadImage } from 'canvas';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateMarketCapVisualization(swarmMetrics) {
    try {
        // Sort swarms by market cap
        const sortedSwarms = swarmMetrics.sort((a, b) => b.marketCap - a.marketCap);
        
        // Canvas setup
        const width = 2400;
        const height = 1600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);

        // Calculate total market cap
        const totalMarketCap = sortedSwarms.reduce((sum, s) => sum + s.marketCap, 0);

        // Layout calculation
        const padding = 40;
        const startY = 120;
        const availableWidth = width - (padding * 2);
        const availableHeight = height - startY - padding;
        const columns = 4; // Fixed number of columns
        const rows = Math.ceil(sortedSwarms.length / columns);
        const boxWidth = availableWidth / columns;
        const boxHeight = availableHeight / rows;

        for (let i = 0; i < sortedSwarms.length; i++) {
            const swarm = sortedSwarms[i];
            const row = Math.floor(i / columns);
            const col = i % columns;
            const x = padding + (col * boxWidth);
            const y = startY + (row * boxHeight);

            try {
                // Draw box background
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.fillRect(x, y, boxWidth - padding/2, boxHeight - padding/2);

                // Try to load and draw swarm image
                try {
                    const imagePath = path.join(process.cwd(), 'public', swarm.image);
                    const img = await loadImage(imagePath);
                    ctx.globalAlpha = 0.3;
                    ctx.drawImage(img, x, y, boxWidth - padding/2, boxHeight - padding/2);
                    ctx.globalAlpha = 1.0;
                } catch (imgError) {
                    console.warn(`Could not load image for ${swarm.name}:`, imgError);
                }

                // Add gradient overlay
                const gradient = ctx.createLinearGradient(x, y, x, y + boxHeight);
                gradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
                ctx.fillStyle = gradient;
                ctx.fillRect(x, y, boxWidth - padding/2, boxHeight - padding/2);

                // Draw swarm name
                ctx.fillStyle = 'white';
                ctx.font = 'bold 32px Arial';
                ctx.fillText(swarm.name, x + 20, y + 50);

                // Draw market cap
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.font = '24px Arial';
                ctx.fillText(
                    `${Math.floor(swarm.marketCap).toLocaleString()} $COMPUTE`,
                    x + 20,
                    y + 90
                );

                // Draw percentage
                const percentage = ((swarm.marketCap / totalMarketCap) * 100).toFixed(1);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.font = '20px Arial';
                ctx.fillText(
                    `${percentage}%`,
                    x + 20,
                    y + 120
                );

            } catch (error) {
                console.error(`Error processing ${swarm.name}:`, error);
            }
        }

        // Save the visualization
        const buffer = canvas.toBuffer('image/png');
        await fs.writeFile(path.join(__dirname, 'market-caps.png'), buffer);
        console.log('\nVisualization saved as market-caps.png');

    } catch (error) {
        console.error('Error generating visualization:', error);
    }
}
import { createCanvas, loadImage } from 'canvas';
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
    const width = 2400; // Increased canvas size
    const height = 1600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial'; // Larger title
    ctx.fillText('Swarm Market Caps', 40, 80);

    // Calculate total market cap for scaling
    const totalMarketCap = sortedSwarms.reduce((sum, s) => sum + s.marketCap, 0);

    // Layout calculation
    const padding = 40;
    const startY = 120;
    const availableWidth = width - (padding * 2);
    const availableHeight = height - startY - padding;

    // Calculate positions using a simple treemap algorithm
    let currentX = padding;
    let currentY = startY;
    let rowHeight = 0;
    let rowWidth = 0;

    for (const swarm of sortedSwarms) {
        // Calculate box size based on market cap proportion
        const area = (swarm.marketCap / totalMarketCap) * (availableWidth * availableHeight);
        const boxSize = Math.sqrt(area);

        // Check if we need to start a new row
        if (currentX + boxSize > width - padding) {
            currentX = padding;
            currentY += rowHeight;
            rowHeight = 0;
        }

        try {
            // Load and draw swarm image
            const imagePath = path.join(process.cwd(), 'public', swarm.image);
            const img = await loadImage(imagePath);

            // Draw box background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(currentX, currentY, boxSize, boxSize);

            // Draw image with opacity
            ctx.globalAlpha = 0.3;
            ctx.drawImage(img, currentX, currentY, boxSize, boxSize);
            ctx.globalAlpha = 1.0;

            // Add gradient overlay
            const gradient = ctx.createLinearGradient(currentX, currentY, currentX, currentY + boxSize);
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
            ctx.fillStyle = gradient;
            ctx.fillRect(currentX, currentY, boxSize, boxSize);

            // Draw swarm name
            ctx.fillStyle = 'white';
            ctx.font = 'bold 32px Arial'; // Larger font
            ctx.fillText(swarm.name, currentX + 20, currentY + 50);

            // Draw market cap
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '24px Arial'; // Larger font
            ctx.fillText(
                `${Math.floor(swarm.marketCap).toLocaleString()} $COMPUTE`,
                currentX + 20,
                currentY + 90
            );

            // Draw percentage
            const percentage = ((swarm.marketCap / totalMarketCap) * 100).toFixed(1);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '20px Arial';
            ctx.fillText(
                `${percentage}%`,
                currentX + 20,
                currentY + 120
            );

            // Update position tracking
            currentX += boxSize;
            rowHeight = Math.max(rowHeight, boxSize);

        } catch (error) {
            console.error(`Error processing ${swarm.name}:`, error);
        }
    }

    // Save the visualization
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(path.join(__dirname, 'market-caps.png'), buffer);
    console.log('\nVisualization saved as market-caps.png');
}
