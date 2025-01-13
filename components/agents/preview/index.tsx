import { Button } from "@/components/shadcn/button";
import { Card } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag";
import { motion } from "motion/react";
import Link from "next/link";
import { AgentPreviewData } from "../agent.types";

interface AgentPreviewCardProps {
    agent: AgentPreviewData;
}

const AgentPreviewCard = ({ agent }: AgentPreviewCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
        >
            <Link href={`/invest/${agent.id}`} className="block transition-all duration-200 hover:scale-[1.02] hover:-translate-y-1">
                <Card className="p-2 md:max-w-[300px] w-full cursor-pointer hover:shadow-lg">
                    <img
                        src={agent.image}
                        alt={`${agent.name} image`}
                        className="w-full aspect-square object-fill rounded-sm"
                    />
                    <div className="flex flex-col gap-2 px-[2px] mt-2 mb-1">
                        <div className="flex flex-row gap-2 overflow-x-scroll mt-2">
                            {agent.models.map((model, index) => {
                                return (
                                    <Tag className="text-xs" key={index}>
                                        {model}
                                    </Tag>
                                )
                            })}
                        </div>
                        <p>{agent.name}</p>
                        <p className="text-muted text-xs text-truncate line-clamp-4">{agent.description}</p>
                        <Button variant='success' className="mt-2">
                            Invest
                        </Button>
                    </div>
                </Card>
            </Link>
        </motion.div>
    )
}

export { AgentPreviewCard }
export type { }
