'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/shadcn/button'

interface CarouselItem {
    id: number
    content: string
}

interface InfiniteCarouselProps {
    autoloop?: boolean
    autoloopInterval?: number
}

const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({
    autoloop = false,
    autoloopInterval = 5000,
}) => {
    const [items, setItems] = useState<CarouselItem[]>([
        { id: 1, content: 'Item 1' },
        { id: 2, content: 'Item 2' },
        { id: 3, content: 'Item 3' },
        { id: 4, content: 'Item 4' },
        { id: 5, content: 'Item 5' },
    ])
    const [currentIndex, setCurrentIndex] = useState(1)
    const [direction, setDirection] = useState(0)

    const nextItem = useCallback(() => {
        setDirection(1)
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
    }, [items.length])

    const prevItem = useCallback(() => {
        setDirection(-1)
        setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % itemsLength)
    }, [items.length])

    useEffect(() => {
        if (autoloop) {
            const timer = setInterval(() => {
                nextItem()
            }, autoloopInterval)

            return () => clearInterval(timer)
        }
    }, [autoloop, autoloopInterval, nextItem])

    const getVisibleItems = () => {
        const itemCount = items.length
        const prevIndex = (currentIndex - 1 + itemCount) % itemCount
        const nextIndex = (currentIndex + 1) % itemCount

        return [
            items[prevIndex],
            items[currentIndex],
            items[nextIndex],
        ]
    }

    const visibleItems = getVisibleItems()

    return (
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
            <div className="flex justify-center items-center h-[56.25vw] max-h-[540px]">
                {visibleItems.map((item, index) => (
                    <div
                        key={item.id}
                        className={`absolute h-full transition-all duration-300 ease-in-out ${index === 1
                            ? 'z-20 opacity-100 scale-100'
                            : index === 0 && direction === 1
                                ? 'z-10 opacity-80 scale-80'
                                : index === 2 && direction === -1
                                    ? 'z-10 opacity-80 scale-80'
                                    : 'z-0 opacity-80 scale-80'
                            }`}
                        style={{
                            transform: `translateX(${(index - 1) * 60}%) ${index !== 1 ? 'scale(0.8)' : ''
                                }`,
                            left: '20%',
                            width: '60%',
                        }}
                    >
                        <div className="bg-gray-200 w-full h-full flex items-center justify-center text-2xl font-bold rounded-lg">
                            {item.content}
                        </div>
                    </div>
                ))}
            </div>
            {items.length > 3 && (
                <>
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-1/2 transform -translate-y-1/2 z-30"
                        style={{ left: '0%' }}
                        onClick={prevItem}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-1/2 transform -translate-y-1/2 z-30"
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

export default InfiniteCarousel

