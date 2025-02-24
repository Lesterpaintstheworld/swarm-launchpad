import Link from "next/link"
import { LucideCircleHelp } from "lucide-react"

const Banner = () => {
    return (
        <div className="w-[100vw] h-fit flex flex-row metallic-bg-ubc py-2 text-sm">
            <div className="container mx-auto flex flex-row justify-between items-center gap-6 flex-wrap">
                <p className="text-background font-semibold">Secondary <Link href={'/marketplace?tab=listings'} className="underline">market</Link> goes live @ 18:00 UTC! Buy and sell shares through P2P trading.</p>
                <Link href="how-it-works" className="text-background text-underline flex flex-row gap-2 hover:bg-foreground/10 px-2 py-1 rounded-[4px] items-center">How does it work<LucideCircleHelp className="w-4" /></Link>
            </div>
        </div>
    )
}

export { Banner }