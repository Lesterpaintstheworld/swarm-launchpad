export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Hardcoded weekly revenue values
        const revenueMap: Record<string, number> = {
            'kinos': 800000,
            'kinkong': 120000,
            'xforge': 4400000
        };

        const weeklyRevenue = revenueMap[params.id] || 0;
        return Response.json({ weeklyRevenue });
    } catch (error) {
        console.error('Error fetching swarm revenue:', error);
        return Response.json({ error: 'Failed to fetch revenue data' }, { status: 500 });
    }
}
