'use client';

import { useEffect, useState } from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Hero } from '@/components/ui/hero';
import { ClientMarkdown } from '@/components/ui/clientMarkdown';
import { Mission } from '@/data/missions/missions';

export default function MissionPage({ params }: { params: { id: string } }) {
  const [mission, setMission] = useState<Mission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMission() {
      try {
        console.log('Fetching mission...');
        const response = await fetch(`/api/missions/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch mission');
        }
        const data = await response.json();
        console.log('Received mission:', data);
        setMission(data);
      } catch (err) {
        console.error('Error fetching mission:', err);
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
            <div className="flex flex-wrap gap-4 text-sm text-white/60">
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  mission.priority === 'high' ? 'bg-red-500' : 
                  mission.priority === 'medium' ? 'bg-yellow-500' : 
                  'bg-blue-500'
                }`} />
                <span className="capitalize">Priority: {mission.priority}</span>
              </span>
              <span>•</span>
              <span className={`capitalize px-2 py-0.5 rounded-full text-xs ${
                mission.status === 'active' ? 'bg-green-500/20 text-green-300' :
                mission.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                mission.status === 'completed' ? 'bg-blue-500/20 text-blue-300' :
                'bg-white/10 text-white/60'
              }`}>
                {mission.status}
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Due: {new Date(mission.endDate).toLocaleDateString()}
              </span>
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
                  <div key={feature.featureId} className="border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{feature.title}</h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        feature.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                        feature.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-white/10 text-white/60'
                      }`}>
                        {feature.status}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Progress</h2>
              <div className="space-y-4">
                <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${mission.progress.progressPercentage}%`,
                      background: `linear-gradient(90deg, rgb(var(--primary)) 0%, rgb(var(--primary-foreground)) 100%)`
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-white/60">
                    {mission.progress.completedFeatures} of {mission.progress.totalFeatures} features completed
                  </p>
                  <p className="font-medium">{mission.progress.progressPercentage}%</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Compute Required</p>
                    <p className="font-medium">{(mission.requirements?.computeRequired || 0).toLocaleString()} COMPUTE</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Estimated Duration</p>
                    <p className="font-medium">{mission.requirements?.estimatedDuration || 'Not specified'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-2">Required Capabilities</p>
                  <div className="flex flex-wrap gap-2">
                    {mission.requirements?.requiredCapabilities?.map((cap) => (
                      <span key={cap} className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20">
                        {cap}
                      </span>
                    )) || <span className="text-white/60">No specific capabilities required</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(mission.tags) && mission.tags.length > 0 ? (
                  mission.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-sm bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-white/60">No tags</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
