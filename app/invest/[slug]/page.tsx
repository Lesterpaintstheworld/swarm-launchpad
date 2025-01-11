import { useCallback } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AgentData } from "@/data/agents/info";
import { redirect } from "next/navigation";
import { Markdown } from "@/components/ui/markdown";
import { Expandable } from "@/components/ui/expandable";
import { InfiniteCarousel, Slides } from "@/components/ui/infiniteCarousel";
import { AgentInvestCard } from "@/components/agents/invest";

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
        <main className="container mb-6 md:mb-24">
            <Breadcrumb
                className="mt-4"
                crumbs={[
                    { label: "Agents", href: "/invest" },
                    { label: agent.name }
                ]}
            />
            <h1 className="font-bold mt-2">{agent.name}</h1>
            <InfiniteCarousel
                className="mt-24"
                slides={prepareSlides()}
            />
            <AgentInvestCard
                className="mt-24 mb-12"
                data={{
                    totalSupply: 1000045155,
                    pricePerShare: 1000,
                    remainingSupply: 450216315
                }}
            />
            {agent.description &&
                <>
                    <h4 className="font-semibold">About {agent.name}</h4>
                    <hr className="mt-3 mb-6" />
                    <Expandable overflowThreshold={750}>
                        <Markdown markdown={agent.description} />
                    </Expandable>
                </>
            }
        </main>
    )

}
