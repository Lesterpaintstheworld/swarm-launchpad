import { useCallback } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SwarmData } from "@/data/swarms/info";
import { redirect } from "next/navigation";
import { Markdown } from "@/components/ui/markdown";
import { Expandable } from "@/components/ui/expandable";
import { SwarmGallery } from "@/components/swarms/gallery";

export default function InceptionSwarm({ params }: { params: { slug: string } }) {
    const swarm = useCallback(() => SwarmData.find((swarm) => swarm.id === params.slug), [params.slug])() || undefined;

    // First check if swarm exists at all
    if (!swarm) {
        redirect('/404');
    }

    // Then check if it's an inception swarm - if not, redirect to regular invest page
    if (swarm.swarmType !== 'inception') {
        redirect('/invest/' + swarm.id);
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
