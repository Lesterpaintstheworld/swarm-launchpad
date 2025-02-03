import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      console.error('Missing Airtable configuration');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    console.log('Fetching collaboration with id:', params.id);
    
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Collaborations?filterByFormula={id}="${params.id}"`;
    console.log('Fetching from URL:', url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
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
        { error: 'Failed to fetch collaboration' },
        { status: response.status }
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      return NextResponse.json(
        { error: 'Invalid response format' },
        { status: 500 }
      );
    }

    console.log('Received data:', JSON.stringify(data, null, 2));

    if (!data || typeof data !== 'object') {
      console.error('Invalid data format received');
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 500 }
      );
    }

    if (!Array.isArray(data.records)) {
      console.error('No records array in response');
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 500 }
      );
    }

    if (data.records.length === 0) {
      console.log('No collaboration found with ID:', params.id);
      return NextResponse.json(
        { error: 'Collaboration not found' },
        { status: 404 }
      );
    }

    const record = data.records[0];
    
    if (!record.fields) {
      console.error('Record missing fields:', record);
      return NextResponse.json(
        { error: 'Invalid record format' },
        { status: 500 }
      );
    }

    const collaboration = {
      id: record.fields.id,
      providerSwarm: {
        id: record.fields.providerSwarmId,
        name: record.fields.providerSwarmName,
        image: record.fields.providerSwarmImage,
      },
      clientSwarm: {
        id: record.fields.clientSwarmId,
        name: record.fields.clientSwarmName,
        image: record.fields.clientSwarmImage,
      },
      serviceName: record.fields.serviceName,
      status: record.fields.status,
      price: record.fields.price,
      startDate: record.fields.startDate,
      description: record.fields.description,
      objectives: record.fields.objectives ? JSON.parse(record.fields.objectives) : undefined,
      focus: record.fields.focus
    };

    console.log('Returning collaboration:', collaboration);
    return NextResponse.json(collaboration);
  } catch (error) {
    console.error('Error in /api/collaborations/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collaboration' },
      { status: 500 }
    );
  }
}
