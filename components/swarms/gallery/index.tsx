'use client'

import { SwarmGalleryItem as GalleryItem } from "@/components/swarms/swarm.types";
import { InfiniteCarousel, Slides } from "@/components/ui/infiniteCarousel";
import Image from "next/image";
import { useCallback } from "react";

interface SwarmGalleryProps {
    gallery?: GalleryItem[];  // Make gallery optional
    swarmName: string;
    className?: string;
}

export const SwarmGallery = ({ gallery, swarmName, className }: SwarmGalleryProps) => {
    const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.target as HTMLImageElement;
        img.src = '/default.png';
    }, []);

    const prepareSlides = useCallback(() => {
        // Guard clause - return null if gallery is undefined or empty
        if (!gallery || gallery.length === 0) {
            return null;
        }

        // Create initial slides from gallery items
        const slides = gallery.map((item: GalleryItem, index: number) => {
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
            } else if (item.type === 'video' && item.content.includes('.mp4')) {
                content = <video autoPlay={index === 1} controls muted={index === 1}>
                    <source src={item.content as string} type="video/mp4" className="h-full" />
                </video>
            } else if (item.type === 'video' && item.content.includes('youtube')) {
                content =
                <iframe 
                    id="player" 
                    width="640" 
                    height="390"
                    src={`${item.content}?enablejsapi=1&origin=https://localhost:3000/invest/digitalkin-partner-id.com`}
                ></iframe>
            } else {
                content = item.content;
            }
            return { id: index, content };
        });

        // Create a new array with padding if needed
        const paddedSlides = [...slides];
        while (paddedSlides.length < 3) {
            paddedSlides.push({ ...slides[0], id: paddedSlides.length });
        }

        return paddedSlides as Slides;
    }, [gallery, swarmName, handleImageError]);

    // Don't render anything if there's no gallery or slides
    if (!gallery || gallery.length === 0 || !prepareSlides()) {
        return null;
    }

    return (
        <InfiniteCarousel
            className={className}
            slides={prepareSlides()!}
        />
    );
}
