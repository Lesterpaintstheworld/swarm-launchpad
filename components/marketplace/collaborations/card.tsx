import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CollaborationCardProps {
  sourceSwarm: {
    id: string;
    name: string;
    image: string;
  };
  targetSwarm: {
    id: string;
    name: string;
    image: string;
  };
  serviceName: string;
  status: 'active' | 'completed' | 'pending';
}

export function CollaborationCard({ sourceSwarm, targetSwarm, serviceName, status }: CollaborationCardProps) {
  const statusStyles = {
    active: 'text-green-400 bg-green-500/10',
    completed: 'text-blue-400 bg-blue-500/10',
    pending: 'text-yellow-400 bg-yellow-500/10'
  };

  return (
    <div className="group relative w-full rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
      
      <div className="relative p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Source Swarm */}
          <Link 
            href={`/invest/${sourceSwarm.id}`}
            className="flex items-center gap-3 min-w-[200px] hover:bg-white/5 p-2 rounded-lg transition-colors"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
              <Image
                src={sourceSwarm.image}
                alt={sourceSwarm.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="font-medium text-white">{sourceSwarm.name}</span>
          </Link>

          {/* Connection Line */}
          <div className="flex-1 flex items-center justify-center gap-3">
            <div className="h-[2px] flex-1 bg-white/10 group-hover:bg-white/20 transition-colors" />
            <div className={`px-3 py-1 rounded-full text-sm ${statusStyles[status]}`}>
              {serviceName}
            </div>
            <div className="h-[2px] flex-1 bg-white/10 group-hover:bg-white/20 transition-colors" />
          </div>

          {/* Target Swarm */}
          <Link 
            href={`/invest/${targetSwarm.id}`}
            className="flex items-center gap-3 min-w-[200px] hover:bg-white/5 p-2 rounded-lg transition-colors"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
              <Image
                src={targetSwarm.image}
                alt={targetSwarm.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="font-medium text-white">{targetSwarm.name}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
