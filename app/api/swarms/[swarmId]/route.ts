import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET(
  request: Request,
  { params }: { params: { swarmId: string } }
) {
  const swarmId = params.swarmId;
  console.log('Fetching swarm with ID:', swarmId);

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Swarms?filterByFormula={swarmId}="${swarmId}"`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error('Airtable response not OK:', await response.text());
      throw new Error('Failed to fetch swarm');
    }

    const data = await response.json();
    console.log('Raw Airtable data for swarm:', data);

    if (!data.records || data.records.length === 0) {
      console.error('No swarm found with ID:', swarmId);
      return NextResponse.json(null);
    }

    const record = data.records[0];
    const swarm = {
      id: record.fields.swarmId,
      name: record.fields.name,
      description: record.fields.description || '',
      image: record.fields.image,
      models: record.fields.models ? record.fields.models.split(',').map((m: string) => m.trim()) : [],
      pool: record.fields.pool,
      weeklyRevenue: record.fields.weeklyRevenue || 0,
      totalRevenue: record.fields.totalRevenue || 0,
      gallery: record.fields.gallery ? JSON.parse(record.fields.gallery) : [],
      tags: record.fields.tags ? record.fields.tags.split(',').map((t: string) => t.trim()) : [],
      role: record.fields.role || '',
      swarmType: record.fields.swarmType || 'inception',
      multiple: record.fields.multiple || 1,
      launchDate: record.fields.launchDate || null,
      revenueShare: record.fields.revenueShare || 60,
      wallet: record.fields.wallet || '',
      banner: record.fields.banner || '',
      twitterAccount: record.fields.twitterAccount || '',
      socials: record.fields.socials ? JSON.parse(record.fields.socials) : {},
      achievements: record.fields.achievements ? JSON.parse(record.fields.achievements) : [],
      team: record.fields.team ? JSON.parse(record.fields.team) : [],
      links: record.fields.links ? JSON.parse(record.fields.links) : []
    };

    console.log('Returning swarm data:', swarm);
    return NextResponse.json(swarm);
  } catch (error) {
    console.error('Error fetching swarm:', error);
    return NextResponse.json(
      { error: 'Failed to fetch swarm' },
      { status: 500 }
    );
  }
}
