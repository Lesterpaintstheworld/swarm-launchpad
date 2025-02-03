import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Collaborations?filterByFormula={id}="${params.id}"`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
        cache: 'no-store'
      }
    );

    const data = await response.json();
    
    if (!data.records.length) {
      return NextResponse.json(null);
    }

    const record = data.records[0];
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

    return NextResponse.json(collaboration);
  } catch (error) {
    console.error('Error fetching collaboration:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collaboration' },
      { status: 500 }
    );
  }
}
