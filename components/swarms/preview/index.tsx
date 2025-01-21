import { Button } from "@/components/shadcn/button";
import { Card } from "@/components/ui/card"
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import { Tag } from "@/components/ui/tag";
import { motion } from "motion/react";
import Link from "next/link";
import { SwarmPreviewData } from "../swarm.types";
import { useState } from 'react';

interface SwarmPreviewCardProps {
    swarm: SwarmPreviewData;
}

const SwarmPreviewCard = ({ swarm }: SwarmPreviewCardProps) => {
    const [imgSrc, setImgSrc] = useState(swarm.image);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
            className="h-full"
        >
            <Link href={`/invest/${swarm.id}`} className="block transition-all duration-200 h-full">
                <Card className="p-2 md:max-w-[300px] w-full h-full flex flex-col cursor-pointer hover:shadow-lg hover:border-foreground/30 transition-colors">
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
                    <div className="flex flex-col h-full px-[2px]">
                        {/* Title and Autonomy with more space */}
                        <div className="flex items-center justify-between mt-4 mb-4">
                            <p className="text-lg font-medium">{swarm.name}</p>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-yellow-500/10 text-yellow-500">
                                            Revenue Share: {swarm.revenueShare}%
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[200px] text-center">
                                        <p>Percentage of revenue shared with investors</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        
                        {/* Description in white */}
                        <p className="text-white text-sm text-truncate line-clamp-4">{swarm.description}</p>
                        
                        {/* Spacer to push tags and button to bottom */}
                        <div className="flex-grow" />
                        
                        {/* Footer section with tags and button */}
                        <div className="mt-auto">
                            <div className="flex flex-row flex-wrap gap-1.5 mb-3">
                                {swarm.tags.map((tag, index) => (
                                    <Tag className="text-[10px] font-normal px-2 py-0.5 text-muted-foreground" key={index}>
                                        {tag}
                                    </Tag>
                                ))}
                            </div>
                            
                            <Button 
                                variant='default'
                                className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white border-[#172554] hover:text-white"
                            >
                                Invest
                            </Button>
                        </div>
                    </div>
                </Card>
            </Link>
        </motion.div>
    )
}

export { SwarmPreviewCard }
export type { }
