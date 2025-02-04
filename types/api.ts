export interface AirtableRecord<T> {
  id: string;
  fields: T;
  createdTime: string;
}

export interface ServiceFields {
  serviceId: string;
  name: string;
  description: string;
  fullDescription?: string;
  basePrice: number;
  categories: string;
  computePerTask: number;
  averageCompletionTime: string;
  capabilities: string;
  serviceType: string;
  swarmId: string;
  banner?: string;
  activeSubscriptions?: number;
}

export interface SwarmFields {
  swarmId: string;
  name: string;
  description: string;
  shortDescription?: string;
  image: string;
  models: string;
  pool?: string;
  weeklyRevenue?: number;
  totalRevenue?: number;
  gallery: string;
  tags: string;
  role: string;
  swarmType: string;
  multiple: number;
  launchDate?: string;
  revenueShare: number;
  wallet?: string;
  banner?: string;
  twitterAccount?: string;
  socials: string;
  achievements: string;
  team: string;
  links: string;
}

export interface CollaborationFields {
  collaborationId: string;
  providerSwarmId: string;
  clientSwarmId: string;
  serviceId: string;
  status: string;
  price: number;
  startDate: string;
  description: string;
  objectives: string;
  focus: string;
}

export interface MessageFields {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export interface SwarmResponse {
  id: string;
  name: string;
  image: string;
  pool?: string;
  description?: string;
  role?: string;
  swarmType?: string;
  multiple?: number;
  weeklyRevenue?: number;
  gallery?: any[];
  tags?: string[];
  achievements?: any[];
  socials?: Record<string, string>;
}

export interface ServiceResponse {
  id: string;
  name: string;
  description: string;
  serviceType: string;
  banner?: string;
  swarmId?: string;
  categories: string[];
  computePerTask: number;
  activeSubscriptions?: number;
}

export interface CollaborationResponse {
  id: string;
  providerSwarm: {
    id: string;
    name: string;
    image: string;
  };
  clientSwarm: {
    id: string;
    name: string;
    image: string;
  };
  serviceName: string;
  status: string;
  price: number;
  startDate: string;
  description?: string;
  objectives?: string[];
  focus?: string;
}

export interface MissionRequester {
  id: string;
  name: string;
  image: string;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  reward: number;
  deadline?: string;
  status: 'open' | 'in-progress' | 'completed';
  swarmId: string;
  requirements?: string[];
  deliverables?: string[];
  requester: MissionRequester;
  estimatedDuration: string;
  requiredCapabilities?: string[];
}
