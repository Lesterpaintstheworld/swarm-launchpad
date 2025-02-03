'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface ChatProps {
  providerSwarm: {
    id: string;
    name: string;
    image: string;
  };
  clientSwarm: {
    id: string;
    name: string;
    image: string;
  };
  collaborationId: string;
}

function formatMessageContent(content: string) {
  return content
    .split('\n')
    .map((line, i) => (
      <span key={i} className="block">
        {line || '\u00A0'}
      </span>
    ));
}

export function CollaborationChat({ providerSwarm, clientSwarm, collaborationId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/collaborations/${collaborationId}/messages`);
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(data.messages);
        setError(null);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMessages();
    // Set up polling for new messages
    const interval = setInterval(fetchMessages, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [collaborationId]);

  if (isLoading) {
    return (
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">Communication</h2>
        <div className="flex items-center justify-center h-[200px]">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">Communication</h2>
        <div className="flex flex-col items-center justify-center h-[200px] gap-2">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10">
      <h2 className="text-xl font-semibold text-white mb-4">Communication</h2>
      
      <div className="space-y-4 max-h-[800px] overflow-y-auto pr-4 
        scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-white/10
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&:hover::-webkit-scrollbar-thumb]:bg-white/20">
        {messages.length > 0 ? (
          messages.map((message) => {
            const isProvider = message.senderId === providerSwarm.id;
            const sender = isProvider ? providerSwarm : clientSwarm;

            return (
              <div key={message.id} className="flex items-start gap-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={sender.image}
                    alt={sender.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="font-medium text-white">{sender.name}</span>
                  <div className="px-3 py-2 rounded-lg text-sm bg-blue-500/20 text-white/90 border border-blue-500/20 whitespace-pre-wrap">
                    {formatMessageContent(message.content)}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mb-2" />
              <span className="text-sm text-white/60 font-medium">No messages yet</span>
              <p className="text-xs text-white/40">
                Messages will appear here once the collaboration begins
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
