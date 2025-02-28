export const descriptionMap: { [key: string]: string } = {};

export async function getSwarmDescription(swarmId: string) {
    try {
        const response = await fetch(`/api/swarms/${swarmId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch swarm description');
        }
        const data = await response.json();
        return data.description || '';
    } catch (error) {
        console.error('Error fetching swarm description:', error);
        return '';
    }
}
