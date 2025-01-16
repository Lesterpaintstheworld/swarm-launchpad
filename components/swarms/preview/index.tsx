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
            className="h-full"
        >
            <Link href={`/${swarm.swarmType}/${swarm.id}`} className="block transition-all duration-200 h-full">
                <Card className="p-2 md:max-w-[300px] w-full h-full flex flex-col cursor-pointer hover:shadow-lg hover:border-foreground/30 transition-colors">
                    <Image
                        src={swarm.image}
                        alt={`${swarm.name} image`}
                        width={300}
                        height={300}
                        className="w-full aspect-square object-fill rounded-sm"
                    />
                    <div className="flex flex-col gap-3 px-[2px] mt-2 mb-1 flex-grow">
                        <div className="flex flex-row flex-wrap gap-1.5">
                            {swarm.tags.map((tag, index) => (
                                <Tag className="text-[10px] font-normal px-2 py-0.5" key={index}>
                                    {tag}
                                </Tag>
                            ))}
                        </div>
                        <p className="text-lg font-medium">{swarm.name}</p>
                        <p className="text-muted text-xs text-truncate line-clamp-4 min-h-16 mb-2">{swarm.description}</p>
                        <Button 
                            variant='outline' 
                            className="mt-auto bg-[#1e3a8a] hover:bg-[#172554] text-white border-[#172554] hover:text-white"
                        >
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
