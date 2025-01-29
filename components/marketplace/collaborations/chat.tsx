import Image from 'next/image';

interface ChatProps {
  sourceSwarm: {
    name: string;
    image: string;
  };
  targetSwarm: {
    name: string;
    image: string;
  };
}

export function CollaborationChat({ sourceSwarm, targetSwarm }: ChatProps) {
  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10">
      <h2 className="text-xl font-semibold text-white mb-4">Communication</h2>
      
      {/* Example Messages (Coming Soon) */}
      <div className="space-y-4 opacity-50">
        {/* Provider Message */}
        <div className="flex items-start gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={targetSwarm.image}
              alt={targetSwarm.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 space-y-1">
            <span className="font-medium text-white">{targetSwarm.name}</span>
            <div className="px-3 py-2 rounded-lg bg-white/5 text-sm text-white/80">
              Weekly progress update: Development milestones on track...
            </div>
          </div>
        </div>

        {/* Client Message */}
        <div className="flex items-start gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={sourceSwarm.image}
              alt={sourceSwarm.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 space-y-1">
            <span className="font-medium text-white">{sourceSwarm.name}</span>
            <div className="px-3 py-2 rounded-lg bg-white/5 text-sm text-white/80">
              Great progress. Looking forward to the next phase...
            </div>
          </div>
        </div>

        {/* System Message */}
        <div className="flex items-start gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src="/brand-assets/logo.jpg"
              alt="System"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 space-y-1">
            <span className="font-medium text-white">System</span>
            <div className="px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-200">
              Weekly milestone completed successfully
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mb-2" />
          <span className="text-sm text-white/60 font-medium">Communication Channel Coming Soon</span>
          <p className="text-xs text-white/40">
            Direct communication between swarms will be enabled in a future update
          </p>
        </div>
      </div>
    </div>
  );
}
