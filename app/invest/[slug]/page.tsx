import { getSwarmInfo } from "@/data/swarms/info";
import { getSwarm } from "@/data/swarms/previews";
import { SwarmContent } from "./SwarmContent";
import { descriptionMap } from "./descriptions";

async function getInitialPrice() {
  try {
    const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana/HiYsmVjeFy4ZLx8pkPSxBjswFkoEjecVGB4zJed2e6Y');
    const data = await response.json();
    return data.pair?.priceUsd ? parseFloat(data.pair.priceUsd) : null;
  } catch (error) {
    console.error('Failed to fetch initial price:', error);
    return null;
  }
}

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function SwarmPage({ params }: PageProps) {
    const swarmInfo = getSwarmInfo(params.slug);
    const swarmPreview = getSwarm(params.slug);
    const initialPrice = await getInitialPrice();

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

    return <SwarmContent swarm={swarm} initialPrice={initialPrice} />;
}

