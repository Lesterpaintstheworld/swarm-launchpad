import { SwarmsPreviewGrid } from "@/components/swarms/previewGrid";
import { Token } from "@/components/tokens/token";
import { supportedTokens } from "@/data/tokens/supported";
import { TokenTooltip } from "@/components/ui/tokenTooltip";
import { BackgroundBlur } from "@/components/background";

export default function Invest() {

    return (
        <main className="container view">
            <BackgroundBlur />
            <div className="h-80 flex flex-col items-center justify-center gap-3">
                <h2 className="text-center">Invest in our <span className="font-bold">AI Swarms</span></h2>
                <div className="text-muted flex flex-row flex-wrap text-lg items-center justify-center">
                    <p className="text-center text-nowrap">Generate&ensp;</p>
                    <TokenTooltip token="$UBC"><Token token={supportedTokens[0]} /></TokenTooltip>
                    <p className="text-center text-nowrap">&ensp;returns by investing your&ensp;</p>
                    <TokenTooltip token="$COMPUTE"><Token token={supportedTokens[1]} /></TokenTooltip>
                    <p className="text-center text-nowrap">&ensp;tokens into our ai swarms.</p>
                </div>
            </div>
            <SwarmsPreviewGrid />
        </main>
    )

}
