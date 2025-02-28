'use client';

type GalleryItemType = 'image' | 'video' | 'text';

interface GalleryItem {
    type: GalleryItemType;
    content: string;
}

interface Swarm {
    id: string;
    name: string;
    description?: string;
    gallery?: GalleryItem[];
    swarmType: string;
}

import { useCallback, useEffect, useState } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useRouter } from "next/navigation";
import { Markdown } from "@/components/ui/markdown";
import { Expandable } from "@/components/ui/expandable";
import { SwarmGallery } from "@/components/swarms/gallery";

export default function InceptionSwarm({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [swarm, setSwarm] = useState<Swarm | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchSwarm() {
            try {
                const response = await fetch(`/api/swarms/${params.id}`);
                if (!response.ok) {
                    router.push('/404');
                    return;
                }
                const data: Swarm = await response.json();
                if (data.swarmType !== 'inception') {
                    router.push(`/invest/${data.id}`);
                    return;
                }
                setSwarm(data);
            } catch (error) {
                console.error('Error fetching swarm:', error);
                router.push('/404');
            } finally {
                setIsLoading(false);
            }
        }
        fetchSwarm();
    }, [params.id, router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!swarm) {
        return null;
    }

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
            <SwarmGallery
                className="mt-16"
                gallery={swarm.gallery}
                swarmName={swarm.name}
            />
            {swarm.description &&
                <>
                    <h4 className="font-semibold mt-16">About {swarm.name}</h4>
                    <hr className="mt-3" />
                    <Expandable overflowThreshold={750}>
                        <Markdown markdown={swarm.description} />
                    </Expandable>
                </>
            }
        </main>
    )
}
