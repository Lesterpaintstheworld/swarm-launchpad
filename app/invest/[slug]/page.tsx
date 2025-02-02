import { getSwarmInfo } from "@/data/swarms/info";
import { getSwarm } from "@/data/swarms/previews";
import { SwarmContent } from "./SwarmContent";
import { descriptionMap } from "./descriptions";

interface PageProps {
    params: {
        slug: string;
    };
}

export default function SwarmPage({ params }: PageProps) {
    const swarmInfo = getSwarmInfo(params.slug);
    const swarmPreview = getSwarm(params.slug);

    if (!swarmInfo) {
        return null;
    }

    const swarm = {
        ...swarmPreview,
        ...swarmInfo,
        role: swarmPreview?.role,
        tags: swarmPreview?.tags,
        description: descriptionMap[swarmInfo.id] || swarmInfo.description
    };

    return <SwarmContent swarm={swarm} />;
}

