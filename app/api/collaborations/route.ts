import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET() {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Collaborations`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
        cache: 'no-store'
      }
    );

    const data = await response.json();
    
    const collaborations = data.records.map((record: any) => ({
      id: record.fields.id,
      sourceSwarm: {
        id: record.fields.sourceSwarmId,
        name: record.fields.sourceSwarmName,
        image: record.fields.sourceSwarmImage,
      },
      targetSwarm: {
        id: record.fields.targetSwarmId,
        name: record.fields.targetSwarmName,
        image: record.fields.targetSwarmImage,
      },
      serviceName: record.fields.serviceName,
      status: record.fields.status,
      price: record.fields.price,
      startDate: record.fields.startDate,
      description: record.fields.description,
      objectives: record.fields.objectives ? JSON.parse(record.fields.objectives) : undefined,
      focus: record.fields.focus
    }));

    return NextResponse.json(collaborations);
  } catch (error) {
    console.error('Error fetching collaborations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collaborations' },
      { status: 500 }
    );
  }
}
