import { NewsItem } from '@/types/news';
import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

interface AirtableRecord {
  id: string;
  fields: {
    swarmId: string;
    title: string;
    content: string;
    date: string;
    link?: string;
  };
}

export async function GET(
  request: Request,
  { params }: { params: { swarmId: string } }
) {
  try {
    console.log('Fetching news for swarmId:', params.swarmId);

    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/News?filterByFormula={swarmId}="${params.swarmId}"`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
        cache: 'no-store'
      }
    );

    const data = await response.json();
    console.log('Airtable response:', data);
    
    const news: NewsItem[] = data.records.map((record: AirtableRecord) => ({
      id: record.id,
      swarmId: record.fields.swarmId,
      title: record.fields.title,
      content: record.fields.content,
      date: record.fields.date,
      link: record.fields.link,
    }));

    console.log('Processed news:', news);
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
