import { NextResponse } from 'next/server';
import { AirtableRecord, CollaborationFields, SwarmResponse } from '@/types/api';

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

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

function safeParseJSON<T>(str: string | null | undefined, defaultValue: T): T {
  if (!str) return defaultValue;
  try {
    return JSON.parse(str);
  } catch (e) {
    console.warn('Failed to parse JSON:', str);
    return defaultValue;
  }
}

interface SwarmData {
  id: string;
  name: string;
  image: string;
}

async function getCollaborationSpecs(collaborationId: string) {
  try {
    console.log(`Fetching specs for collaboration: ${collaborationId}`);
    
    // Build the filter formula for Airtable - use specificationId field
    const filterFormula = encodeURIComponent(`{collaborationId}="${collaborationId}"`);

    // Construct the URLs
    const specsUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Specifications?filterByFormula=${filterFormula}`;
    const deliverablesUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Deliverables?filterByFormula=${filterFormula}`;
    const validationsUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Validations?filterByFormula=${filterFormula}`;

    // Common headers
    const headers = {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    };

    // Fetch all data in parallel
    const [specsResponse, deliverablesResponse, validationResponse] = await Promise.all([
      fetch(specsUrl, { headers, cache: 'no-store' }),
      fetch(deliverablesUrl, { headers, cache: 'no-store' }),
      fetch(validationsUrl, { headers, cache: 'no-store' })
    ]);

    // Parse responses
    const [specsData, deliverablesData, validationData] = await Promise.all([
      specsResponse.json(),
      deliverablesResponse.json(),
      validationResponse.json()
    ]);

    // Log raw responses for debugging
    console.log('Raw Specifications:', specsData);
    console.log('Raw Deliverables:', deliverablesData);
    console.log('Raw Validations:', validationData);

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

async function getSwarm(swarmId: string): Promise<SwarmData | null> {
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
      image: record.fields.image
    };
  } catch (error) {
    console.error('Error fetching swarm:', error);
    return null;
  }
}

export async function GET() {
  try {
    console.log('Fetching collaborations from Airtable...');
    
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Collaborations`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error('Airtable response not OK:', await response.text());
      throw new Error('Failed to fetch collaborations');
    }

    const data = await response.json();
    const records = data.records as AirtableRecord<CollaborationFields>[];
    console.log('Raw Airtable data:', data);

    // Fetch all unique swarms in parallel
    const uniqueSwarmIds = new Set();
    interface AirtableCollaborationRecord {
      fields: {
        collaborationId: string;
        providerSwarmId: string;
        clientSwarmId: string;
        serviceId: ServiceId;
        status?: string;
        price?: number;
        startDate?: string;
        description?: string;
        objectives?: string;
        focus?: string;
      };
    }

    data.records.forEach((record: AirtableCollaborationRecord) => {
      uniqueSwarmIds.add(record.fields.providerSwarmId);
      uniqueSwarmIds.add(record.fields.clientSwarmId);
    });

    const swarmPromises = Array.from(uniqueSwarmIds).map(id => getSwarm(id as string));
    const swarms = await Promise.all(swarmPromises);
    const swarmMap = new Map();
    swarms.forEach(swarm => {
      if (swarm) {
        swarmMap.set(swarm.id, swarm);
      }
    });

    const collaborations = await Promise.all(data.records.map(async (record: AirtableRecord<CollaborationFields>) => {
      const providerSwarm = swarmMap.get(record.fields.providerSwarmId);
      const clientSwarm = swarmMap.get(record.fields.clientSwarmId);

      if (!providerSwarm || !clientSwarm) {
        console.warn(`Missing swarm data for collaboration ${record.fields.collaborationId}`);
        return null;
      }

      // Map serviceId to serviceName with proper typing
      const serviceIdToName: Record<ServiceId, string> = {
        'xforge-development-package': 'Development Package',
        'kinos-essential-package': 'Essential Swarm Package',
        'kinos-inception-package': 'Inception Package',
        'kinkong-trading': 'Active AI Tokens Trading'
      };

      return {
        id: record.fields.collaborationId,
        providerSwarm,
        clientSwarm,
        serviceName: serviceIdToName[record.fields.serviceId as ServiceId] || record.fields.serviceId,
        status: record.fields.status || 'active',
        price: record.fields.price || 0,
        startDate: record.fields.startDate,
        description: record.fields.description,
        objectives: safeParseJSON(record.fields.objectives, []),
        focus: record.fields.focus
      };
    }));

    // Filter out null values (collaborations with missing swarm data)
    const validCollaborations = collaborations.filter(c => c !== null);

    console.log('Processed collaborations:', validCollaborations);
    return NextResponse.json(validCollaborations);
  } catch (error) {
    console.error('Error in /api/collaborations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collaborations' },
      { status: 500 }
    );
  }
}
