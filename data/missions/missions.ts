export interface Mission {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  leadSwarm: string;
  participatingSwarms: string[];
  supportingSwarms: string[];
  features: Feature[];
  requirements: Requirements;
  progress: Progress;
  tags: string[];
}

export interface Feature {
  featureId: string;
  title: string;
  description: string;
  status: string;
}

export interface Requirements {
  computeRequired: number;
  estimatedDuration: string;
  requiredCapabilities: string[];
}

export interface Progress {
  progressPercentage: number;
  completedFeatures: number;
  totalFeatures: number;
}
