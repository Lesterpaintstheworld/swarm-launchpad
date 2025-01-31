import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { SwarmData } from '../data/swarms/info';
import idl from '../data/programs/ubclaunchpad.json';

// Add type assertion for the IDL
const IDL = idl as any;

const HELIUS_RPC = "https://mainnet.helius-rpc.com/?api-key=4c3a5fc2-ea3f-45eb-85d5-2f282a6b4401";
const PROGRAM_ID = new PublicKey('4dWhc3nkP4WeQkv7ws4dAxp6sNTBLCuzhTGTf1FynDcf');

interface HolderInfo {
    wallet: string;
    shares: number;
    percentage: number;
}

interface SwarmHolders {
    swarmId: string;
    swarmName: string;
    pool: string;
    totalShares: number;
    holderCount: number;
    holders: HolderInfo[];
}

async function main() {
    // Connect to Solana
    const connection = new Connection(HELIUS_RPC, 'confirmed');
    
    // Create a dummy provider since we're only reading data
    const provider = new AnchorProvider(
        connection,
        {
            publicKey: PublicKey.default,
            signTransaction: async () => { throw new Error('not implemented') },
            signAllTransactions: async () => { throw new Error('not implemented') },
        },
        { commitment: 'confirmed' }
    );

    // Initialize the program with proper typing
    const program = new Program<Idl>(IDL, PROGRAM_ID, provider);
    
    const results: SwarmHolders[] = [];

    // Process each swarm with a pool
    for (const swarm of SwarmData) {
        if (!swarm.pool) continue;

        try {
            console.log(`\nProcessing ${swarm.name}...`);

            // Get all program accounts for this pool
            const accounts = await connection.getProgramAccounts(
                new PublicKey('4dWhc3nkP4WeQkv7ws4dAxp6sNTBLCuzhTGTf1FynDcf'),
                {
                    filters: [
                        {
                            memcmp: {
                                offset: 8,
                                bytes: swarm.pool
                            }
                        }
                    ]
                }
            );

            const holders: HolderInfo[] = [];
            let totalShares = 0;

            // Process each shareholder account
            for (const account of accounts) {
                const shareholderData = await program.account.shareholder.fetch(account.pubkey);
                const shares = shareholderData.shares.toNumber();
                
                if (shares > 0) {
                    totalShares += shares;
                    holders.push({
                        wallet: account.pubkey.toString(),
                        shares,
                        percentage: 0
                    });
                }
            }

            // Calculate percentages
            holders.forEach(holder => {
                holder.percentage = (holder.shares / totalShares) * 100;
            });

            // Sort by percentage descending
            holders.sort((a, b) => b.percentage - a.percentage);

            results.push({
                swarmId: swarm.id,
                swarmName: swarm.name,
                pool: swarm.pool,
                totalShares,
                holderCount: holders.length,
                holders
            });

            // Log detailed info for each swarm
            console.log(`${swarm.name}:`);
            console.log(`Total Shares: ${totalShares.toLocaleString()}`);
            console.log(`Holder Count: ${holders.length}`);
            console.log('\nTop 10 Holders:');
            holders.slice(0, 10).forEach((holder, index) => {
                console.log(`${index + 1}. ${holder.wallet}`);
                console.log(`   Shares: ${holder.shares.toLocaleString()} (${holder.percentage.toFixed(2)}%)`);
            });
            console.log('-----------------------------------');

        } catch (error) {
            console.error(`Error processing ${swarm.name}:`, error);
        }
    }
    
    // Log final summary
    console.log('\nFinal Summary:');
    results.forEach(result => {
        console.log(`${result.swarmName}: ${result.holderCount} holders, ${result.totalShares.toLocaleString()} total shares`);
    });
}

main().catch(console.error);
