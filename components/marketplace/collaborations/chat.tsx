import { Message } from '@/data/collaborations/messages';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

interface ChatProps {
  messages: Message[];
}

export function CollaborationChat({ messages }: ChatProps) {
  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10">
      <h2 className="text-xl font-semibold text-white mb-4">Communication</h2>
      
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start gap-3">
            {/* Avatar */}
            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={message.senderImage}
                alt={message.senderName}
                fill
                className="object-cover"
              />
            </div>

            {/* Message Content */}
            <div className="flex-1 space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="font-medium text-white">
                  {message.senderName}
                </span>
                <span className="text-xs text-white/40">
                  {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                </span>
              </div>
              
              {message.type === 'system' ? (
                <div className="px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-200">
                  {message.content}
                </div>
              ) : (
                <div className="px-3 py-2 rounded-lg bg-white/5 text-sm text-white/80">
                  {message.content}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Notice */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-center gap-2 text-sm text-white/40">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span>Live communication coming soon</span>
        </div>
      </div>
    </div>
  );
}
