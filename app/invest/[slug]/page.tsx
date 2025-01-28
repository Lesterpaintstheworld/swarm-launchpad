import { SwarmData } from "@/data/swarms/info";
import { redirect } from 'next/navigation';
import { SwarmPageClient } from "./client";

export default function SwarmPage({ params }: { params: { slug: string } }) {
    const swarm = SwarmData.find((s) => s.id === params.slug);
    if (!swarm) {
        redirect('/404');
    }

    return <SwarmPageClient swarm={swarm} />;
}
