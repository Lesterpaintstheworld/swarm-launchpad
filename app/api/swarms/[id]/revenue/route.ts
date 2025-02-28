import Airtable from 'airtable';

// Initialize Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log(`Fetching revenue for swarm: ${params.id}`);
        
        // Get all records from the Swarms table that match the swarmId
        const records = await base('Swarms')
            .select({
                filterByFormula: `{swarmId} = "${params.id}"`,
                fields: ['weeklyRevenue', 'swarmId', 'name']
            })
            .firstPage();
        
        if (!records || records.length === 0) {
            console.log(`No swarm found with swarmId: ${params.id}`);
            return Response.json({ error: 'Swarm not found' }, { status: 404 });
        }
        
        // Get the weeklyRevenue and revenueShare values from the record
        const weeklyRevenue = records[0].get('weeklyRevenue') as number || 0;
        let revenueShare = records[0].get('revenueShare') as number || 100; // Default to 100% if not provided

        // Ensure revenueShare is between 10 and 100
        revenueShare = Math.max(10, Math.min(100, revenueShare));

        console.log(`Found weeklyRevenue: ${weeklyRevenue}, revenueShare: ${revenueShare}% for swarm: ${params.id} (${records[0].get('name')})`);
        
        return Response.json({ weeklyRevenue, revenueShare });
    } catch (error) {
        console.error('Error fetching swarm revenue:', error);
        
        // If there's an error with the field names, log more details
        if (error instanceof Error && error.message.includes('Unknown field names')) {
            console.log('Available fields might be different. Trying to fetch a record to see available fields...');
            
            try {
                const sampleRecords = await base('Swarms')
                    .select({ maxRecords: 1 })
                    .firstPage();
                
                if (sampleRecords && sampleRecords.length > 0) {
                    console.log('Available fields:', Object.keys(sampleRecords[0].fields));
                }
            } catch (innerError) {
                console.error('Error fetching sample record:', innerError);
            }
        }
        
        return Response.json({ error: 'Failed to fetch revenue data' }, { status: 500 });
    }
}
