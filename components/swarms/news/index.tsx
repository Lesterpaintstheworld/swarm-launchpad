'use client';

import { NewsItem } from '@/types/news';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Carousel } from '@/components/ui/carousel';

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
        const response = await fetch(`/api/news/${swarmId}`);
        const data = await response.json();
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
    return <div className="animate-pulse h-32 bg-white/5 rounded-xl" />;
  }

  if (news.length === 0) {
    return null;
  }

  const newsItems = news.map((item) => (
    <div
      key={item.id}
      className="p-6 bg-white/5 hover:bg-white/10 transition-colors h-full"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h5 className="font-medium mb-2">{item.title}</h5>
          <p className="text-muted-foreground">{item.content}</p>
        </div>
        <div className="mt-4 flex justify-between items-end">
          <p className="text-sm text-muted-foreground">
            {format(new Date(item.date), 'MMM d, yyyy')}
          </p>
          {item.link && (
            <Link
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Read More <ExternalLink className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  ));

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold">Latest News</h4>
      </div>
      <hr className="mb-6" />
      <Carousel items={newsItems} />
    </div>
  );
}
