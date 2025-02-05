import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching news for swarm:', params.id);
    
    // Create filter formula for Airtable
    const filterByFormula = encodeURIComponent(`{swarmId}="${params.id}"`);
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/News?filterByFormula=${filterByFormula}&sort%5B0%5D%5Bfield%5D=date&sort%5B0%5D%5Bdirection%5D=desc`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data = await response.json();
    console.log('Raw news data:', data);

    // Transform Airtable records to our NewsItem format
    const news = data.records.map((record: any) => ({
      id: record.id,
      swarmId: record.fields.swarmId,
      title: record.fields.title,
      content: record.fields.content,
      date: record.fields.date,
      link: record.fields.link
    }));

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json([], { status: 500 });
  }
}
