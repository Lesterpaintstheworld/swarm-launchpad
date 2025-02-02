import { NextResponse } from 'next/server';
import { getSwarmInfo } from "@/data/swarms/info";
import { getSwarm } from "@/data/swarms/previews";
import { descriptionMap } from "@/app/invest/[slug]/descriptions";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const swarmInfo = getSwarmInfo(params.slug);
  const swarmPreview = getSwarm(params.slug);

  if (!swarmInfo) {
    return NextResponse.json(null);
  }

  const swarm = {
    ...swarmPreview,
    ...swarmInfo,
    role: swarmPreview?.role,
    tags: swarmPreview?.tags,
    description: descriptionMap[swarmInfo.id] || swarmInfo.description
  };

  return NextResponse.json(swarm);
}
