"use client"

import { Search } from "@/components/ui/search"
import { AgentPreviewCard } from "../preview"
import { previews } from "@/data/agents/previews"
import { useCallback, useState } from "react"
import { AnimatePresence } from "motion/react"
import { AgentModel, AgentPreviewData } from "../agent.types"

const AgentsPreviewGrid = () => {

    const [searchValue, setSearchValue] = useState<string>('');

    const filteredPreviews = useCallback(() => {
        return previews.filter(({ name, description, models, tags, role }) =>
            name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
            description.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
            models.toString().toLocaleLowerCase().includes(searchValue.toLocaleLowerCase() as AgentModel) ||
            tags.toString().toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
            role?.toString().toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
        );
    }, [searchValue])

    return (
        <>
            <Search value={searchValue} onInputChange={setSearchValue} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <AnimatePresence>
                    {filteredPreviews().map((agent: AgentPreviewData, index: number) => {
                        return (
                            <AgentPreviewCard agent={agent} key={index} />
                        )
                    })}
                </AnimatePresence>
            </div>
        </>
    )
}

export { AgentsPreviewGrid }