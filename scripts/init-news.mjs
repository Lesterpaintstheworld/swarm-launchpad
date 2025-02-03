import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROGRAM_ID = new PublicKey("4dWhc3nkP4WeQkv7ws4dAxp6sNTBLCuzhTGTf1FynDcf");
const RPC_URL = "https://api.mainnet-beta.solana.com";

// Simple wallet implementation for provider
class SimpleWallet {
    constructor(payer) {
        this.payer = payer;
    }
    async signTransaction(tx) { return tx; }
    async signAllTransactions(txs) { return txs; }
    get publicKey() { return this.payer.publicKey; }
}

// Calculate share price function
function calculateSharePrice(n) {
    const cycle = Math.floor(n / 5000);
    const base = Math.pow(1.35, cycle);
    return base;
}

// Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Get compute price
async function getComputePrice() {
    try {
        const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana/HiYsmVjeFy4ZLx8pkPSxBjswFkoEjecVGB4zJed2e6Y');
        const data = await response.json();
        if (data.pair?.priceUsd) {
            return parseFloat(data.pair.priceUsd);
        }
    } catch (error) {
        console.error('Error fetching $COMPUTE price:', error);
    }
    return null;
}

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

calculateMetrics().catch(console.error);
