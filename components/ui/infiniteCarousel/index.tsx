'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { AnimatePresence, motion } from 'motion/react';
import css from './infiniteCarousel.module.css';
import { cn } from '@/lib/utils';

interface CarouselSlide {
    id: number;
    content: React.ReactNode;
}

type Slides = [CarouselSlide, CarouselSlide, CarouselSlide, ...CarouselSlide[]];

interface InfiniteCarouselProps {
    autoloop?: boolean
    autoloopInterval?: number;
    slides: Slides;
    className?: string;
}

const InfiniteCarousel = ({
    autoloop = false,
    autoloopInterval = 5000,
    slides,
    className
}: InfiniteCarouselProps) => {

    const [currentIndex, setCurrentIndex] = useState(1);
    const [direction, setDirection] = useState(0);

    const nextItem = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, [slides.length]);

    const prevItem = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        if (autoloop) {
            const timer = setInterval(() => {
                nextItem();
            }, autoloopInterval);

            return () => clearInterval(timer);
        };
    }, [autoloop, autoloopInterval, nextItem]);

    const getVisibleslides = () => {
        const itemCount = slides.length;
        const prevIndex = (currentIndex - 1 + itemCount) % itemCount;
        const nextIndex = (currentIndex + 1) % itemCount;

        return [
            slides[prevIndex],
            slides[currentIndex],
            slides[nextIndex],
        ];
    }

    const visibleslides = getVisibleslides();

    return (
        <div className={cn('relative aspect-[200/79]', className)}>
            <div className="flex h-full justify-center">
                <AnimatePresence>
                    {visibleslides.map((item: CarouselSlide, index: number) => (
                        <motion.div
                            key={item.id}
                            exit={{ opacity: 0 }}
                            className={`
                                absolute aspect-video opacity-50 transition-all duration-300 ease-in-out border border-border rounded-lg bg-card
                                ${index === 2 && direction === 1 && css['animate-in-right']}
                                ${index === 0 && direction === -1 && css['animate-in-left']}
                                ${index === 1 ? 'z-20 !opacity-100 scale-100 shadow'
                                    : index === 0 && direction === 1
                                        ? 'z-10 scale-80'
                                        : index === 2 && direction === -1
                                            ? 'z-10 scale-80'
                                            : 'z-0 scale-80'
                                }
                            `}
                            style={{
                                transform: `translateX(${(index - 1) * 31.5}%) ${index !== 1 ? 'scale(0.8)' : ''
                                    }`,
                                left: '15%',
                                width: '70%',
                            }}
                        >
                            <div className="bg-popover aspect-video flex slides-center justify-center text-2xl font-bold rounded-lg overflow-hidden">
                                {item.content}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            {slides.length > 1 && (
                <>
                    <Button
                        size="icon"
                        className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-30 rounded-full hover:bg-popover"
                        style={{ left: '0%' }}
                        onClick={prevItem}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon"
                        className="absolute top-1/2 transform -translate-y-1/2 translate-x-1/2 z-30 rounded-full hover:bg-popover"
                        style={{ right: '0%' }}
                        onClick={nextItem}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </>
            )}
        </div>
    )
}

export { InfiniteCarousel }
export type { CarouselSlide, InfiniteCarouselProps, Slides }
