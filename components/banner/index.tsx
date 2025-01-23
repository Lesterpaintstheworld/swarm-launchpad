import Link from "next/link"
import { LucideCircleHelp } from "lucide-react"

const Banner = () => {
    return (
        <div className="w-[100vw] h-fit flex flex-row metallic-bg-ubc py-2 text-sm">
            <div className="container mx-auto flex flex-row justify-between items-center gap-6 flex-wrap">
                <p className="text-background font-semibold">The launchpad is now live! Invest your <code className="text-sm font-inter px-1">$COMPUTE</code> in agents of tomorrow.</p>
                <Link href="how-it-works" className="text-background text-underline flex flex-row gap-2 hover:bg-foreground/10 px-2 py-1 rounded-[4px] items-center">How does it work<LucideCircleHelp className="w-4" /></Link>
            </div>
        </div>
    )
}

export { Banner }