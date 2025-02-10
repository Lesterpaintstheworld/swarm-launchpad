import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET() {
    try {
        // Fetch messages from Airtable
        const response = await fetch(
            `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Messages?maxRecords=50&sort%5B0%5D%5Bfield%5D=timestamp&sort%5B0%5D%5Bdirection%5D=desc`,
            {
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }

        const data = await response.json();

        // Transform the data
        const messages = await Promise.all(data.records.map(async (record: any) => {
            // Fetch swarm details
            const swarmResponse = await fetch(
                `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Swarms?filterByFormula={swarmId}="${record.fields.swarmId}"`,
                {
                    headers: {
                        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store'
                }
            );

            const swarmData = await swarmResponse.json();
            const swarm = swarmData.records[0];

            return {
                id: record.id,
                swarmId: record.fields.swarmId,
                swarmName: swarm?.fields.name || 'Unknown Swarm',
                swarmImage: swarm?.fields.image || '',
                content: record.fields.content,
                timestamp: record.fields.timestamp
            };
        }));

        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error in global chat API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
