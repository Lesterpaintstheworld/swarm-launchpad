import { NextResponse } from 'next/server';
import { SwarmFields, AirtableRecord } from '@/types/api';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET() {
  try {
    console.log('Fetching swarms from Airtable...');
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
      console.error('Airtable response not OK:', await response.text());
      throw new Error('Failed to fetch swarms');
    }

    const data = await response.json();
    console.log('Raw Airtable data:', data);

    const swarms = data.records.map((record: AirtableRecord<SwarmFields>) => {
      // Helper function to safely parse JSON or return default value
      const safeParseJSON = <T>(str: string | null | undefined, defaultValue: T): T => {
        if (!str) return defaultValue;
        try {
          return JSON.parse(str);
        } catch (e) {
          // If it's a comma-separated string, convert it to array
          if (typeof str === 'string' && str.includes(',')) {
            return str.split(',').map(item => item.trim());
          }
          return defaultValue;
        }
      };

      return {
        id: record.fields.swarmId,
        name: record.fields.name,
        description: record.fields.description || '',
        image: record.fields.image,
        models: safeParseJSON(record.fields.models, []),
        pool: record.fields.pool,
        weeklyRevenue: record.fields.weeklyRevenue || 0,
        totalRevenue: record.fields.totalRevenue || 0,
        gallery: safeParseJSON(record.fields.gallery, []),
        tags: safeParseJSON(record.fields.tags, []),
        role: record.fields.role || '',
        swarmType: record.fields.swarmType || 'inception',
        multiple: record.fields.multiple || 1,
        launchDate: record.fields.launchDate || null,
        revenueShare: record.fields.revenueShare || 60,
        wallet: record.fields.wallet || '',
        banner: record.fields.banner || '',
        twitterAccount: record.fields.twitterAccount || '',
        socials: safeParseJSON(record.fields.socials, {}),
        achievements: safeParseJSON(record.fields.achievements, []),
        team: safeParseJSON(record.fields.team, []),
        links: safeParseJSON(record.fields.links, [])
      };
    });

    console.log('Returning swarms:', swarms); // Debug log
    return NextResponse.json(swarms);
  } catch (error) {
    console.error('Error in /api/swarms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch swarms' },
      { status: 500 }
    );
  }
}
