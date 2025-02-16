import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Missions?filterByFormula={missionId}="${params.id}"`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error('Airtable response not OK:', await response.text());
      return NextResponse.json({ error: 'Failed to fetch mission' }, { status: response.status });
    }

    const data = await response.json();

    if (!data.records || data.records.length === 0) {
      return NextResponse.json(
        { error: 'Mission not found' }, 
        { status: 404 }
      );
    }

    const record = data.records[0];
    const mission = {
      id: record.fields.missionId,
      title: record.fields.title,
      description: record.fields.description,
      priority: record.fields.priority,
      status: record.fields.status,
      startDate: record.fields.startDate,
      endDate: record.fields.endDate,
      createdAt: record.fields.createdAt,
      leadSwarm: record.fields.leadSwarm,
      participatingSwarms: record.fields.participatingSwarms || [],
      supportingSwarms: record.fields.supportingSwarms || [],
      features: JSON.parse(record.fields.features || '[]'),
      requirements: JSON.parse(record.fields.requirements || '{}'),
      progress: JSON.parse(record.fields.progress || '{}'),
      tags: record.fields.tags || []
    };

    return NextResponse.json(mission);
  } catch (error) {
    console.error('Error in /api/missions/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mission' },
      { status: 500 }
    );
  }
}
