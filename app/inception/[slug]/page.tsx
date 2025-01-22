'use client';

import { useCallback } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SwarmData } from "@/data/swarms/info";
import { useRouter } from "next/navigation";
import { Markdown } from "@/components/ui/markdown";
import { Expandable } from "@/components/ui/expandable";
import { SwarmGallery } from "@/components/swarms/gallery";

export default function InceptionSwarm({ params }: { params: { slug: string } }) {
    const router = useRouter();

    const swarm = useCallback(() => {
        const found = SwarmData.find((swarm) => swarm.id === params.slug);
        if (!found) {
            router.push('/404');
            return null;
        }
        // Only redirect if it's not an inception swarm
        if (found.swarmType !== 'inception') {
            router.push(`/invest/${found.id}`);
            return null;
        }
        return found;
    }, [params.slug, router])();

    // If no swarm was found, return null while redirecting
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
