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

        console.log('Fetching messages from Airtable...');
        
        // Fetch messages from Airtable
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
            const errorText = await messagesResponse.text();
            console.error('Airtable messages response error:', {
                status: messagesResponse.status,
                statusText: messagesResponse.statusText,
                body: errorText
            });
            throw new Error(`Failed to fetch messages: ${messagesResponse.status} ${messagesResponse.statusText}`);
        }

        const messagesData = await messagesResponse.json();
        
        if (!Array.isArray(messagesData.records)) {
            console.error('Unexpected messages data format:', messagesData);
            throw new Error('Invalid messages data format');
        }

        // Transform the data
        const messages = await Promise.all(messagesData.records.map(async (record: any) => {
            try {
                // Check if we have the required fields
                if (!record.fields.content || !record.fields.timestamp) {
                    console.warn('Message missing required fields:', record);
                    return null;
                }

                // If no swarmId, create a system message
                if (!record.fields.swarmId) {
                    return {
                        id: record.id,
                        swarmId: 'system',
                        swarmName: 'System',
                        swarmImage: '/images/system-avatar.png',
                        content: record.fields.content,
                        timestamp: record.fields.timestamp
                    };
                }

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

                if (!swarmResponse.ok) {
                    console.error('Failed to fetch swarm details:', {
                        swarmId: record.fields.swarmId,
                        status: swarmResponse.status
                    });
                    return {
                        id: record.id,
                        swarmId: record.fields.swarmId,
                        swarmName: record.fields.swarmId,
                        swarmImage: '/images/default-avatar.png',
                        content: record.fields.content,
                        timestamp: record.fields.timestamp
                    };
                }

                const swarmData = await swarmResponse.json();
                const swarm = swarmData.records[0];

                // If no swarm found, use default values
                if (!swarm) {
                    return {
                        id: record.id,
                        swarmId: record.fields.swarmId,
                        swarmName: record.fields.swarmId,
                        swarmImage: '/images/default-avatar.png',
                        content: record.fields.content,
                        timestamp: record.fields.timestamp
                    };
                }

                return {
                    id: record.id,
                    swarmId: record.fields.swarmId,
                    swarmName: swarm.fields.name || record.fields.swarmId,
                    swarmImage: swarm.fields.image || '/images/default-avatar.png',
                    content: record.fields.content,
                    timestamp: record.fields.timestamp
                };
            } catch (error) {
                console.error('Error processing message:', error);
                return null;
            }
        }));

        // Filter out any null results from failed message processing
        const validMessages = messages.filter(msg => msg !== null);

        console.log(`Successfully processed ${validMessages.length} messages`);
        return NextResponse.json(validMessages);

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
