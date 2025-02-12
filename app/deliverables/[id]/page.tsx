'use client';

import { useEffect, useState } from 'react';
import { ClientMarkdown } from '@/components/ui/clientMarkdown';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Hero } from '@/components/ui/hero';

interface Deliverable {
  id: string;
  title: string;
  content: string;
  version: string;
  lastUpdated: string;
}

export default function DeliverablePage({ params }: { params: { id: string } }) {
  const [deliverable, setDeliverable] = useState<Deliverable | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDeliverable() {
      try {
        const response = await fetch(`/api/deliverables/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch deliverable');
        }
        const data = await response.json();
        setDeliverable(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deliverable');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDeliverable();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white/60">Loading deliverable...</div>
      </div>
    );
  }

  if (error || !deliverable) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white/60">{error || 'Deliverable not found'}</div>
      </div>
    );
  }

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Deliverables', href: '/deliverables' },
    { label: deliverable.title }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb crumbs={crumbs} className="mb-8" />
        
        <Hero
          title={deliverable.title}
          subtitle={
            <div className="flex gap-4 text-sm text-white/60">
              <span>Version {deliverable.version}</span>
              <span>•</span>
              <span>Last updated: {new Date(deliverable.lastUpdated).toLocaleDateString()}</span>
            </div>
          }
          className="mb-12"
        />

        <div className="prose prose-invert max-w-none">
          <ClientMarkdown markdown={deliverable.content} />
        </div>
      </div>
    </div>
  );
}
