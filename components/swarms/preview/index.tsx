'use client';

import { Card } from "@/components/ui/card"
import Image from "next/image";
import { Tag } from "@/components/ui/tag";
import { motion } from "motion/react";
import Link from "next/link";
import { SwarmPreviewData } from "../swarm.types";
import { useState } from 'react';

interface SwarmPreviewCardProps {
    swarm: SwarmPreviewData;
}

const SwarmPreviewCard = ({ swarm }: SwarmPreviewCardProps) => {
    const [imgSrc, setImgSrc] = useState(swarm?.image);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
            className="h-full"
        >
            <Link href={`/invest/${swarm?.id}`} className="block transition-all duration-200 h-full">
                <Card className="p-2 md:max-w-[300px] w-full h-full flex flex-col cursor-pointer hover:shadow-lg hover:border-foreground/30 transition-colors relative">
                    <Image
                        src={imgSrc}
                        alt={`${swarm.name} image`}
                        width={300}
                        height={300}
                        className="w-full aspect-square object-fill rounded-sm"
                        onError={() => {
                            setImgSrc('/default.png')
                        }}
                    />
                    <div className="flex flex-col h-full px-[4px]">
                        <div className="flex flex-row overflow-scroll gap-1 mt-2 mb-2">
                            {swarm.tags.map((tag, index) => (
                                <Tag className="text-[10px] font-normal px-2 py-0.5 text-muted-foreground" key={index}>
                                    {tag}
                                </Tag>
                            ))}
                        </div>
                        <p className="text-lg font-medium">{swarm.name}</p>
                        <p className="text-muted text-sm text-truncate line-clamp-4 mt-2">{swarm.shortDescription || swarm.description}</p>
                        
                        <div className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white border-[#172554] hover:text-white mb-1 mt-8 px-4 py-2 rounded-lg text-center">
                            Invest
                        </div>
                    </div>
                </Card>
            </Link>
        </motion.div>
    )
}

export { SwarmPreviewCard }
export type { SwarmPreviewCardProps }
export type { }
