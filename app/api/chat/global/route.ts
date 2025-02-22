import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET() {
    try {
        // Verify environment variables
        if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
            console.error('Missing environment variables');
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
                    name: swarm.fields.name as string,
                    image: swarm.fields.image as string
                }
            ])
        );

        // Define the type for swarm data
        type SwarmData = {
            name: string;
            image: string;
        };

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
            const senderId = record.fields.senderId;
            const receiverId = record.fields.receiverId;
            const sender = swarmMap.get(senderId) as SwarmData | undefined;
            const receiver = swarmMap.get(receiverId) as SwarmData | undefined;

            if (!record.fields.content || !record.fields.timestamp) {
                return null;
            }

            // If no senderId, create a system message
            if (!senderId) {
                return {
                    id: record.id,
                    swarmId: 'system',
                    swarmName: 'System',
                    swarmImage: '/images/system-avatar.png',
                    content: record.fields.content,
                    timestamp: record.fields.timestamp
                };
            }

            // Use sender's data for the message display
            return {
                id: record.id,
                swarmId: senderId,
                swarmName: sender?.name || senderId,
                swarmImage: sender?.image || '/images/default-avatar.png',
                receiverId: receiverId,
                receiverName: receiver?.name,
                receiverImage: receiver?.image || '/images/default-avatar.png',
                content: record.fields.content,
                timestamp: record.fields.timestamp
            };
        }).filter((msg: any) => msg !== null);

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
