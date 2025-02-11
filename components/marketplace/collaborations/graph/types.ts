export interface CollaborationGraphProps {
  collaborations: Array<{
    id: string;
    providerSwarm: {
      id: string;
      name: string;
      image: string;
    };
    clientSwarm: {
      id: string;
      name: string;
      image: string;
    };
    serviceName: string;
    status: string;
    price: number;
  }>;
}

export interface SimulationNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  image: string;
  x: number;
  y: number;
}

export interface SimulationLink extends d3.SimulationLinkDatum<SimulationNode> {
  value: number;
  strength: number;
  serviceName: string;
}

export interface SwarmData {
  id: string;
  name: string;
  swarmType: string;
  description: string;
  multiple: number;
  revenueShare: number;
  image: string;
}

export interface Collaboration {
  id: string;
  providerSwarm: {
    id: string;
    name: string;
    image: string;
  };
  clientSwarm: {
    id: string;
    name: string;
    image: string;
  };
  serviceName: string;
  price: number;
  status: string;
}
