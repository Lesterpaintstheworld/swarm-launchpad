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
  status: string;
  price: number;
  startDate?: string;
  description?: string;
}

export const collaborations: Collaboration[] = [];
