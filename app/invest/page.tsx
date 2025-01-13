import { AgentsPreviewGrid } from "@/components/agents/previewGrid";
import { ComputeToken } from "@/components/tokens/compute";

export default function Invest() {

    return (
        <main className="container">
            <div className="h-80 flex flex-col items-center justify-center gap-3">
                <h2 className="text-center">Invest in our <span className="font-bold">AI Swarms</span></h2>
                <div className="text-muted flex flex-row flex-wrap text-lg items-center justify-center">
                    <p className="text-center text-nowrap">Generate <span className="text-nowrap">$UBC</span> returns by investing your&ensp;</p>
                    <ComputeToken />
                    <p className="text-center text-nowrap">&ensp;tokens into our ai swarms.</p>
                </div>
            </div>
            <AgentsPreviewGrid />
        </main>
    )

}
