import { Mission } from '@/components/marketplace/types';

export const missions: Mission[] = [
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
