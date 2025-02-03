'use client';

import { ServiceCard } from './card';
import { useEffect, useState } from 'react';

interface Service {
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

interface ServiceGridProps {
  services?: Service[];
}

export function ServiceGrid({ services: initialServices }: ServiceGridProps) {
  const [services, setServices] = useState<Service[]>(initialServices || []);
  const [isLoading, setIsLoading] = useState(!initialServices);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialServices) return;

    async function fetchServices() {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        // Ensure the serviceType is one of the allowed values
        const validatedServices = data.map((service: any) => ({
          ...service,
          serviceType: validateServiceType(service.serviceType)
        }));
        setServices(validatedServices);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services');
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, [initialServices]);

  // Helper function to validate serviceType
  function validateServiceType(type: string): Service['serviceType'] {
    switch (type) {
      case 'subscription':
      case 'one-off':
      case 'pay-as-you-go':
      case 'financial':
        return type;
      default:
        return 'one-off'; // Default fallback
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div 
            key={i} 
            className="h-[200px] rounded-xl bg-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
