import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
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

// Get just the essential swarm data
const swarmPools = [
    { name: 'KinOS', pool: '37u532qgHbjUHic6mQK51jkT3Do7qkWLEUQCx22MDBD8', weeklyRevenue: 460000 },
    { name: 'DigitalKin', pool: 'FM6aFbs9cQ6Jrp3GJPABBVxpLnGFEZZD3tSJ5JGCUsyZ' },
    { name: 'Kin Kong', pool: 'FwJfuUfrX91VH1Li4PJWCNXXRR4gUXLkqbEgQPo6t9fz', weeklyRevenue: 120000 },
    { name: 'Swarm Ventures', pool: '911eRdu96ncdnmEUYA3UQ39gEtE9ueg7UbqycKuKweCG' },
    { name: 'Synthetic Souls', pool: 'CmC2AUuurX19TLBVQbpNct8pmEjaHsRj6o8SLBAVvxAk' },
    { name: 'DuoAI', pool: '68K6BBsPynRbLkjJzdQmKMvTPLaUiKb93BUwbJfjqepS' },
    { name: 'XForge', pool: 'AaFvJBvjuCTs93EVNYqMcK5upiTaTh33SV7q4hjaPFNi', weeklyRevenue: 1600000 }
];

async function calculateMetrics() {
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
            console.log(`  Amount Raised: ${Math.floor(amountRaised).toLocaleString()} $COMPUTE`);
            if (swarm.weeklyRevenue) {
                console.log(`  Weekly Revenue: ${swarm.weeklyRevenue.toLocaleString()} $COMPUTE`);
            }
            console.log('');

        } catch (error) {
            console.error(`Error processing ${swarm.name}:`, error);
        }
    }

    // Log total metrics
    console.log('\nTotal Market Metrics:');
    console.log('====================');
    console.log(`Number of Swarms: ${numSwarms}`);
    console.log(`Total Market Cap: ${totalMarketCap.toLocaleString()} $COMPUTE`);
    console.log(`Total Amount Raised: ${Math.floor(totalAmountRaised).toLocaleString()} $COMPUTE`);
    console.log(`Total Weekly Revenue: ${totalWeeklyRevenue.toLocaleString()} $COMPUTE`);
}

// Run the script
calculateMetrics().catch(console.error);
