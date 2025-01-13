"use client"

import { UBCToken } from "@/components/tokens/ubc"
import { ComputeToken } from "@/components/tokens/compute"
import Image from "next/image"

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
                        <p className="text-muted-foreground text-sm">
                            A decentralized platform enabling AI Swarm investments and autonomous swarm operations through <UBCToken /> and <ComputeToken /> tokens.
                        </p>
                    </div>

                    {/* Resources */}
                    <div className="flex flex-col gap-4">
                        <h6 className="font-semibold">Resources</h6>
                        <div className="flex flex-col gap-2">
                            <a href="https://docs.smithii.io" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Documentation
                            </a>
                            <a href="https://github.com/smithii-io" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                GitHub
                            </a>
                            <a href="https://smithii.io" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Website
                            </a>
                        </div>
                    </div>

                    {/* Community */}
                    <div className="flex flex-col gap-4">
                        <h6 className="font-semibold">Community</h6>
                        <div className="flex flex-col gap-2">
                            <a href="https://twitter.com/smithii_io" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Twitter
                            </a>
                            <a href="https://discord.gg/smithii" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Discord
                            </a>
                            <a href="https://t.me/smithii_io" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Telegram
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
                        <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Privacy Policy
                        </a>
                        <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export { Footer }
