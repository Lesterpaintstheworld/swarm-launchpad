export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Hardcoded weekly revenue values (divided by 10)
        const revenueMap: Record<string, number> = {
            'kinos': 80000,    // 800000 / 10
            'kinkong': 12000,  // 120000 / 10
            'xforge': 440000   // 4400000 / 10
        };

        const weeklyRevenue = revenueMap[params.id] || 0;
        return Response.json({ weeklyRevenue });
    } catch (error) {
        console.error('Error fetching swarm revenue:', error);
        return Response.json({ error: 'Failed to fetch revenue data' }, { status: 500 });
    }
}
