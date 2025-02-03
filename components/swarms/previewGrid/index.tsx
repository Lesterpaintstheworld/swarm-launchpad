"use client"

import { Search } from "@/components/ui/search"
import { SwarmPreviewCard } from "../preview"
import { useCallback, useState, useEffect } from "react"
import { AnimatePresence } from "motion/react"
import { SwarmModel, SwarmPreviewData, SwarmType } from "../swarm.types"
import { Button } from "@/components/shadcn/button"
import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip"

interface SwarmsPreviewGridProps {
    filterType?: SwarmType;
}

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

const SwarmsPreviewGrid = ({}: SwarmsPreviewGridProps) => {
    const [searchValue, setSearchValue] = useState<string>('');
    const [swarms, setSwarms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchSwarms() {
            try {
                const response = await fetch('/api/swarms');
                const data = await response.json();
                console.log('Fetched swarms:', data); // Debug log
                setSwarms(data);
            } catch (error) {
                console.error('Error fetching swarms:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSwarms();
    }, []);

    const filterSwarms = useCallback((type: SwarmType) => {
        const filtered = swarms.filter(swarm => {
            const matchesSearch = 
                swarm.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                swarm.description.toLowerCase().includes(searchValue.toLowerCase()) ||
                swarm.models.toString().toLowerCase().includes(searchValue.toLowerCase()) ||
                swarm.tags.toString().toLowerCase().includes(searchValue.toLowerCase()) ||
                swarm.role?.toString().toLowerCase().includes(searchValue.toLowerCase());
            
            const matchesType = swarm.swarmType === type;
            console.log(`Swarm ${swarm.name}: type=${swarm.swarmType}, matches=${matchesType}`); // Debug log
            
            return matchesSearch && matchesType;
        });
        console.log(`Filtered ${type} swarms:`, filtered); // Debug log
        return filtered;
    }, [searchValue, swarms]);

    // Always show all sections
    const showPartner = true;
    const showEarly = true;
    const showInception = true;

    return (
        <TooltipProvider>
            <Search value={searchValue} onInputChange={setSearchValue} />
            <div className="flex flex-col gap-12 mt-8 sm:mb-20">
                {showPartner && (
                    <div>
                    <SwarmTypeHeader type="partner" icon="🤝" title="Partner Swarms" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <AnimatePresence>
                            {filterSwarms('partner').map((swarm: SwarmPreviewData, index: number) => (
                                <SwarmPreviewCard swarm={swarm} key={index} />
                            ))}
                        </AnimatePresence>
                    </div>
                    </div>
                )}

                {showEarly && (
                    <div>
                    <SwarmTypeHeader type="early" icon="🚀" title="Early Swarms" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <AnimatePresence>
                            {filterSwarms('early').map((swarm: SwarmPreviewData, index: number) => (
                                <SwarmPreviewCard swarm={swarm} key={index} />
                            ))}
                        </AnimatePresence>
                    </div>
                    </div>
                )}
                
                {showInception && (
                    <div>
                    <SwarmTypeHeader type="inception" icon="🌱" title="Inception Swarms" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <AnimatePresence>
                            {filterSwarms('inception').map((swarm: SwarmPreviewData, index: number) => (
                                <SwarmPreviewCard swarm={swarm} key={index} />
                            ))}
                        </AnimatePresence>
                    </div>
                    </div>
                )}
            </div>
        </TooltipProvider>
    )
}

export { SwarmsPreviewGrid }
