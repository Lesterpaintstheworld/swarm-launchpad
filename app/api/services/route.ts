import { NextResponse } from 'next/server';
import type { AirtableRecord, ServiceFields } from '@/types/api';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET() {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Services`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }

    const data = await response.json();
    
    const services = (data.records as AirtableRecord<ServiceFields>[]).map((record) => {
      const service = {
        id: record.fields.serviceId,
        name: record.fields.name,
        description: record.fields.description,
        fullDescription: record.fields.fullDescription,
        basePrice: record.fields.basePrice,
        categories: JSON.parse(record.fields.categories),
        computePerTask: record.fields.computePerTask,
        averageCompletionTime: record.fields.averageCompletionTime,
        capabilities: JSON.parse(record.fields.capabilities),
        serviceType: record.fields.serviceType || 'one-off',
        swarmId: record.fields.swarmId,
        banner: record.fields.banner,
        activeSubscriptions: record.fields.activeSubscriptions || 0
      };
      console.log('API mapped service:', service);
      return service;
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
