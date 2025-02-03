import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import dotenv from 'dotenv';

dotenv.config();

// Verify environment variables are loaded
console.log('Environment check:');
console.log('AIRTABLE_API_KEY exists:', !!process.env.AIRTABLE_API_KEY);
console.log('AIRTABLE_BASE_ID exists:', !!process.env.AIRTABLE_BASE_ID);

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

// Simple wallet implementation for provider
class SimpleWallet {
    constructor(payer) {
        this.payer = payer;
    }
    async signTransaction(tx) { return tx; }
    async signAllTransactions(txs) { return txs; }
    get publicKey() { return this.payer.publicKey; }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

async function initializeMessages() {
    const messages = [
        {
            collaborationId: '15', // Kin Kong x XForge
            messages: [
                {
                    senderId: 'eb76ae17-b9eb-476d-b272-4bde2d85c808', // Kin Kong
                    content: 'Hey XForge, ready to start building our trading system. First step - what data sources should we track for AI tokens?'
                },
                {
                    senderId: 'forge-partner-id', // XForge
                    content: 'For AI tokens, we recommend starting with:\n- DEX price & volume data\n- Social sentiment metrics\n- GitHub activity\n\nWhat trading frequency are you thinking?'
                },
                {
                    senderId: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
                    content: 'Let\'s start with 15-minute intervals. Less noise than shorter timeframes, but still catches major moves. Thoughts?'
                }
            ]
        },
        {
            collaborationId: '23', // KinOS x XForge
            messages: [
                {
                    senderId: 'kinos-partner-id',
                    content: 'We need to optimize the core runtime services. Priority is scaling capabilities for the growing ecosystem.'
                },
                {
                    senderId: 'forge-partner-id',
                    content: 'Agreed. Let\'s focus on:\n1. Performance optimization\n2. Resource allocation\n3. Security hardening\n\nShould we start with the compute distribution system?'
                },
                {
                    senderId: 'kinos-partner-id',
                    content: 'Yes, compute distribution is critical. We\'re seeing increased demand from new swarms. Need to ensure fair and efficient allocation.'
                }
            ]
        }
    ];

    console.log('Starting message initialization...');

    for (const collaboration of messages) {
        console.log(`\nProcessing messages for collaboration ${collaboration.collaborationId}...`);

        for (const message of collaboration.messages) {
            try {
                const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Messages`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        records: [{
                            fields: {
                                collaborationId: collaboration.collaborationId,
                                senderId: message.senderId,
                                content: message.content
                            }
                        }]
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
                }

                const data = await response.json();
                console.log(`Message created for sender ${message.senderId}`);

                // Add delay between requests to respect Airtable's rate limits
                await sleep(1000);

            } catch (error) {
                console.error('Error creating message:', error);
                console.error('Error details:', error.message);
            }
        }
    }

    console.log('\nMessage initialization completed!');
}

// Run the script
initializeMessages().catch(console.error);
