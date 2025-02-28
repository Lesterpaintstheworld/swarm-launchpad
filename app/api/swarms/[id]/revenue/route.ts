// Import Airtable properly
import Airtable from 'airtable';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log(`Fetching revenue for swarm: ${params.id}`);
        
        try {
            // Try to use Airtable package first
            return await getRevenueWithAirtablePackage(params.id);
        } catch (airtableError) {
            console.warn('Error with Airtable package, falling back to direct API:', airtableError);
            // Fall back to direct API if Airtable package fails
            return await getRevenueWithDirectApi(params.id);
        }
    } catch (error) {
        console.error('Error fetching swarm revenue:', error);
        return Response.json({ error: 'Failed to fetch revenue data', details: (error as Error).message }, { status: 500 });
    }
}

async function getRevenueWithAirtablePackage(swarmId: string) {
    try {
        // Initialize Airtable
        const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);
    
        try {
            // Get all records from the Swarms table that match the swarmId
            const records = await base('Swarms')
                .select({
                    filterByFormula: `{swarmId} = "${swarmId}"`,
                    fields: ['weeklyRevenue', 'swarmId', 'name', 'revenueShare']
                })
                .firstPage();
            
            if (!records || records.length === 0) {
                console.log(`No swarm found with swarmId: ${swarmId}`);
                return Response.json({ error: 'Swarm not found' }, { status: 404 });
            }
            
            // Get the weeklyRevenue and revenueShare values from the record
            const weeklyRevenue = records[0].get('weeklyRevenue') as number || 0;
            let revenueShare = records[0].get('revenueShare') as number || 100; // Default to 100% if not provided

            // Ensure revenueShare is between 10 and 100
            revenueShare = Math.max(10, Math.min(100, revenueShare));

            console.log(`Found weeklyRevenue: ${weeklyRevenue}, revenueShare: ${revenueShare}% for swarm: ${swarmId} (${records[0].get('name')})`);
            
            return Response.json({ weeklyRevenue, revenueShare });
        } catch (error) {
            console.error('Error with Airtable package:', error);
            throw error; // Rethrow to be caught by the outer try/catch
        }
    } catch (error) {
        console.error('Error initializing Airtable:', error);
        throw error;
    }
}

async function getRevenueWithDirectApi(swarmId: string) {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    
    if (!apiKey || !baseId) {
        return Response.json({ error: 'Missing Airtable credentials' }, { status: 500 });
    }
    
    try {
        // Construct the Airtable API URL
        const url = `https://api.airtable.com/v0/${baseId}/Swarms?filterByFormula={swarmId}="${swarmId}"&fields[]=weeklyRevenue&fields[]=swarmId&fields[]=name&fields[]=revenueShare`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.records || data.records.length === 0) {
            console.log(`No swarm found with swarmId: ${swarmId}`);
            return Response.json({ error: 'Swarm not found' }, { status: 404 });
        }
        
        // Get the weeklyRevenue and revenueShare values from the record
        const weeklyRevenue = data.records[0].fields.weeklyRevenue || 0;
        let revenueShare = data.records[0].fields.revenueShare || 100; // Default to 100% if not provided

        // Ensure revenueShare is between 10 and 100
        revenueShare = Math.max(10, Math.min(100, revenueShare));

        console.log(`Found weeklyRevenue: ${weeklyRevenue}, revenueShare: ${revenueShare}% for swarm: ${swarmId} (${data.records[0].fields.name})`);
        
        return Response.json({ weeklyRevenue, revenueShare });
    } catch (error) {
        console.error('Error with direct Airtable API:', error);
        // Return a default response if all else fails
        return Response.json({ weeklyRevenue: 0, revenueShare: 100 });
    }
}
