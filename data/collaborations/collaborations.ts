export interface Collaboration {
  id: string;
  sourceSwarm: {
    id: string;
    name: string;
    image: string;
  };
  targetSwarm: {
    id: string;
    name: string;
    image: string;
  };
  serviceName: string;
  status: 'active' | 'completed' | 'pending';
  price: number;
  startDate: string;
  description: string;
  objectives: string[];
  focus: string;
}

export const collaborations: Collaboration[] = [
  // Early Swarms
  {
    id: '1',
    sourceSwarm: {
      id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
      name: 'Kin Kong',
      image: '/swarms/kinkong.jpg'
    },
    targetSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Essential Swarm Package',
    status: 'active',
    price: 100000,
    startDate: '2024-01-15',
    description: 'A production-level infrastructure collaboration enabling Kin Kong to operate its advanced trading algorithms at scale through KinOS\'s enterprise runtime services and support.',
    objectives: [
      'High-performance trading system deployment',
      'Real-time market data processing', 
      'Automated strategy execution',
      'Secure transaction handling',
      'Advanced monitoring and reporting'
    ],
    focus: 'Scaling Kin Kong\'s AI trading capabilities through KinOS\'s enterprise-grade infrastructure, enabling efficient execution of complex trading strategies across multiple markets.'
  },
  {
    id: '2',
    sourceSwarm: {
      id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
      name: 'SwarmsVenture',
      image: '/swarms/swarm-ventures.jpg'
    },
    targetSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Essential Swarm Package',
    status: 'active',
    price: 100000
  },
  {
    id: '3',
    sourceSwarm: {
      id: '03616e66-a21e-425b-a93b-16d6396e883f',
      name: 'Synthetic Souls',
      image: '/swarms/syntheticsouls/Lyra 16-9 web.jpg'
    },
    targetSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Essential Swarm Package',
    status: 'active',
    price: 100000
  },
  // Inception Swarms
  {
    id: '4',
    sourceSwarm: {
      id: 'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d',
      name: 'Robinhood Agent',
      image: '/swarms/robinhood.jpg'
    },
    targetSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000
  },
  {
    id: '5',
    sourceSwarm: {
      id: '7d3c9e5b-1f8a-4d3c-b8d4-9e5b1f8a4d3c',
      name: 'DuoAI',
      image: '/swarms/duoai.jpg'
    },
    targetSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000
  },
  {
    id: '6',
    sourceSwarm: {
      id: 'h8i9j0k1-l2m3-1h2i-fj6k-7l8m9n0o1p2q',
      name: 'ProfitBeeAI',
      image: '/swarms/affiliate.jpeg'
    },
    targetSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000
  },
  {
    id: '7',
    sourceSwarm: {
      id: 'propertykin-inception-id',
      name: 'PropertyKin',
      image: '/swarms/property.png'
    },
    targetSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000
  },
  {
    id: '8',
    sourceSwarm: {
      id: 'd4e5f6g7-h8i9-7d8e-bf2g-3h4i5j6k7l8m',
      name: 'PlayWise',
      image: '/swarms/toy.png'
    },
    targetSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000
  },
  {
    id: '9',
    sourceSwarm: {
      id: 'f7a92b3c-d8e4-4c1a-9f5d-1234567890ab',
      name: 'StudioKin',
      image: '/swarms/screenplay.jpg'
    },
    targetSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000
  },
  {
    id: '10',
    sourceSwarm: {
      id: 'b2c3d4e5-f6g7-5b6c-9d0e-1f2g3h4i5j6k',
      name: 'TherapyKin',
      image: '/swarms/mental-health.jpg'
    },
    targetSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000
  },
  {
    id: '11',
    sourceSwarm: {
      id: 'g7h8i9j0-k1l2-0g1h-ei5j-6k7l8m9n0o1p',
      name: 'CommerceNest',
      image: '/swarms/commercenest.jpg'
    },
    targetSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000
  },
  {
    id: '12',
    sourceSwarm: {
      id: 'wealthhive-inception-id',
      name: 'WealthHive',
      image: '/swarms/wealthhive.png'
    },
    targetSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000
  },
  {
    id: '13',
    sourceSwarm: {
      id: 'c3d4e5f6-g7h8-6c7d-ae1f-2g3h4i5j6k7l',
      name: 'PublishKin',
      image: '/swarms/book.png'
    },
    targetSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000
  },
  {
    id: '14',
    sourceSwarm: {
      id: 'digitalkin-partner-id',
      name: 'DigitalKin',
      image: '/swarms/digitalkin.png'
    },
    targetSwarm: {
      id: 'forge-partner-id',
      name: 'XForge',
      image: '/swarms/xforge.png'
    },
    serviceName: 'Development Package',
    status: 'active',
    price: 400000
  },
  {
    id: '15',
    sourceSwarm: {
      id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
      name: 'Kin Kong',
      image: '/swarms/kinkong.jpg'
    },
    targetSwarm: {
      id: 'forge-partner-id',
      name: 'XForge',
      image: '/swarms/xforge.png'
    },
    serviceName: 'Development Package',
    status: 'active',
    price: 400000
  },
  {
    id: '16',
    sourceSwarm: {
      id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
      name: 'SwarmsVenture',
      image: '/swarms/swarm-ventures.jpg'
    },
    targetSwarm: {
      id: 'forge-partner-id',
      name: 'XForge',
      image: '/swarms/xforge.png'
    },
    serviceName: 'Development Package',
    status: 'active',
    price: 400000
  },
  {
    id: '17',
    sourceSwarm: {
      id: '03616e66-a21e-425b-a93b-16d6396e883f',
      name: 'Synthetic Souls',
      image: '/swarms/syntheticsouls/Lyra 16-9 web.jpg'
    },
    targetSwarm: {
      id: 'forge-partner-id',
      name: 'XForge',
      image: '/swarms/xforge.png'
    },
    serviceName: 'Development Package',
    status: 'active',
    price: 400000
  }
];

export const getCollaboration = (id: string) => collaborations.find(collab => collab.id === id);
export const getCollaborationsBySwarm = (swarmId: string) => 
  collaborations.filter(collab => 
    collab.sourceSwarm.id === swarmId || collab.targetSwarm.id === swarmId
  );
