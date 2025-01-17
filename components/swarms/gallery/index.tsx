'use client'

import { SwarmGalleryItem as GalleryItem } from "@/components/swarms/swarm.types";
import { InfiniteCarousel, Slides } from "@/components/ui/infiniteCarousel";
import Image from "next/image";
import { useCallback } from "react";

interface SwarmGalleryProps {
    gallery: GalleryItem[];
    swarmName: string;
    className?: string;
}

export const SwarmGallery = ({ gallery, swarmName, className }: SwarmGalleryProps) => {
    const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.target as HTMLImageElement;
        img.src = '/default.png';
    }, []);

    const prepareSlides = useCallback(() => {
        return gallery.map((item: GalleryItem, index: number) => {
            let content;
            if (item.type === 'image') {
                content = <Image 
                    src={item.content as string}
                    alt={`${swarmName} carousel item ${index}`} 
                    width={1048} 
                    height={600} 
                    className="w-full object-cover"
                    onError={handleImageError}
                />
            } else if (item.type === 'video') {
                content = <video autoPlay={index === 1} controls muted={index === 1}>
                    <source src={item.content as string} type="video/mp4" className="h-full" />
                </video>
            } else {
                content = item.content;
            }
            return { id: index, content };
        }) as Slides;
    }, [gallery, swarmName, handleImageError]);

    return (
        <InfiniteCarousel
            className={className}
            slides={prepareSlides()}
        />
    );
}
