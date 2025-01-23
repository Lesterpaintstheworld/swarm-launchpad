import Link from "next/link"

const Banner = () => {
    return (
        <div className="w-[100vw] h-fit flex flex-row metallic-bg-ubc py-2">
            <div className="container mx-auto flex flex-row justify-between items-center gap-6 flex-wrap">
                <p className="text-background font-semibold">The launchpad is now live! Invest your COMPUTE in agents of tomorrow.</p>
                <Link href="how-it-works" className="text-background text-underline">How does it work?</Link>
            </div>
        </div>
    )
}

export { Banner }