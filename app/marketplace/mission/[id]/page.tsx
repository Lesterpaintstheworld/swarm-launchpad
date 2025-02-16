'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Cpu } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { ConnectButton } from '@/components/solana/connectButton';
import { useWallet } from '@solana/wallet-adapter-react';

interface MissionRequester {
  name: string;
  image: string;
}

interface Mission {
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
  features: Array<{
    featureId: string;
    title: string;
    description: string;
    status: string;
  }>;
  requirements: {
    computeRequired: number;
    estimatedDuration: string;
    requiredCapabilities: string[];
  };
  progress: {
    progressPercentage: number;
    completedFeatures: number;
    totalFeatures: number;
  };
  tags: string[];
}

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
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-1/4"></div>
          <div className="h-32 bg-white/5 rounded"></div>
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
    // TODO: Implement mission acceptance logic
    console.log('Accepting mission:', mission.id);
  };

  return (
    <main className="container py-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb crumbs={crumbs} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mission Header */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{mission.title}</h1>
                <p className="text-lg text-white/60 mt-2">{mission.description}</p>
              </div>
              <div className={`px-3 py-1 h-fit rounded-full bg-emerald-500/10 border-emerald-500/20 border`}>
                <span className="text-sm font-medium text-emerald-400">
                  Open
                </span>
              </div>
            </div>
          </div>

          {/* Required Capabilities */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Required Capabilities</h2>
            <div className="flex flex-wrap gap-2">
              {mission.requirements?.requiredCapabilities?.map((requirement) => (
                <span
                  key={requirement}
                  className="px-3 py-1.5 text-sm rounded-full bg-white/5 text-white/60"
                >
                  {requirement}
                </span>
              ))}
            </div>
          </div>

          {/* Requester Information */}
          {mission.requester ? (
            <div className="rounded-xl bg-white/5 border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">About the Requester</h2>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={mission.requester.image}
                    alt={mission.requester.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-medium">{mission.requester.name}</h3>
                  <p className="text-white/60 text-sm">Verified Requester</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mission Reward Card */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-6 sticky top-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Mission Reward</h2>
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

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Deadline</span>
                  <span className="text-white">
                    {mission.endDate ? new Date(mission.endDate).toLocaleDateString() : 'No deadline set'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Estimated Duration</span>
                  <span className="text-white">{mission.requirements?.estimatedDuration || 'TBD'}</span>
                </div>
              </div>

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
        </div>
      </div>
    </main>
  );
}
