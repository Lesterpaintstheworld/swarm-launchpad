import { NextResponse } from 'next/server';
import { ServiceName } from '@/data/collaborations/collaborations';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

// Type guard to validate service names
function isValidServiceName(name: string | undefined): name is ServiceName {
  const validNames = [
    'Development Package',
    'Essential Swarm Package',
    'Inception Package',
    'Active AI Tokens Trading'
  ];
  return !!name && validNames.includes(name);
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching collaboration with id:', params.id);
    
    const filterByFormula = encodeURIComponent(`{id}="${params.id}"`);
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Collaborations?filterByFormula=${filterByFormula}`;
    
    console.log('Fetching from URL:', url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable response not OK:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return NextResponse.json(
        { error: 'Failed to fetch collaboration' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Raw Airtable data:', JSON.stringify(data, null, 2));

    if (!data.records || data.records.length === 0) {
      console.log('No collaboration found with ID:', params.id);
      return NextResponse.json(
        { error: 'Collaboration not found' },
        { status: 404 }
      );
    }

    const record = data.records[0];
    console.log('Raw record fields:', JSON.stringify(record.fields, null, 2));

    // Check for both serviceName and serviceId fields
    let serviceName = record.fields.serviceName;
    if (!serviceName && record.fields.serviceId) {
      // Map serviceId to serviceName if needed
      const serviceIdToName: Record<string, ServiceName> = {
        'xforge-development-package': 'Development Package',
        'kinos-essential-package': 'Essential Swarm Package',
        'kinos-inception-package': 'Inception Package',
        'kinkong-trading': 'Active AI Tokens Trading'
      };
      serviceName = serviceIdToName[record.fields.serviceId];
    }

    // Validate service name
    if (!isValidServiceName(serviceName)) {
      console.error('Invalid service name:', {
        serviceName,
        serviceId: record.fields.serviceId,
        availableFields: Object.keys(record.fields)
      });
      return NextResponse.json(
        { 
          error: 'Invalid service configuration',
          details: {
            receivedServiceName: serviceName,
            serviceId: record.fields.serviceId,
            availableFields: Object.keys(record.fields)
          }
        },
        { status: 422 }
      );
    }

    // Map the fields correctly based on Airtable column names
    const collaboration = {
      id: record.fields.id,
      providerSwarm: {
        id: record.fields.providerSwarmId,
        name: record.fields.providerSwarmName,
        image: record.fields.providerSwarmImage,
      },
      clientSwarm: {
        id: record.fields.clientSwarmId,
        name: record.fields.clientSwarmName,
        image: record.fields.clientSwarmImage,
      },
      serviceName: serviceName,
      status: record.fields.status || 'active',
      price: record.fields.price || 0,
      startDate: record.fields.startDate,
      description: record.fields.description,
      objectives: record.fields.objectives ? JSON.parse(record.fields.objectives) : undefined,
      focus: record.fields.focus
    };

    console.log('Returning collaboration:', JSON.stringify(collaboration, null, 2));
    return NextResponse.json(collaboration);
  } catch (error) {
    console.error('Error in /api/collaborations/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collaboration' },
      { status: 500 }
    );
  }
}
