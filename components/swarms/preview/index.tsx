import { Button } from "@/components/shadcn/button";
import { Card } from "@/components/ui/card"
import Image from "next/image";
import { Tag } from "@/components/ui/tag";
import { motion } from "motion/react";
import Link from "next/link";
import { SwarmPreviewData } from "../swarm.types";

interface SwarmPreviewCardProps {
    swarm: SwarmPreviewData;
}

const SwarmPreviewCard = ({ swarm }: SwarmPreviewCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
        >
            <Link href={`/invest/${swarm.id}`} className="block transition-all duration-200">
                <Card className="p-2 md:max-w-[300px] w-full cursor-pointer hover:shadow-lg hover:border-foreground/30 transition-colors">
                    <Image
                        src={swarm.image}
                        alt={`${swarm.name} image`}
                        width={300}
                        height={300}
                        className="w-full aspect-square object-fill rounded-sm"
                    />
                    <div className="flex flex-col gap-2 px-[2px] mt-2 mb-1">
                        <div className="flex flex-row gap-2 overflow-x-scroll mt-2">
                            {swarm.models.map((model, index) => {
                                return (
                                    <Tag className="text-xs" key={index}>
                                        {model}
                                    </Tag>
                                )
                            })}
                        </div>
                        <p>{swarm.name}</p>
                        <p className="text-muted text-xs text-truncate line-clamp-4 min-h-16">{swarm.description}</p>
                        <Button variant='success' className="mt-2">
                            Invest
                        </Button>
                    </div>
                </Card>
            </Link>
        </motion.div>
    )
}

export { SwarmPreviewCard }
export type { }
