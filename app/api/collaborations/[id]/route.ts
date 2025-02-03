import { NextResponse } from 'next/server';

interface AirtableSpecRecord {
  fields: {
    title?: string;
    content: string;
    collaborationId: string;
  };
}

interface AirtableDeliverableRecord {
  fields: {
    title?: string;
    content: string;
    collaborationId: string;
  };
}

interface AirtableValidationRecord {
  fields: {
    title?: string;
    content: string;
    collaborationId: string;
  };
}

type ServiceId = 
  | 'xforge-development-package'
  | 'kinos-essential-package'
  | 'kinos-inception-package'
  | 'kinkong-trading';

type ServiceName = 
  | 'Development Package'
  | 'Essential Swarm Package'
  | 'Inception Package'
  | 'Active AI Tokens Trading';

interface CollaborationRecord {
  fields: {
    collaborationId: string;
    providerSwarmId: string;
    clientSwarmId: string;
    serviceId: ServiceId;  // This ensures serviceId is of the correct type
    status?: string;
    price?: number;
    startDate?: string;
    description?: string;
    objectives?: string;
    focus?: string;
  };
}

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

async function getCollaborationSpecs(collaborationId: string) {
  try {
    // Fetch specifications, deliverables, and validations in parallel
    const [specsResponse, deliverablesResponse, validationResponse] = await Promise.all([
      fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Specifications?filterByFormula={collaborationId}="${collaborationId}"`,
        {
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        }
      ),
      fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Deliverables?filterByFormula={collaborationId}="${collaborationId}"`,
        {
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        }
      ),
      fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Validations?filterByFormula={collaborationId}="${collaborationId}"`,
        {
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        }
      )
    ]);

    const [specsData, deliverablesData, validationData] = await Promise.all([
      specsResponse.json(),
      deliverablesResponse.json(),
      validationResponse.json()
    ]);

    return {
      specifications: specsData.records?.map((record: AirtableSpecRecord) => ({
        title: record.fields.title || 'Specification',
        content: record.fields.content
      })) || [],
      deliverables: deliverablesData.records?.map((record: AirtableDeliverableRecord) => ({
        title: record.fields.title || 'Deliverable',
        content: record.fields.content
      })) || [],
      validation: validationData.records?.map((record: AirtableValidationRecord) => ({
        title: record.fields.title || 'Validation',
        content: record.fields.content
      })) || []
    };
  } catch (error) {
    console.error('Error fetching collaboration specs:', error);
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

    const record = data.records[0] as CollaborationRecord;

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

    // Map serviceId to serviceName with proper typing
    const serviceIdToName: Record<ServiceId, ServiceName> = {
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

    // Fetch collaboration specs (only once)
    const specs = await getCollaborationSpecs(params.id);
    console.log('Fetched specs:', specs);

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
      specifications: specs?.specifications || [],
      deliverables: specs?.deliverables || [],
      validation: specs?.validation || []
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
