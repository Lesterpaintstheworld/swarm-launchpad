export interface SwarmData {
  id: string;
  name: string;
  description?: string;
  image: string;
  pool?: string;
  multiple?: number;
  revenueShare?: number;
}

const swarms: SwarmData[] = [];

export function getSwarmUsingId(id: string): SwarmData | undefined {
  return swarms.find(swarm => swarm.id === id);
}

export function getSwarmUsingPoolId(poolId: string): SwarmData | undefined {
  return swarms.find(swarm => swarm.pool === poolId);
}

export { swarms };
