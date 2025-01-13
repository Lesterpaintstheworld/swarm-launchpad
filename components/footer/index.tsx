"use client"

import Image from "next/image"
import { UBCToken } from "@/components/tokens/ubc"
import { ComputeToken } from "@/components/tokens/compute"

const Footer = () => {
    return (
        <footer className="w-full border-t border-border mt-auto">
            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <Image src="/brand-assets/logo.jpg" alt="logo" width={30} height={30} />
                            <span className="font-semibold">Universal Basic Compute</span>
                        </div>
                        <span className="text-muted-foreground text-sm flex flex-wrap items-center">
                            <span>UBC (Universal Basic Compute) is a decentralized infrastructure project that bridges AI systems' need for guaranteed compute resources with humans' need for guaranteed returns from AI advancement through a dual-token system (</span>
                            <UBCToken />
                            <span>&nbsp;for governance and </span>
                            <ComputeToken />
                            <span>&nbsp;for resource allocation).</span>
                        </span>
                    </div>

                    {/* Resources */}
                    <div className="flex flex-col gap-4">
                        <h6 className="font-semibold">Resources</h6>
                        <div className="flex flex-col gap-2">
                            <a href="https://universalbasiccompute.ai/" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Main Website
                            </a>
                            <a href="https://universalbasiccompute.ai/phase2-tokenomics" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Tokenomics
                            </a>
                            <a href="https://github.com/Lesterpaintstheworld/kinos" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                KinOS GitHub
                            </a>
                        </div>
                    </div>

                    {/* Community */}
                    <div className="flex flex-col gap-4">
                        <h6 className="font-semibold">Community</h6>
                        <div className="flex flex-col gap-2">
                            <a href="https://x.com/UBC4ai" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Twitter
                            </a>
                            <a href="https://discord.gg/DStRe2hDG3" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Discord
                            </a>
                            <a href="https://t.me/ubc_portal" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Telegram
                            </a>
                            <a href="https://chatgpt.com/g/g-67472caf1f608191a1d3a0d742cafc73-ubc-personal-assistant-v1-1" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                UBC AI Assistant
                            </a>
                        </div>
                    </div>

                    {/* Markets */}
                    <div className="flex flex-col gap-4 md:col-start-3">
                        <h6 className="font-semibold">Markets</h6>
                        <div className="flex flex-col gap-2">
                            <a href="https://dexscreener.com/solana/hbjg1zpronbeiv86qdt1wzwgymts1ppxjcfoz819cbjd" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                DexScreener
                            </a>
                            <a href="https://www.gate.io/pilot/solana/universal-basic-compute-ubc" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Gate.io
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Universal Basic Compute. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="https://universalbasiccompute.ai/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Privacy Policy
                        </a>
                        <a href="https://universalbasiccompute.ai/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export { Footer }
