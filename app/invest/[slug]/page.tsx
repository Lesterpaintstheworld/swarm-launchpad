import { useCallback } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AgentData } from "@/data/agents/info";
import { redirect } from "next/navigation";
import { Markdown } from "@/components/ui/markdown";
import { Expandable } from "@/components/ui/expandable";
import { InfiniteCarousel, Slides } from "@/components/ui/infiniteCarousel";

export default function Agent({ params }: { params: { slug: string } }) {

    const agent = useCallback(() => AgentData.find((agent) => agent.id === params.slug), [params.slug])() || undefined;

    if (!agent) {
        redirect('/404');
    }

    const prepareSlides = useCallback(() => {
        return agent.gallery.map((item, index) => {
            let content;
            if (item.type === 'image') {
                content = <img src={item.content as string} alt={`${agent.name} carousel item ${index}`} className="w-full object-cover" />
            } else if (item.type === 'video') {
                content = <video autoPlay={index === 1} controls muted={index === 1}><source src={item.content as string} type="video/mp4" className="h-full" /></video>
            } else {
                content = item.content;
            }
            return { id: index, content };
        }) as Slides;
    }, [agent])

    return (
        <main className="container">
            <Breadcrumb
                className="mt-4"
                crumbs={[
                    { label: "Agents", href: "/invest" },
                    { label: agent.name }
                ]}
            />
            <h1 className="font-bold mt-2">{agent.name}</h1>
            <InfiniteCarousel
                className="my-16"
                slides={prepareSlides()}
            />
            <Expandable>
                <Markdown markdown={agent.description} />
            </Expandable>
        </main>
    )

}
