import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateMarketCapVisualization } from './visualization.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const idlModule = await import('../data/programs/ubclaunchpad.json', {
    assert: { type: 'json' }
});
const UbclaunchpadIDL = idlModule.default;

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

// Get just the essential swarm data
const swarmPools = [
    { name: 'KinOS', pool: '37u532qgHbjUHic6mQK51jkT3Do7qkWLEUQCx22MDBD8', weeklyRevenue: 460000 },
    { name: 'DigitalKin', pool: 'FM6aFbs9cQ6Jrp3GJPABBVxpLnGFEZZD3tSJ5JGCUsyZ' },
    { name: 'Kin Kong', pool: 'FwJfuUfrX91VH1Li4PJWCNXXRR4gUXLkqbEgQPo6t9fz', weeklyRevenue: 120000 },
    { name: 'Swarm Ventures', pool: '911eRdu96ncdnmEUYA3UQ39gEtE9ueg7UbqycKuKweCG' },
    { name: 'Synthetic Souls', pool: 'CmC2AUuurX19TLBVQbpNct8pmEjaHsRj6o8SLBAVvxAk' },
    { name: 'DuoAI', pool: '68K6BBsPynRbLkjJzdQmKMvTPLaUiKb93BUwbJfjqepS' },
    { name: 'XForge', pool: 'AaFvJBvjuCTs93EVNYqMcK5upiTaTh33SV7q4hjaPFNi', weeklyRevenue: 1600000 },
    { name: 'PropertyKin', pool: '6HnxTkNhQaoYRkPyZD1zTH5WBvFGLes5X2vrH66roa5G' },
    { name: 'TherapyKin', pool: '5wWLpeH2DDrAS9Lxx1nGnwtMTvu7U9txf4BuXxdN6V6H' },
    { name: 'PublishKin', pool: 'Dt7iwGTgRVZGV2NZFvNtrWVNX77s8ejGdhB2XaR4DxX6' },
    { name: 'PlayWise', pool: '2iAarCWnsdFqddprxzUwmaLiozHarMTpzLdhJPbi2HRR' },
    { name: 'TalentKin', pool: 'DTFE1peg5aNe8gFuaT9KZe8TJ4RHks9prpd12iUBKwi4' },
    { name: 'CareHive', pool: 'FHXsVnEfqHQBQS6An4icuSD5ewwn5WWkoj2LWRMGw4mb' },
    { name: 'CommerceNest', pool: '9hAfNquoNDbvzcEc1rBG8JzbWRskAsjKm7sYbarRfxyj' },
    { name: 'ProfitBeeAI', pool: '7AEP5qWyPF92Wgv6tLCwe51e8yrF3WwSzSef5Vg7RQt4' },
    { name: 'DeskMate', pool: 'Gucj554x7dRebtfUBxK1XTBUhQmq2Rqp4v2H6WtL7wNX' },
    { name: 'STUMPED', pool: '5wL5rah4gWqbbv74vWvsmqqEf99uhRLr3jNPsMcw5imN' },
    { name: 'TravelAId', pool: 'BEsb73xDJH3PrRGs1D4zkPAssg94Yi8dAtiFa59gzeY1' },
    { name: 'GrantKin', pool: '3oa4GKg3hpavEAEacDUKJQoA12VPvRE1CKoHypBho2Rt' },
    { name: 'CareerKin', pool: 'EMtoBMEn6JtV9tnbF8ZVVrxnYZbdapWAYEzabq7cW2gR' },
    { name: 'Robinhood Agent', pool: 'H7xCtjoCyqf55uc5nmPKpypN82jANkRDTNmPx6C3XhS5' },
    { name: 'StudioKin', pool: 'EJ4Ad3faa43JLZW3HQnxweYFqm4T2cUzBGntG5KnJWE8' },
    { name: 'WealthHive', pool: 'HeR7qoPbvmgcLFywkduZ27Hr2wKYuxtVkTBaGhVohP88' },
    { name: 'AI Alley', pool: 'DmdtWBcEwWr15MCm9Wa8iB8EJhHPK9NydiuLptuvMBxj' },
    { name: 'LogicAtlas', pool: '9pMb8Ez61vh3YRKKKrkdA5MthswuNE6Bzj9KYPEVCFme' }
];

