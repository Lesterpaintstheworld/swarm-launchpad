"use client"

import { Search } from "@/components/ui/search"
import { SwarmPreviewCard } from "../preview"
import { previews } from "@/data/swarms/previews"
import { useCallback, useState } from "react"
import { AnimatePresence } from "motion/react"
import { SwarmModel, SwarmPreviewData, SwarmType } from "../swarm.types"

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
        <>
            <Search value={searchValue} onInputChange={setSearchValue} />
            <div className="flex flex-col gap-8 mt-4">
                {/* Partner Swarms First */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">🤝 Partner Swarms</h3>
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
                    <h3 className="text-xl font-semibold mb-4">🚀 Early Swarms</h3>
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
                    <h3 className="text-xl font-semibold mb-4">🌱 Inception Swarms</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <AnimatePresence>
                            {filterPreviews('inception').map((swarm: SwarmPreviewData, index: number) => (
                                <SwarmPreviewCard swarm={swarm} key={index} />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </>
    )
}

export { SwarmsPreviewGrid }
