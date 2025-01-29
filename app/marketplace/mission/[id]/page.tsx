'use client';

import { getMission } from '@/data/missions/missions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Cpu } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { ConnectButton } from '@/components/solana/connectButton';
import { useWallet } from '@solana/wallet-adapter-react';

export default function MissionDetailsPage({ params }: { params: { id: string } }) {
  const mission = getMission(params.id);
  const { connected } = useWallet();

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
              {mission.requiredCapabilities.map((capability) => (
                <span
                  key={capability}
                  className="px-3 py-1.5 text-sm rounded-full bg-white/5 text-white/60"
                >
                  {capability}
                </span>
              ))}
            </div>
          </div>

          {/* Requester Information */}
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
                    {mission.reward.toLocaleString()}
                  </span>
                  <span className="metallic-text text-xl font-semibold">
                    $COMPUTE
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Deadline</span>
                  <span className="text-white">{new Date(mission.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Estimated Duration</span>
                  <span className="text-white">{mission.estimatedDuration}</span>
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
