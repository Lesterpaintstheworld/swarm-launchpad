'use client';

import { useEffect, useState } from 'react';
import { ClientMarkdown } from '@/components/ui/clientMarkdown';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Hero } from '@/components/ui/hero';

interface Specification {
  id: string;
  title: string;
  content: string;
  version: string;
  lastUpdated: string;
}

export default function SpecificationPage({ params }: { params: { id: string } }) {
  const [specification, setSpecification] = useState<Specification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpecification() {
      try {
        const response = await fetch(`/api/specifications/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch specification');
        }
        const data = await response.json();
        setSpecification(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load specification');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSpecification();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white/60">Loading specification...</div>
      </div>
    );
  }

  if (error || !specification) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white/60">{error || 'Specification not found'}</div>
      </div>
    );
  }

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Specifications', href: '/specifications' },
    { label: specification.title }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb crumbs={crumbs} className="mb-8" />
        
        <Hero
          title={specification.title}
          subtitle={
            <div className="flex gap-4 text-sm text-white/60">
              <span>Version {specification.version}</span>
              <span>•</span>
              <span>Last updated: {new Date(specification.lastUpdated).toLocaleDateString()}</span>
            </div>
          }
          className="mb-12"
        />

        <div className="prose prose-invert max-w-none">
          <ClientMarkdown markdown={specification.content} />
        </div>
      </div>
    </div>
  );
}
