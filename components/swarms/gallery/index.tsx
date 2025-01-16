'use client'

import { SwarmGalleryItem as GalleryItem } from "@/components/swarms/swarm.types";
import { InfiniteCarousel, Slides } from "@/components/ui/infiniteCarousel";
import Image from "next/image";
import { useState } from "react";

interface SwarmGalleryProps {
    gallery: GalleryItem[];
    swarmName: string;
    className?: string;
}

export const SwarmGallery = ({ gallery, swarmName, className }: SwarmGalleryProps) => {
    const prepareSlides = () => {
        return gallery.map((item: GalleryItem, index: number) => {
            let content;
            if (item.type === 'image') {
                const [imgSrc, setImgSrc] = useState(item.content as string);
                content = <Image 
                    src={imgSrc}
                    alt={`${swarmName} carousel item ${index}`} 
                    width={1048} 
                    height={600} 
                    className="w-full object-cover"
                    onError={() => {
                        setImgSrc('/default.png')
                    }}
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
    }

    return (
        <InfiniteCarousel
            className={className}
            slides={prepareSlides()}
        />
    );
}
