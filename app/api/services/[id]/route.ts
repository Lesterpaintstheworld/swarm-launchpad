import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Services?filterByFormula={serviceId}="${params.id}"`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error('Airtable response not OK:', await response.text());
      throw new Error('Failed to fetch service');
    }

    const data = await response.json();
    
    if (!data.records || data.records.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const record = data.records[0];
    
    // Helper function to safely parse JSON
    const safeParseJSON = <T>(str: string | null | undefined, defaultValue: T): T => {
      if (!str) return defaultValue;
      try {
        return JSON.parse(str);
      } catch (e) {
        if (typeof str === 'string' && str.includes(',')) {
          return str.split(',').map(item => item.trim());
        }
        return defaultValue;
      }
    };

    const service = {
      id: record.fields.serviceId,
      name: record.fields.name,
      description: record.fields.description,
      serviceType: record.fields.serviceType || 'one-off',
      banner: record.fields.banner,
      swarmId: record.fields.swarmId,
      categories: safeParseJSON(record.fields.categories, []),
      computePerTask: record.fields.computePerTask || 0,
      activeSubscriptions: record.fields.activeSubscriptions || 0,
      capabilities: safeParseJSON(record.fields.capabilities, []),
      fullDescription: record.fields.fullDescription || ''
    };

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error in /api/services/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}
