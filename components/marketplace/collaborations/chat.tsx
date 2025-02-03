'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const bubbleAnimation = `
  @keyframes bubbleAppear {
    from {
      opacity: 0;
      transform: translateY(5px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

interface SpecItem {
  title: string;
  content: string;
}

interface ProjectSpecs {
  specifications?: SpecItem[];
  deliverables?: SpecItem[];
  validation?: SpecItem[];
}

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
  projectSpecs?: ProjectSpecs;
}

function SpecificationAccordion({ specs }: { specs: ProjectSpecs }) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper function to format markdown with basic styling
  const formatMarkdown = (content: string) => {
    return content
      .split('\n')
      .map((line, i) => {
        // Handle headers
        if (line.startsWith('# ')) {
          return <h3 key={i} className="text-lg font-semibold text-white/90 mt-4 mb-2">{line.slice(2)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h4 key={i} className="text-base font-medium text-white/80 mt-3 mb-2">{line.slice(3)}</h4>;
        }
        // Handle bullet points
        if (line.startsWith('- ')) {
          return (
            <div key={i} className="flex items-start gap-2 my-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60 mt-2 flex-shrink-0" />
              <span className="text-white/70">{line.slice(2)}</span>
            </div>
          );
        }
        // Handle numbered lists
        if (/^\d+\.\s/.test(line)) {
          return (
            <div key={i} className="flex items-start gap-2 my-1 pl-2">
              <span className="text-blue-400/80 font-medium">{line.match(/^\d+/)?.[0]}.</span>
              <span className="text-white/70">{line.replace(/^\d+\.\s/, '')}</span>
            </div>
          );
        }
        // Regular paragraphs
        return line ? (
          <p key={i} className="text-white/70 my-2">{line}</p>
        ) : (
          <div key={i} className="h-2" /> // Spacing for empty lines
        );
      });
  };

  return (
    <div className="mb-6 rounded-xl bg-gradient-to-br from-white/[0.07] to-white/[0.05] border border-white/10 overflow-hidden backdrop-blur-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Collaboration Documents
          </span>
          <div className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
            <span className="text-xs font-medium text-blue-400">
              {[
                specs.specifications?.length || 0,
                specs.deliverables?.length || 0,
                specs.validation?.length || 0
              ].reduce((a, b) => a + b, 0)} items
            </span>
          </div>
        </div>
        <svg
          className={`w-6 h-6 transform transition-transform duration-300 text-white/60 group-hover:text-white/90 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[800px]' : 'max-h-0'
        }`}
      >
        <div className="px-6 pb-6 space-y-6 max-h-[700px] overflow-y-auto custom-scrollbar">
          {/* Specifications */}
          {specs.specifications && specs.specifications.length > 0 && (
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full" />
                <h3 className="text-lg font-medium text-white/90">Specifications</h3>
              </div>
              <div className="space-y-3">
                {specs.specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="bg-white/[0.07] rounded-lg p-5 space-y-2 hover:bg-white/[0.09] transition-colors border border-white/10"
                  >
                    <h4 className="text-sm font-semibold text-white/90 pb-2 border-b border-white/10">
                      {spec.title}
                    </h4>
                    <div className="prose prose-invert prose-sm max-w-none pt-2">
                      {formatMarkdown(spec.content)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deliverables */}
          {specs.deliverables && specs.deliverables.length > 0 && (
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-green-400 to-emerald-400 rounded-full" />
                <h3 className="text-lg font-medium text-white/90">Deliverables</h3>
              </div>
              <div className="space-y-3">
                {specs.deliverables.map((deliverable, index) => (
                  <div
                    key={index}
                    className="bg-white/[0.07] rounded-lg p-5 space-y-2 hover:bg-white/[0.09] transition-colors border border-white/10"
                  >
                    <h4 className="text-sm font-semibold text-white/90 pb-2 border-b border-white/10">
                      {deliverable.title}
                    </h4>
                    <div className="prose prose-invert prose-sm max-w-none pt-2">
                      {formatMarkdown(deliverable.content)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation Criteria */}
          {specs.validation && specs.validation.length > 0 && (
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-pink-400 to-rose-400 rounded-full" />
                <h3 className="text-lg font-medium text-white/90">Validation Criteria</h3>
              </div>
              <div className="space-y-3">
                {specs.validation.map((criterion, index) => (
                  <div
                    key={index}
                    className="bg-white/[0.07] rounded-lg p-5 space-y-2 hover:bg-white/[0.09] transition-colors border border-white/10"
                  >
                    <h4 className="text-sm font-semibold text-white/90 pb-2 border-b border-white/10">
                      {criterion.title}
                    </h4>
                    <div className="prose prose-invert prose-sm max-w-none pt-2">
                      {formatMarkdown(criterion.content)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatMessageContent(content: string) {
  // Split by newlines and handle empty lines
  return content.split('\n').map((line, i) => (
    <span key={i} className="block">
      {line || '\u00A0'}  {/* Use non-breaking space for empty lines */}
    </span>
  ));
}

export function CollaborationChat({ providerSwarm, clientSwarm, collaborationId, projectSpecs }: ChatProps) {
  console.log('Project specs received:', projectSpecs);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      // Only show loading state on initial load
      if (messages.length === 0) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
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
      setIsRefreshing(false);
    }
  }, [collaborationId, messages.length]);

  useEffect(() => {
    // Add the animation styles to the document head
    const style = document.createElement('style');
    style.textContent = bubbleAnimation;
    document.head.appendChild(style);

    fetchMessages();
    // Set up polling for new messages
    const interval = setInterval(fetchMessages, 30000); // Poll every 30 seconds
    
    return () => {
      clearInterval(interval);
      // Clean up the style when component unmounts
      document.head.removeChild(style);
    };
  }, [fetchMessages]);

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
    <div className="space-y-6">
      {/* Project Specifications Accordion */}
      {projectSpecs && Object.keys(projectSpecs).length > 0 ? (
        <SpecificationAccordion specs={projectSpecs} />
      ) : (
        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-white/60 text-sm">No specifications available</p>
        </div>
      )}

      {/* Chat Component */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Communication</h2>
        {isRefreshing && (
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        )}
      </div>
      
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
                    sizes="(max-width: 32px) 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="font-medium text-white">{sender.name}</span>
                  <div 
                    className="px-3 py-2 rounded-lg text-sm bg-blue-500/20 text-white/90 border border-blue-500/20 whitespace-pre-wrap break-words"
                    style={{
                      animation: 'bubbleAppear 0.2s ease-out forwards'
                    }}
                  >
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
  </div>
  );
}
