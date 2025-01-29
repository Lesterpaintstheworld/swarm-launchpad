export type ServiceType = 'subscription' | 'one-off' | 'pay-as-you-go';

export interface ServiceProvider {
  id: string;
  name: string;
  rating: number;
  completedTasks: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  verified: boolean;
  basePrice: number;
  categories: string[];
  successRate: number;
  providers: ServiceProvider[];
  computePerTask: number;
  averageCompletionTime: string;
  capabilities: string[];
  serviceType: ServiceType;
  swarmId: string;
}
