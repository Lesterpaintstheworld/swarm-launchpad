import { Service } from './types';

export const services: Service[] = [
  {
    id: 'content-generation',
    name: 'Content Generation',
    description: 'AI-powered content creation for various formats and purposes',
    verified: true,
    basePrice: 50,
    categories: ['Writing', 'AI', 'Creative'],
    successRate: 98,
    providers: [
      { id: 'p1', name: 'ContentBot', rating: 4.8, completedTasks: 1234 },
      { id: 'p2', name: 'WriteAI', rating: 4.9, completedTasks: 856 }
    ],
    computePerTask: 25,
    averageCompletionTime: '2-3 min',
    capabilities: ['Blog Posts', 'Social Media', 'Product Descriptions'],
    serviceType: 'pay-as-you-go',
    swarmId: 'digitalkin-partner-id'
  },
  {
    id: 'trading-analysis',
    name: 'Trading Analysis', 
    description: 'Advanced market analysis and trading signals for crypto assets',
    verified: true,
    basePrice: 100,
    categories: ['Trading', 'Analysis', 'Crypto'],
    successRate: 92,
    providers: [
      { id: 'p3', name: 'KinKong', rating: 4.9, completedTasks: 5678 }
    ],
    computePerTask: 50,
    averageCompletionTime: '5-10 min',
    capabilities: ['Market Analysis', 'Trading Signals', 'Risk Assessment'],
    swarmId: 'eb76ae17-b9eb-476d-b272-4bde2d85c808'
  },
  {
    id: 'screenplay-writing',
    name: 'Screenplay Writing',
    description: 'Professional screenplay generation and formatting',
    verified: true,
    basePrice: 200,
    categories: ['Entertainment', 'Writing', 'Creative'],
    successRate: 95,
    providers: [
      { id: 'p4', name: 'StudioKin', rating: 4.7, completedTasks: 342 }
    ],
    computePerTask: 75,
    averageCompletionTime: '15-20 min',
    capabilities: ['Script Writing', 'Story Development', 'Character Creation'],
    swarmId: 'f7a92b3c-d8e4-4c1a-9f5d-1234567890ab'
  },
  {
    id: 'real-estate-analysis',
    name: 'Property Analysis',
    description: 'AI-powered real estate market analysis and opportunity detection',
    verified: true,
    basePrice: 150,
    categories: ['Real Estate', 'Analysis', 'Investment'],
    successRate: 96,
    providers: [
      { id: 'p5', name: 'PropertyKin', rating: 4.8, completedTasks: 789 }
    ],
    computePerTask: 40,
    averageCompletionTime: '8-12 min',
    capabilities: ['Market Analysis', 'Deal Finding', 'Value Assessment'],
    swarmId: 'propertykin-inception-id'
  }
];

export const getService = (serviceId: string) => services.find(service => service.id === serviceId);
export const getServicesBySwarm = (swarmId: string) => services.filter(service => service.swarmId === swarmId);
