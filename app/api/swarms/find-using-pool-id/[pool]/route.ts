import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET(
  request: Request,
  { params }: { params: { pool: string } }
) {
  try {

    console.log('>>> Fetching swarm with pool id:', params.pool);
    
    // Add logging for the constructed URL and env vars
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Swarms?filterByFormula={pool}="${params.pool}"`;
    console.log('Airtable request URL:', url);
    console.log('Airtable API Key present:', !!AIRTABLE_API_KEY);
    console.log('Airtable Base ID present:', !!AIRTABLE_BASE_ID);

    const response = await fetch(
      url,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
        cache: 'no-store'
      }
    );

    // Add logging for response status
    console.log('Airtable response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable error response:', errorText);
      return NextResponse.json({ error: 'Failed to fetch swarm' }, { status: response.status });
    }

    const data = await response.json();
    console.log('Raw Airtable data:', data);

    if (!data.records || data.records.length === 0) {
      console.log('No swarm found with ID:', params.pool);
      return NextResponse.json(
        { error: 'Swarm not found', poolId: params.pool }, 
        { status: 404 }
      );
    }

    const record = data.records[0];
    const swarm = {
      id: record.fields.swarmId,
      name: record.fields.name,
      description: record.fields.description || '',
      image: record.fields.image,
      models: record.fields.models ? JSON.parse(record.fields.models) : [],
      pool: record.fields.pool,
      weeklyRevenue: record.fields.weeklyRevenue || 0,
      totalRevenue: record.fields.totalRevenue || 0,
      gallery: record.fields.gallery ? JSON.parse(record.fields.gallery) : [],
      tags: record.fields.tags ? record.fields.tags.split(',').map((tag: string) => tag.trim()) : [],
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

    console.log('Returning swarm:', swarm);
    return NextResponse.json(swarm);
  } catch (error) {
    console.error('Error in /api/swarms/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch swarm' },
      { status: 500 }
    );
  }
}
