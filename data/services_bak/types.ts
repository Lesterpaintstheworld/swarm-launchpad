export interface Service {
  id: string;
  name: string;
  description: string;
  serviceType: 'subscription' | 'one-off' | 'pay-as-you-go' | 'financial';
  banner?: string;
  swarmId?: string;
  categories: string[];
  computePerTask: number;
  activeSubscriptions?: number;
}
