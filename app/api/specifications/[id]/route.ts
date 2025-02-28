import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const filterByFormula = encodeURIComponent(`{specificationId}="${params.id}"`);
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Specifications?filterByFormula=${filterByFormula}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch specification');
    }

    const data = await response.json();
    
    if (!data.records?.length) {
      return NextResponse.json(
        { error: 'Specification not found' },
        { status: 404 }
      );
    }

    const specification = {
      id: data.records[0].id,
      ...data.records[0].fields
    };

    return NextResponse.json(specification);
  } catch (error) {
    console.error('Error fetching specification:', error);
    return NextResponse.json(
      { error: 'Failed to fetch specification' },
      { status: 500 }
    );
  }
}
