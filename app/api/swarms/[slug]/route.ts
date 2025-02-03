import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Swarms?filterByFormula={swarmId}="${params.slug}"`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch swarm');
    }

    const data = await response.json();
    
    if (!data.records?.[0]) {
      return NextResponse.json(null);
    }

    const record = data.records[0];
    
    const swarm = {
      id: record.fields.swarmId,
      name: record.fields.name,
      description: record.fields.description,
      image: record.fields.image,
      models: JSON.parse(record.fields.models || '[]'),
      pool: record.fields.pool,
      weeklyRevenue: record.fields.weeklyRevenue,
      totalRevenue: record.fields.totalRevenue,
      gallery: JSON.parse(record.fields.gallery || '[]'),
      tags: JSON.parse(record.fields.tags || '[]'),
      role: record.fields.role,
      swarmType: record.fields.swarmType,
      multiple: record.fields.multiple,
      launchDate: record.fields.launchDate,
      revenueShare: record.fields.revenueShare,
      wallet: record.fields.wallet,
      banner: record.fields.banner,
      twitterAccount: record.fields.twitterAccount,
      socials: JSON.parse(record.fields.socials || '{}'),
      achievements: JSON.parse(record.fields.achievements || '[]'),
      team: JSON.parse(record.fields.team || '[]'),
      links: JSON.parse(record.fields.links || '[]')
    };

    return NextResponse.json(swarm);
  } catch (error) {
    console.error('Error fetching swarm:', error);
    return NextResponse.json(
      { error: 'Failed to fetch swarm' },
      { status: 500 }
    );
  }
}
