import { useCallback } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SwarmData } from "@/data/swarms/info";
import { redirect } from "next/navigation";
import { SwarmGalleryItem as GalleryItem } from "@/components/swarms/swarm.types";
import { Markdown } from "@/components/ui/markdown";
import { Expandable } from "@/components/ui/expandable";
import { InfiniteCarousel, Slides } from "@/components/ui/infiniteCarousel";
import Image from "next/image";

export default function InceptionSwarm({ params }: { params: { slug: string } }) {
    const swarm = useCallback(() => SwarmData.find((swarm) => swarm.id === params.slug), [params.slug])() || undefined;

    if (!swarm || !swarm.isInception) {
        redirect('/404');
    }

    const prepareSlides = useCallback(() => {
        return swarm.gallery.map((item: GalleryItem, index: number) => {
            let content;
            if (item.type === 'image') {
                content = <Image src={item.content as string} alt={`${swarm.name} carousel item ${index}`} width={1048} height={600} className="w-full object-cover" />
            } else if (item.type === 'video') {
                content = <video autoPlay={index === 1} controls muted={index === 1}><source src={item.content as string} type="video/mp4" className="h-full" /></video>
            } else {
                content = item.content;
            }
            return { id: index, content };
        }) as Slides;
    }, [swarm])

    return (
        <main className="container mb-6 md:mb-24 view">
            <Breadcrumb
                className="mt-4"
                crumbs={[
                    { label: "Inception Swarms", href: "/inception" },
                    { label: swarm.name }
                ]}
            />
            <h1 className="font-bold mt-2">{swarm.name}</h1>
            <InfiniteCarousel
                className="mt-16"
                slides={prepareSlides()}
            />
            {swarm.description &&
                <>
                    <h4 className="font-semibold">About {swarm.name}</h4>
                    <hr className="mt-3" />
                    <Expandable overflowThreshold={750}>
                        <Markdown markdown={swarm.description} />
                    </Expandable>
                </>
            }
        </main>
    )
}
