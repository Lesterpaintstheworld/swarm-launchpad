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
  // Remove the state and useEffect since we're getting services directly
  const services = initialServices || [];

  // Add debug logging
  console.log('ServiceGrid received services:', services);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services.map((service) => {
        console.log('Rendering service:', service);
        return <ServiceCard key={service.id} service={service} />;
      })}
    </div>
  );
}
