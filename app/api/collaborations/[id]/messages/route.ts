import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching messages for collaboration:', params.id);
    
    const filterByFormula = encodeURIComponent(`{collaborationId}="${params.id}"`);
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Messages?filterByFormula=${filterByFormula}&sort%5B0%5D%5Bfield%5D=timestamp&sort%5B0%5D%5Bdirection%5D=asc`;
    
    console.log('Fetching from URL:', url);
    console.log('Using API key:', AIRTABLE_API_KEY ? 'Present' : 'Missing');

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable response not OK:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return NextResponse.json(
        { error: 'Failed to fetch messages', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Raw messages data:', JSON.stringify(data, null, 2));

    if (!data.records) {
      return NextResponse.json({ messages: [] });
    }

    const messages = data.records.map((record: any) => ({
      id: record.id,
      senderId: record.fields.senderId,
      content: record.fields.content,
      timestamp: record.fields.timestamp
    }));

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error in /api/collaborations/[id]/messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { senderId, content } = body;

    if (!senderId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Messages`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [{
          fields: {
            collaborationId: params.id,
            senderId,
            content,
            timestamp: new Date().toISOString()
          }
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create message:', errorText);
      return NextResponse.json(
        { error: 'Failed to create message' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const newMessage = {
      id: data.records[0].id,
      senderId: data.records[0].fields.senderId,
      content: data.records[0].fields.content,
      timestamp: data.records[0].fields.timestamp
    };

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Error in POST /api/collaborations/[id]/messages:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
