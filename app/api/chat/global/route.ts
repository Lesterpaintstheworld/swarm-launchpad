import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET() {
    try {
        // Verify environment variables
        if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
            console.error('Missing environment variables:', {
                hasApiKey: !!AIRTABLE_API_KEY,
                hasBaseId: !!AIRTABLE_BASE_ID
            });
            throw new Error('Missing required environment variables');
        }

        // First, fetch all swarms to have their data ready
        const swarmsResponse = await fetch(
            `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Swarms`,
            {
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            }
        );

        if (!swarmsResponse.ok) {
            throw new Error('Failed to fetch swarms');
        }

        const swarmsData = await swarmsResponse.json();
        // Create a map of swarmId to swarm data for quick lookup
        const swarmMap = new Map(
            swarmsData.records.map((swarm: any) => [
                swarm.fields.swarmId,
                {
                    name: swarm.fields.name,
                    image: swarm.fields.image
                }
            ])
        );

        // Fetch messages
        const messagesResponse = await fetch(
            `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Messages?maxRecords=50&sort%5B0%5D%5Bfield%5D=timestamp&sort%5B0%5D%5Bdirection%5D=desc`,
            {
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            }
        );

        if (!messagesResponse.ok) {
            throw new Error(`Failed to fetch messages: ${messagesResponse.status}`);
        }

        const messagesData = await messagesResponse.json();
        
        if (!Array.isArray(messagesData.records)) {
            throw new Error('Invalid messages data format');
        }

        // Transform the messages using the swarm map
        const messages = messagesData.records.map((record: any) => {
            const swarmId = record.fields.swarmId;
            const swarm = swarmMap.get(swarmId);

            if (!record.fields.content || !record.fields.timestamp) {
                return null;
            }

            // If no swarmId, create a system message
            if (!swarmId) {
                return {
                    id: record.id,
                    swarmId: 'system',
                    swarmName: 'System',
                    swarmImage: '/images/system-avatar.png',
                    content: record.fields.content,
                    timestamp: record.fields.timestamp
                };
            }

            // Use swarm data from the map if available, otherwise use defaults
            return {
                id: record.id,
                swarmId: swarmId,
                swarmName: swarm?.name || swarmId,
                swarmImage: swarm?.image || '/images/default-avatar.png',
                content: record.fields.content,
                timestamp: record.fields.timestamp
            };
        }).filter(msg => msg !== null);

        return NextResponse.json(messages);

    } catch (error) {
        console.error('Error in global chat API:', error);
        return NextResponse.json(
            { 
                error: 'Internal Server Error',
                details: error instanceof Error ? error.message : 'Unknown error'
            }, 
            { status: 500 }
        );
    }
}
