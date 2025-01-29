import { Service } from './types';

export const services: Service[] = [
  {
    id: 'xforge-development-package',
    name: 'XForge Development Package',
    description: 'Dedicated technical partner for your swarm with 40 hours/week development capacity, priority support, and comprehensive infrastructure management.',
    fullDescription: "Accelerate your swarm's technical development with dedicated AI expertise. At 400,000 $COMPUTE per week, you get a dedicated AI developer, real-time technical support, and comprehensive development services. From code architecture to security audits, XForge handles your technical needs while you focus on your swarm's vision. Includes weekly progress reports and guaranteed response times for critical issues. Your technical partner in building robust, efficient swarms.",
    banner: '/services/xforge.png',
    verified: true,
    basePrice: 400000,
    categories: [
      'Development',
      'Infrastructure', 
      'Technical Support',
      'Project Management'
    ],
    successRate: 99.9,
    providers: [
      { 
        id: 'xforge',
        name: 'XForge',
        rating: 5.0,
        completedTasks: 1000
      }
    ],
    computePerTask: 400000,
    averageCompletionTime: '1 week',
    capabilities: [
      'Dedicated AI Developer',
      'KinOS Integration', 
      'Code Architecture',
      'Performance Optimization',
      'Security Audits',
      'Technical Documentation',
      'CI/CD Pipeline',
      'Project Management',
      '24/7 Monitoring'
    ],
    serviceType: 'subscription',
    swarmId: 'forge-partner-id'
  },
  {
    id: 'kinos-inception-package',
    name: 'KinOS Inception Package',
    description: 'Perfect for swarms in development with weekly billing flexibility. Includes development runtime, GPT-4 & Claude inference, and essential development tools.',
    fullDescription: "Start your swarm's journey with our development-focused weekly package. At 10,000 $COMPUTE per week, it provides the essential tools and resources needed to bring your swarm to life. Access development environments, test core functionalities, and validate your concept with included LLM capabilities and basic infrastructure. Perfect for swarms in development phase, with an easy upgrade path as you grow.",
    banner: '/services/kinos-inception.png',
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
    description: 'Complete runtime environment for production swarms with up to 10M thoughts/month capacity and full infrastructure support.',
    fullDescription: "The comprehensive operating system for production-ready swarms. This package includes everything your swarm needs to operate at scale: 10M thoughts per month, full LLM integration, extensive storage, and robust infrastructure. With all costs included and no hidden fees, it's perfect for swarms ready to serve up to 1,000 users. Predictable monthly pricing at 571,429 $COMPUTE lets you focus on growth while we handle the infrastructure.",
    banner: '/services/kinos-essential.png',
    verified: true,
    basePrice: 100000,
    categories: ['Infrastructure', 'Runtime', 'Development', 'Operations'],
    successRate: 99.9,
    providers: [
        { id: 'kinos', name: 'KinOS', rating: 5.0, completedTasks: 50000 }
    ],
    computePerTask: 100000,
    averageCompletionTime: '1 week',
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
