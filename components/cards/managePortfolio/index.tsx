'use client'

import { Button } from "@/components/shadcn/button"
import { ConnectButton } from "@/components/solana/connectButton"
import { Card } from "@/components/ui/card"
import { useWallet } from "@solana/wallet-adapter-react"
import Link from "next/link"

const ManagePortfolioCard = () => {

    const { connected } = useWallet();

    return (
        <Card className="w-full flex flex-row items-center justify-between mt-6">
            <div className="flex flex-col gap-1">
                <h4 className="font-medium">Manage your portfolio</h4>
                <p className="text-muted">Want to buy and sell shares, or check your latest dividend payments.</p>
            </div>
            {connected ?
                <Button className="bg-foreground text-background font-bold" asChild>
                    <Link href="/invest/portfolio">
                        Your Portfolio
                    </Link>
                </Button>
                :
                <ConnectButton />
            }
        </Card>
    )
}

export { ManagePortfolioCard }