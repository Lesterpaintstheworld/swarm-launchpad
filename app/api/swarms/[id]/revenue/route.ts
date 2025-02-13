export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Fetch from Airtable or your database
        const response = await fetch(
            `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Swarms/${params.id}`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch swarm revenue data');
        }

        const data = await response.json();
        return Response.json({ weeklyRevenue: data.fields.weeklyRevenue || 0 });
    } catch (error) {
        console.error('Error fetching swarm revenue:', error);
        return Response.json({ error: 'Failed to fetch revenue data' }, { status: 500 });
    }
}
