import { useCallback } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AgentData } from "@/data/agents/info";
import { redirect } from "next/navigation";
import { Markdown } from "@/components/ui/markdown";
import { Expandable } from "@/components/ui/expandable";

export default function Agent({ params }: { params: { slug: string } }) {

    const agent = useCallback(() => AgentData.find((agent) => agent.id === params.slug), [params.slug])() || undefined;

    if (!agent) {
        redirect('/404');
    }

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
            <Expandable>
                <Markdown markdown={agent.description} />
            </Expandable>
        </main>
    )

}