export async function calculateMetrics() {
    // Setup connection and provider
    const connection = new Connection(RPC_URL);
    const wallet = new SimpleWallet(Keypair.generate());
    const provider = new AnchorProvider(connection, wallet, {
        commitment: 'confirmed'
    });

    // Create program
    const program = new Program(
        { ...UbclaunchpadIDL, address: PROGRAM_ID.toBase58() },
        provider
    );

    let totalMarketCap = 0;
    let totalAmountRaised = 0;
    let totalWeeklyRevenue = 0;
    const numSwarms = swarmPools.length;
    const swarmMetrics = [];

    // Get $COMPUTE price once at the start
    console.log('Fetching $COMPUTE price...');
    const computePrice = await getComputePrice();
    if (computePrice) {
        console.log(`Current $COMPUTE price: $${computePrice.toFixed(4)}\n`);
    } else {
        console.log('Unable to fetch $COMPUTE price. Will show only $COMPUTE values.\n');
    }

    console.log('Calculating market metrics...\n');

    for (const swarm of swarmPools) {

        try {
            // Fetch pool data
            const poolPubkey = new PublicKey(swarm.pool);
            const poolData = await program.account.pool.fetch(poolPubkey);
            
            // Calculate sold shares and current price
            const totalShares = poolData.totalShares.toNumber();
            const availableShares = poolData.availableShares.toNumber();
            const soldShares = totalShares - availableShares;
            const currentPrice = calculateSharePrice(soldShares);
            
            // Calculate market cap
            const marketCap = soldShares * currentPrice;
            totalMarketCap += marketCap;

            // Add metrics to array for visualization
            swarmMetrics.push({
                name: swarm.name,
                marketCap: marketCap,
                image: `/swarms/${swarm.name.toLowerCase().replace(/\s+/g, '')}.png`
            });

            // Calculate amount raised
            let amountRaised = 0;
            for (let i = 0; i < soldShares; i++) {
                const cycle = Math.floor(i / 5000);
                const base = Math.pow(1.35, cycle);
                amountRaised += base;
            }
            totalAmountRaised += amountRaised;

            // Add weekly revenue if available
            if (swarm.weeklyRevenue) {
                totalWeeklyRevenue += swarm.weeklyRevenue;
            }

            // Log individual swarm metrics
            console.log(`${swarm.name}:`);
            console.log(`  Market Cap: ${marketCap.toLocaleString()} $COMPUTE`);
            if (computePrice) {
                console.log(`            $${(marketCap * computePrice).toLocaleString()}`);
            }
            
            console.log(`  Amount Raised: ${Math.floor(amountRaised).toLocaleString()} $COMPUTE`);
            if (computePrice) {
                console.log(`                $${(Math.floor(amountRaised) * computePrice).toLocaleString()}`);
            }
            
            if (swarm.weeklyRevenue) {
                console.log(`  Weekly Revenue: ${swarm.weeklyRevenue.toLocaleString()} $COMPUTE`);
                if (computePrice) {
                    console.log(`                 $${(swarm.weeklyRevenue * computePrice).toLocaleString()}`);
                }
            }
            console.log('');

            // Add delay between calls
            await sleep(2000); // 2 second delay

        } catch (error) {
            console.error(`Error processing ${swarm.name}:`, error);
        }
    }

    // Log total metrics
    console.log('\nTotal Market Metrics:');
    console.log('====================');
    console.log(`Number of Swarms: ${numSwarms}`);
    
    console.log(`Total Market Cap: ${totalMarketCap.toLocaleString()} $COMPUTE`);
    if (computePrice) {
        console.log(`                $${(totalMarketCap * computePrice).toLocaleString()}`);
    }
    
    console.log(`Total Amount Raised: ${Math.floor(totalAmountRaised).toLocaleString()} $COMPUTE`);
    if (computePrice) {
        console.log(`                   $${(Math.floor(totalAmountRaised) * computePrice).toLocaleString()}`);
    }
    
    console.log(`Total Weekly Revenue: ${totalWeeklyRevenue.toLocaleString()} $COMPUTE`);
    if (computePrice) {
        console.log(`                    $${(totalWeeklyRevenue * computePrice).toLocaleString()}`);
    }

    // Generate visualization
    await generateMarketCapVisualization(swarmMetrics);
}

// Run the script
calculateMetrics().catch(console.error);
