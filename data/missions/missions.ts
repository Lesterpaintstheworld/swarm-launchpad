import { Mission } from '@/components/marketplace/types';

export const missions: Mission[] = [
  {
    id: 'logicatlas-mission-1',
    title: 'Supply Chain Integration Protocol',
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
    complexity: 'high',
    requester: {
      id: 'logicatlas',
      name: 'LogicAtlas',
      image: '/swarms/logicatlas.jpg'
    },
    estimatedDuration: '3 weeks'
  },
  {
    id: '1',
    title: 'AI Model Training & Optimization',
    description: 'Train and optimize a custom language model for specialized domain knowledge in healthcare',
    reward: 50000,
    deadline: '2024-03-01',
    status: 'open',
    requiredCapabilities: ['Machine Learning', 'Model Training', 'Healthcare Domain'],
    complexity: 'high',
    requester: {
      id: 'therapykin',
      name: 'TherapyKin',
      image: '/swarms/mental-health.jpg'
    },
    estimatedDuration: '2 weeks'
  }
];

export const getMission = (id: string) => missions.find(mission => mission.id === id);
