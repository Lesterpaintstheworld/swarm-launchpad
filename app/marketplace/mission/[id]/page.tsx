'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Cpu, Calendar, Clock, Target, Users, ChevronRight, GitBranch, CheckCircle } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { ConnectButton } from '@/components/solana/connectButton';
import { useWallet } from '@solana/wallet-adapter-react';
import { ClientMarkdown } from '@/components/ui/clientMarkdown';
import { Mission } from '@/components/marketplace/types';

export default function MissionDetailsPage({ params }: { params: { id: string } }) {
  const [mission, setMission] = useState<Mission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { connected } = useWallet();

  useEffect(() => {
    async function fetchMission() {
      try {
        const response = await fetch(`/api/missions/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch mission');
        }
        const data = await response.json();
        setMission(data);
      } catch (error) {
        console.error('Error fetching mission:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    }

    fetchMission();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/5 rounded w-1/4"></div>
            <div className="h-32 bg-white/5 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!mission) {
    notFound();
  }

  const crumbs = [
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Missions', href: '/marketplace?tab=missions' },
    { label: mission.title }
  ];

  const handleAcceptMission = () => {
    console.log('Accepting mission:', mission.id);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-8 space-y-6">
        <Breadcrumb crumbs={crumbs} />

        {/* Header Section */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    mission.priority === 'high' ? 'bg-red-500' : 
                    mission.priority === 'medium' ? 'bg-yellow-500' : 
                    'bg-blue-500'
                  }`} />
                  <h1 className="text-2xl font-bold text-white">{mission.title}</h1>
                </div>
                <p className="text-lg text-white/60">{mission.description}</p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Calendar className="w-4 h-4" />
                  <span>Start: {new Date(mission.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Target className="w-4 h-4" />
                  <span>Due: {new Date(mission.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Clock className="w-4 h-4" />
                  <span>{mission.requirements?.estimatedDuration}</span>
                </div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full ${
              mission.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
              mission.status === 'completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
              'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
            } border`}>
              <span className="text-sm font-medium capitalize">{mission.status}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Section */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Progress</h2>
              <div className="space-y-4">
                <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${mission.progress?.progressPercentage || 0}%`,
                      background: `linear-gradient(90deg, rgb(var(--primary)) 0%, rgb(var(--primary-foreground)) 100%)`
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">
                    {mission.progress?.completedFeatures || 0} of {mission.progress?.totalFeatures || 0} features completed
                  </span>
                  <span className="font-medium text-white">{mission.progress?.progressPercentage || 0}%</span>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Features & Deliverables</h2>
              <div className="space-y-4">
                {mission.features?.map((feature) => (
                  <div 
                    key={feature.featureId}
                    className="p-4 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-white/40" />
                        <h3 className="font-medium text-white">{feature.title}</h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        feature.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                        feature.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-white/10 text-white/60'
                      }`}>
                        {feature.status}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm ml-6">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Section */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Team</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-white/60">Lead Swarm</h3>
                  <div className="flex items-center gap-2 text-white">
                    <Users className="w-4 h-4" />
                    <span>{mission.leadSwarm}</span>
                  </div>
                </div>
                
                {mission.participatingSwarms?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-white/60">Participating Swarms</h3>
                    <div className="flex flex-wrap gap-2">
                      {mission.participatingSwarms.map((swarm) => (
                        <span 
                          key={swarm}
                          className="px-3 py-1 rounded-full bg-white/5 text-white text-sm"
                        >
                          {swarm}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mission Reward Card */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-6 sticky top-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4">Mission Reward</h2>
                  <div className="flex items-baseline gap-2">
                    <Cpu className="w-5 h-5 text-white/40" />
                    <span className="text-3xl font-bold text-white">
                      {mission.requirements?.computeRequired?.toLocaleString() || '0'}
                    </span>
                    <span className="metallic-text text-xl font-semibold">
                      $COMPUTE
                    </span>
                  </div>
                </div>

                {/* Requirements */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-white/60">Required Capabilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {mission.requirements?.requiredCapabilities?.map((capability) => (
                      <span
                        key={capability}
                        className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                {connected ? (
                  <Button 
                    className="w-full"
                    onClick={handleAcceptMission}
                  >
                    Accept Mission
                  </Button>
                ) : (
                  <ConnectButton className="w-full" />
                )}

                <p className="text-xs text-white/40 text-center">
                  By accepting this mission, you agree to complete it within the specified deadline
                </p>
              </div>
            </div>

            {/* Tags Card */}
            {mission.tags?.length > 0 && (
              <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {mission.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-sm bg-white/5 text-white/60 hover:bg-white/10 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
