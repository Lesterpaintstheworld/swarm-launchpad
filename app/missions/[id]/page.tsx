'use client';

import { useEffect, useState } from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Hero } from '@/components/ui/hero';
import { ClientMarkdown } from '@/components/ui/clientMarkdown';

interface Feature {
  featureId: string;
  title: string;
  description: string;
  status: string;
}

interface Requirements {
  computeRequired: number;
  estimatedDuration: string;
  requiredCapabilities: string[];
}

interface Progress {
  progressPercentage: number;
  completedFeatures: number;
  totalFeatures: number;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  priority: string;
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

export default function MissionPage({ params }: { params: { id: string } }) {
  const [mission, setMission] = useState<Mission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMission() {
      try {
        const response = await fetch(`/api/missions/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch mission');
        }
        const data = await response.json();
        setMission(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load mission');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMission();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white/60">Loading mission...</div>
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white/60">{error || 'Mission not found'}</div>
      </div>
    );
  }

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Missions', href: '/missions' },
    { label: mission.title }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb crumbs={crumbs} className="mb-8" />
        
        <Hero
          title={mission.title}
          subtitle={
            <div className="flex gap-4 text-sm text-white/60">
              <span className="capitalize">Priority: {mission.priority}</span>
              <span>•</span>
              <span className="capitalize">Status: {mission.status}</span>
              <span>•</span>
              <span>Due: {new Date(mission.endDate).toLocaleDateString()}</span>
            </div>
          }
          className="mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <ClientMarkdown markdown={mission.description} />
            </div>

            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <div className="space-y-4">
                {mission.features.map((feature) => (
                  <div key={feature.featureId} className="border border-white/10 rounded-lg p-4">
                    <h3 className="font-medium mb-2">{feature.title}</h3>
                    <p className="text-white/60 mb-2">{feature.description}</p>
                    <span className="inline-block px-2 py-1 rounded-full text-sm bg-white/10 capitalize">
                      {feature.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Progress</h2>
              <div className="space-y-2">
                <div className="w-full bg-white/10 rounded-full h-4">
                  <div 
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${mission.progress.progressPercentage}%` }}
                  />
                </div>
                <p className="text-white/60">
                  {mission.progress.completedFeatures} of {mission.progress.totalFeatures} features completed
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-white/60">Compute Required</p>
                  <p>{mission.requirements.computeRequired.toLocaleString()} COMPUTE</p>
                </div>
                <div>
                  <p className="text-white/60">Estimated Duration</p>
                  <p>{mission.requirements.estimatedDuration}</p>
                </div>
                <div>
                  <p className="text-white/60">Required Capabilities</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {mission.requirements.requiredCapabilities.map((cap) => (
                      <span key={cap} className="px-2 py-1 rounded-full text-sm bg-white/10">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {mission.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded-full text-sm bg-white/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
