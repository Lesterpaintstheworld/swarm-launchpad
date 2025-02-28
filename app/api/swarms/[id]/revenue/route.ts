import Airtable from 'airtable';

// Initialize Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Fetch the swarm record from Airtable using swarmId instead of id
        const records = await base('Swarms')
            .select({
                filterByFormula: `{swarmId} = "${params.id}"`,
                fields: ['weeklyRevenue']
            })
            .firstPage();

        if (!records || records.length === 0) {
            return Response.json({ error: 'Swarm not found' }, { status: 404 });
        }

        // Get the weeklyRevenue value from the record
        const weeklyRevenue = records[0].get('weeklyRevenue') as number || 0;

        return Response.json({ weeklyRevenue });
    } catch (error) {
        console.error('Error fetching swarm revenue:', error);
        return Response.json({ error: 'Failed to fetch revenue data' }, { status: 500 });
    }
}
