"use client"

import { Search } from "@/components/ui/search"
import { SwarmPreviewCard } from "../preview"
import { previews } from "@/data/swarms/previews"
import { useCallback, useState } from "react"
import { AnimatePresence } from "motion/react"
import { SwarmModel, SwarmPreviewData, SwarmType } from "../swarm.types"
import { Button } from "@/components/shadcn/button"
import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip"

const swarmTypeInfo = {
    partner: `• Full team operational
• Product in final stages/launched
• Active codebase
• Real users/Token trading
• 6+ months into development`,
    early: `• Core team formed (2-4 people)
• Basic prototype exists
• Initial codebase established
• Some testing completed
• 2-6 months into development`,
    inception: `• Solo founder seeking team / Promising idea without team
• No code yet, just vision
• Pre-prototype stage
• 0-3 months into development`
}

const SwarmTypeHeader = ({ type, icon, title }: { type: SwarmType, icon: string, title: string }) => (
    <div className="flex items-center gap-2 my-8">
        <h3 className="text-2xl font-semibold">{icon} {title}</h3>
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 hover:bg-accent/50 hover:text-accent-foreground transition-colors"
                    >
                        <InfoIcon className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent 
                    className="bg-black/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-xl border border-white/10 max-w-[280px]"
                    sideOffset={5}
                >
                    <pre className="text-sm whitespace-pre-line font-light leading-relaxed">{swarmTypeInfo[type]}</pre>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
)

const SwarmsPreviewGrid = () => {

    const [searchValue, setSearchValue] = useState<string>('');

    const filterPreviews = useCallback((type: SwarmType) => {
        return previews.filter(swarm => {
            const matchesSearch = 
                swarm.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
                swarm.description.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
                swarm.models.toString().toLocaleLowerCase().includes(searchValue.toLocaleLowerCase() as SwarmModel) ||
                swarm.tags.toString().toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
                swarm.role?.toString().toLocaleLowerCase().includes(searchValue.toLocaleLowerCase());
            
            return matchesSearch && swarm.swarmType === type;
        });
    }, [searchValue]);

    return (
        <TooltipProvider>
            <Search value={searchValue} onInputChange={setSearchValue} />
            <div className="flex flex-col gap-12 mt-8">
                {/* Partner Swarms First */}
                <div>
                    <SwarmTypeHeader type="partner" icon="🤝" title="Partner Swarms" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <AnimatePresence>
                            {filterPreviews('partner').map((swarm: SwarmPreviewData, index: number) => (
                                <SwarmPreviewCard swarm={swarm} key={index} />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Early Swarms Second */}
                <div>
                    <SwarmTypeHeader type="early" icon="🚀" title="Early Swarms" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <AnimatePresence>
                            {filterPreviews('early').map((swarm: SwarmPreviewData, index: number) => (
                                <SwarmPreviewCard swarm={swarm} key={index} />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
                
                {/* Inception Swarms Last */}
                <div>
                    <SwarmTypeHeader type="inception" icon="🌱" title="Inception Swarms" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <AnimatePresence>
                            {filterPreviews('inception').map((swarm: SwarmPreviewData, index: number) => (
                                <SwarmPreviewCard swarm={swarm} key={index} />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}

export { SwarmsPreviewGrid }
