'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface CarouselProps {
  items: React.ReactNode[];
  className?: string;
}

export function Carousel({ items, className }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrentIndex((current) => (current + 1) % items.length);
  }, [items.length]);

  const prev = () => {
    setCurrentIndex((current) => (current - 1 + items.length) % items.length);
  };

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(next, 5000);
      return () => clearInterval(timer);
    }
  }, [next, isPaused]);

  return (
    <div 
      className={cn("relative group", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="overflow-hidden rounded-xl">
        <div 
          className="transition-transform duration-500 ease-in-out flex"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div 
              key={index}
              className="min-w-full"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index === currentIndex ? "bg-white" : "bg-white/20"
            )}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={prev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={next}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
