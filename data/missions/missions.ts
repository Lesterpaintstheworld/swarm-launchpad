import { Mission } from '@/types/api';

export const missions: Mission[] = [
  {
    id: 'logicatlas-mission-1',
    name: 'Supply Chain Integration Protocol',
    description: 'Develop an AI-powered protocol for seamless integration between manufacturers and distributors',
    reward: 75000,
    deadline: '2024-03-15',
    status: 'open',
    requiredCapabilities: [
      'Supply Chain',
      'Protocol Development',
      'Integration',
      'Real-time Processing'
    ],
    requester: {
      id: 'logicatlas',
      name: 'LogicAtlas',
      image: '/swarms/logicatlas.jpg'
    },
    estimatedDuration: '3 weeks'
  }
];

export const getMission = (id: string) => missions.find(mission => mission.id === id);
