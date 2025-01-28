import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, setProvider } from "@coral-xyz/anchor";
import { SwarmData } from "../data/swarms/info";
import * as fs from 'fs';
import * as path from 'path';
import { NodeWallet } from "@coral-xyz/anchor/dist/cjs/provider";
import { Keypair } from "@solana/web3.js";

const PROGRAM_ID = "4dWhc3nkP4WeQkv7ws4dAxp6sNTBLCuzhTGTf1FynDcf";
const RPC_URL = "https://api.mainnet-beta.solana.com";

async function main() {
    // Setup connection and provider
    const connection = new Connection(RPC_URL);
    const wallet = new NodeWallet(Keypair.generate()); // Read-only wallet
    const provider = new AnchorProvider(connection, wallet, {});
    setProvider(provider);

    // Load the program
    const programId = new PublicKey(PROGRAM_ID);
    const program = await Program.at(programId, provider);

    // Process each swarm
    for (const swarm of SwarmData) {
        if (!swarm.pool) continue;

        try {
            // Fetch pool data
            const poolPubkey = new PublicKey(swarm.pool);
            const poolData = await program.account.pool.fetch(poolPubkey);
            
            // Calculate sold shares
            const totalShares = poolData.totalShares.toNumber();
            const availableShares = poolData.availableShares.toNumber();
            const soldShares = totalShares - availableShares;
            
            // Calculate cycle and base price
            const cycle = Math.floor(soldShares / 5000);
            const multiple = Math.pow(1.35, cycle);
            
            console.log(`${swarm.name}: ${multiple}x multiple (${soldShares} shares sold)`);
            
            // Update the multiple in SwarmData
            swarm.multiple = Math.floor(multiple * 100) / 100; // Round to 2 decimal places
        } catch (error) {
            console.error(`Error processing ${swarm.name}:`, error);
        }
    }

    // Write updated data back to file
    const filePath = path.join(__dirname, '../data/swarms/info.tsx');
    const fileContent = `export const SwarmData = ${JSON.stringify(SwarmData, null, 2)};`;
    fs.writeFileSync(filePath, fileContent);

    console.log('Multiples updated successfully!');
}

main().catch(console.error);
