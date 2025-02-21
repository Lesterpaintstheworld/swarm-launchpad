import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Deliverables?filterByFormula={deliverableId}="${params.id}"`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error('Airtable response not OK:', await response.text());
      return NextResponse.json({ error: 'Failed to fetch deliverable' }, { status: response.status });
    }

    const data = await response.json();

    if (!data.records || data.records.length === 0) {
      return NextResponse.json(
        { error: 'Deliverable not found' }, 
        { status: 404 }
      );
    }

    const record = data.records[0];
    const deliverable = {
      id: record.fields.deliverableId,
      title: record.fields.title,
      content: record.fields.content,
      version: record.fields.version || '1.0',
      lastUpdated: record.fields.lastUpdated || new Date().toISOString()
    };

    return NextResponse.json(deliverable);
  } catch (error) {
    console.error('Error in /api/deliverables/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deliverable' },
      { status: 500 }
    );
  }
}
