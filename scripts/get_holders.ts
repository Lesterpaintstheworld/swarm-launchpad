import { Connection, PublicKey } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import fs from 'fs/promises';
import path from 'path';
import { SwarmData } from '../data/swarms/info';
import { getShareholderPDA } from '../hooks/useLaunchpadProgram/utils';

const HELIUS_RPC = `https://mainnet.helius-rpc.com/?api-key=${atob('NGMzYTVmYzItZWEzZi00NWViLTg1ZDUtMmYyODJhNmI0NDAx')}`;

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
    
    const results: SwarmHolders[] = [];

    // Process each swarm with a pool
    for (const swarm of SwarmData) {
        if (!swarm.pool) continue;

        try {
            console.log(`Processing ${swarm.name}...`);

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
                const shareholderData = await Program.account.shareholder.fetch(account.pubkey);
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

            // Log progress with holder count
            console.log(`${swarm.name}: ${holders.length} holders found`);

        } catch (error) {
            console.error(`Error processing ${swarm.name}:`, error);
        }
    }

    // Write results to file
    const outputPath = path.join(process.cwd(), 'app/api/claim/holders.json');
    await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
    
    // Log final summary
    console.log('\nFinal Summary:');
    results.forEach(result => {
        console.log(`${result.swarmName}: ${result.holderCount} holders, ${result.totalShares.toLocaleString()} total shares`);
    });
    
    console.log('\nDone! Results written to holders.json');
}

main().catch(console.error);
