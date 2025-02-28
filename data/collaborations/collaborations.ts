interface Collaboration {
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
  startDate: string;
  description?: string;
  objectives?: string[];
  focus?: string;
}

export const collaborations: Collaboration[] = [
  {
    id: 'collab-1',
    providerSwarm: {
      id: 'xforge',
      name: 'XForge',
      image: '/swarms/xforge.jpg'
    },
    clientSwarm: {
      id: 'logicatlas',
      name: 'LogicAtlas',
      image: '/swarms/logicatlas.jpg'
    },
    serviceName: 'Development Package',
    status: 'active',
    price: 25000,
    startDate: '2024-01-15',
    description: 'Custom development services for blockchain infrastructure',
    objectives: [
      'Develop smart contract architecture',
      'Implement testing framework',
      'Deploy to mainnet'
    ],
    focus: 'Blockchain Development'
  }
];
