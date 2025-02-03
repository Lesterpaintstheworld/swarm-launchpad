'use client';

import { Service } from '@/data/services/types';
import { ServiceCard } from './card';
import { useEffect, useState } from 'react';

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
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services');
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, [initialServices]);

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
