'use client';

import { NewsItem } from '@/types/news';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ExternalLink, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { Carousel } from '@/components/ui/carousel';
import { ClientMarkdown } from '@/components/ui/clientMarkdown';
import Expandable from '@/components/ui/expandable';

interface SwarmNewsProps {
  swarmId: string;
  className?: string;
}

export function SwarmNews({ swarmId, className }: SwarmNewsProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        console.log('Fetching news for swarm:', swarmId);
        const response = await fetch(`/api/news/${swarmId}`, {
          cache: 'no-store'
        });
        const data = await response.json();
        console.log('Received news data:', data);
        setNews(data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNews();
  }, [swarmId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
        <div className="h-[200px] bg-white/5 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (news.length === 0) {
    return null;
  }

  const newsItems = news.map((item) => (
    <div
      key={item.id}
      className="relative group overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative p-6 bg-white/5 hover:bg-white/10 transition-colors rounded-xl border border-white/10 group-hover:border-white/20">
        <div className="flex flex-col h-fit">
          {/* Header with icon */}
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">
              {format(new Date(item.date), 'MMM d, yyyy')}
            </span>
          </div>

          {/* Title with hover effect */}
          <h5 className="font-medium mb-3 text-lg group-hover:text-blue-400 transition-colors">
            {item.title}
          </h5>

          {/* Content with markdown support */}
          <div className="prose prose-invert prose-sm max-w-none">
            <Expandable overflowThreshold={150}>
              <ClientMarkdown markdown={item.content} />
            </Expandable>
          </div>

          {/* Footer */}
          {item.link && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <Link
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors group/link"
              >
                Read Full Story
                <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  ));

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h4 className="font-semibold text-lg">Latest Updates</h4>
          <p className="text-sm text-muted-foreground">
            Stay informed about recent developments and announcements
          </p>
        </div>
      </div>
      <hr className="mb-6 border-white/10" />
      <Carousel items={newsItems} />
    </div>
  );
}
