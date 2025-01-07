import { Button } from "@/components/shadcn/button";
import { Card } from "@/components/ui/card"
import Link from "next/link";

interface AgentPreviewCardProps {
    agent: AgentPreviewData;
}

const AgentPreviewCard = ({ agent }: AgentPreviewCardProps) => {

    return (
        <Card className="p-2 max-w-[250px] w-full">
            <img
                src={agent.image}
                alt={`${agent.name} image`}
                className="w-full aspect-square object-fill rounded-sm"
            />
            <div className="flex flex-col gap-2 px-[2px] mt-2 mb-1">
                <div className="flex flex-row gap-2 overflow-x-scroll mt-2">
                    {agent.models.map((model, index) => {
                        return (
                            <p
                                key={index}
                                className="bg-card text-xs py-1 px-2 rounded-sm border border-border"
                            >
                                {model}
                            </p>
                        )
                    })}
                </div>
                <p>{agent.name}</p>
                <p className="text-muted text-xs text-truncate line-clamp-4">{agent.description}</p>
                <Button asChild variant='success' className="mt-2">
                    <Link href={`/invest/${agent.id}`}>Invest</Link>
                </Button>
            </div>
        </Card>
    )
}

export { AgentPreviewCard }
export type { }