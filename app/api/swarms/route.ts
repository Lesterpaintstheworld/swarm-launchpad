import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET() {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Swarms`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch swarms');
    }

    const data = await response.json();
    
    const swarms = data.records.map((record: any) => ({
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
    }));

    return NextResponse.json(swarms);
  } catch (error) {
    console.error('Error fetching swarms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch swarms' },
      { status: 500 }
    );
  }
}
