import { Service } from '../types';

export const mockServices: Service[] = [
  {
    id: '1',
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
    capabilities: ['Blog Posts', 'Social Media', 'Product Descriptions']
  }
];
