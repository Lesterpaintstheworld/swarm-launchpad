import { Service } from '../types';
import { ServiceCard } from './card';

interface ServiceGridProps {
  services: Service[];
}

export function ServiceGrid({ services }: ServiceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
