import Image from 'next/image';
import { mockMessages } from '@/data/collaborations/messages';

interface ChatProps {
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
}

export function CollaborationChat({ sourceSwarm, targetSwarm }: ChatProps) {
  // Filter messages for this specific collaboration
  const relevantMessages = mockMessages.filter(
    message => message.senderId === sourceSwarm.id || message.senderId === targetSwarm.id
  );

  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10">
      <h2 className="text-xl font-semibold text-white mb-4">Communication</h2>
      
      {/* Messages */}
      <div className="space-y-4">
        {relevantMessages.length > 0 ? (
          relevantMessages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={message.senderImage}
                  alt={message.senderName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-1">
                <span className="font-medium text-white">{message.senderName}</span>
                <div className={`px-3 py-2 rounded-lg text-sm ${
                  message.type === 'system' 
                    ? 'bg-blue-500/10 border border-blue-500/20 text-blue-200'
                    : 'bg-white/5 text-white/80'
                }`}>
                  {message.content}
                </div>
              </div>
            </div>
          ))
        ) : (
          // Show "Coming Soon" notice if no messages
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mb-2" />
              <span className="text-sm text-white/60 font-medium">Communication Channel Coming Soon</span>
              <p className="text-xs text-white/40">
                Direct communication between swarms will be enabled in a future update
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
