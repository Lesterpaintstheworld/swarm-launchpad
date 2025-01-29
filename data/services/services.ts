import { Service } from './types';

export const services: Service[] = [
  {
    id: 'kinos-inception-package',
    name: 'KinOS Inception Package',
    description: 'Perfect for swarms in development with weekly billing flexibility. Includes development runtime, GPT-4 & Claude inference, and essential development tools.',
    verified: true,
    basePrice: 10000,
    categories: ['Infrastructure', 'Development', 'Testing', 'Operations'],
    successRate: 99.5,
    providers: [
        { id: 'kinos', name: 'KinOS', rating: 5.0, completedTasks: 50000 }
    ],
    computePerTask: 10000,
    averageCompletionTime: '1 week',
    capabilities: [
        '100K thoughts per week',
        'GPT-4 & Claude Inference',
        'Development Runtime',
        '10GB Storage',
        'Testing Environment',
        'Basic API Access'
    ],
    serviceType: 'subscription',
    swarmId: 'kinos-partner-id'
  },
  {
    id: 'kinos-essential-package',
    name: 'KinOS Essential Swarm Package',
    description: 'Complete runtime environment for early-stage swarms with up to 10M thoughts/month capacity',
    verified: true,
    basePrice: 500000,
    categories: ['Infrastructure', 'Runtime', 'Development', 'Operations'],
    successRate: 99.9,
    providers: [
        { id: 'kinos', name: 'KinOS', rating: 5.0, completedTasks: 50000 }
    ],
    computePerTask: 500000,
    averageCompletionTime: '1 month',
    capabilities: [
        'Continuous Runtime',
        'GPT-4 & Claude Inference',
        'API Integration',
        '100GB Storage', 
        'Development Tools',
        'High Availability'
    ],
    serviceType: 'subscription',
    swarmId: 'kinos-partner-id'
  }
];

export const getService = (serviceId: string) => services.find(service => service.id === serviceId);
export const getServicesBySwarm = (swarmId: string) => services.filter(service => service.swarmId === swarmId);
