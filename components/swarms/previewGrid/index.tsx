"use client"

import { Search } from "@/components/ui/search"
import { SwarmPreviewCard } from "../preview"
import { previews } from "@/data/swarms/previews"
import { useCallback, useState } from "react"
import { AnimatePresence } from "motion/react"
import { SwarmModel, SwarmPreviewData } from "../swarm.types"

const SwarmsPreviewGrid = () => {

    const [searchValue, setSearchValue] = useState<string>('');

    const filterPreviews = useCallback((isInception?: boolean) => {
        return previews.filter(swarm => {
            const matchesSearch = 
                swarm.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
                swarm.description.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
                swarm.models.toString().toLocaleLowerCase().includes(searchValue.toLocaleLowerCase() as SwarmModel) ||
                swarm.tags.toString().toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
                swarm.role?.toString().toLocaleLowerCase().includes(searchValue.toLocaleLowerCase());
            
            return matchesSearch && (isInception ? swarm.isInception : !swarm.isInception);
        });
    }, [searchValue]);

    return (
        <>
            <Search value={searchValue} onInputChange={setSearchValue} />
            <div className="flex flex-col gap-8 mt-4">
                <div>
                    <h3 className="text-xl font-semibold mb-4">Active Swarms</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <AnimatePresence>
                            {filterPreviews().map((swarm: SwarmPreviewData, index: number) => (
                                <SwarmPreviewCard swarm={swarm} key={index} />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
                
                <div>
                    <h3 className="text-xl font-semibold mb-4">🌱 Inception Swarms</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <AnimatePresence>
                            {filterPreviews(true).map((swarm: SwarmPreviewData, index: number) => (
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
