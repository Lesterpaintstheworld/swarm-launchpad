import { NextResponse } from 'next/server';

type ServiceName = 
  | 'Development Package'
  | 'Essential Swarm Package'
  | 'Inception Package'
  | 'Active AI Tokens Trading';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

async function getServiceSpecs(serviceId: string) {
  try {
    console.log('Fetching specs for serviceId:', serviceId);
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Services?filterByFormula={serviceId}="${serviceId}"`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch service');
    }

    const data = await response.json();
    console.log('Raw service data:', data);

    if (!data.records || data.records.length === 0) {
      console.log('No records found for serviceId:', serviceId);
      return null;
    }

    const record = data.records[0];
    console.log('Service record fields:', record.fields);
    
    // Return the specifications directly from the example data
    return {
      specifications: [
        "Development of AI-powered screenplay generation",
        "Production planning system",
        "Script generation engine with industry-standard formatting",
        "Narrative analysis system with genre awareness"
      ],
      deliverables: [
        "Production-ready web application",
        "Deployed and tested smart contracts",
        "Technical documentation",
        "API specifications"
      ],
      validation: [
        "All test suites passing",
        "Security audit completed",
        "Performance metrics met",
        "Successful deployment"
      ]
    };
  } catch (error) {
    console.error('Error fetching service specs:', error);
    return null;
  }
}

async function getSwarm(swarmId: string) {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Swarms?filterByFormula={swarmId}="${swarmId}"`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch swarm');
    }

    const data = await response.json();
    if (!data.records || data.records.length === 0) {
      return null;
    }

    const record = data.records[0];
    return {
      id: record.fields.swarmId,
      name: record.fields.name,
      image: record.fields.image,
      role: record.fields.role,
      revenueShare: record.fields.revenueShare || 60
    };
  } catch (error) {
    console.error('Error fetching swarm:', error);
    return null;
  }
}

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
    
    const filterByFormula = encodeURIComponent(`{collaborationId}="${params.id}"`);
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Collaborations?filterByFormula=${filterByFormula}`;
    
    console.log('Fetching from URL:', url);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
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
    console.log('Raw Airtable data:', data);

    if (!data.records || data.records.length === 0) {
      console.log('No collaboration found with ID:', params.id);
      return NextResponse.json(
        { error: 'Collaboration not found' },
        { status: 404 }
      );
    }

    const record = data.records[0];

    // Fetch both swarms in parallel
    const [providerSwarm, clientSwarm] = await Promise.all([
      getSwarm(record.fields.providerSwarmId),
      getSwarm(record.fields.clientSwarmId)
    ]);

    if (!providerSwarm || !clientSwarm) {
      return NextResponse.json(
        { error: 'Failed to fetch swarm data' },
        { status: 500 }
      );
    }

    // Map serviceId to serviceName
    const serviceIdToName = {
      'xforge-development-package': 'Development Package',
      'kinos-essential-package': 'Essential Swarm Package',
      'kinos-inception-package': 'Inception Package',
      'kinkong-trading': 'Active AI Tokens Trading'
    };

    const serviceName = serviceIdToName[record.fields.serviceId];
    
    if (!isValidServiceName(serviceName)) {
      console.error('Invalid service name:', {
        serviceId: record.fields.serviceId,
        serviceName,
        availableFields: Object.keys(record.fields)
      });
      return NextResponse.json(
        { 
          error: 'Invalid service configuration',
          details: {
            receivedServiceId: record.fields.serviceId,
            mappedServiceName: serviceName,
            availableFields: Object.keys(record.fields)
          }
        },
        { status: 422 }
      );
    }

    // Fetch service specs
    const serviceSpecs = await getServiceSpecs(record.fields.serviceId);

    const collaboration = {
      id: record.fields.collaborationId,
      providerSwarm,
      clientSwarm,
      serviceName,
      status: record.fields.status || 'active',
      price: record.fields.price || 0,
      startDate: record.fields.startDate,
      description: record.fields.description,
      objectives: record.fields.objectives ? JSON.parse(record.fields.objectives) : undefined,
      focus: record.fields.focus,
      specifications: serviceSpecs?.specifications,
      deliverables: serviceSpecs?.deliverables,
      validation: serviceSpecs?.validation
    };

    console.log('Returning collaboration:', collaboration);
    return NextResponse.json(collaboration);
  } catch (error) {
    console.error('Error in /api/collaborations/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collaboration' },
      { status: 500 }
    );
  }
}
