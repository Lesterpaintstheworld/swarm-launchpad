'use client'

import { Button } from "@/components/shadcn/button"
import { ConnectButton } from "@/components/solana/connectButton"
import { Card } from "@/components/ui/card"
import { useWallet } from "@solana/wallet-adapter-react"
import Link from "next/link"

interface ManagePortfolioCardProps {
    className?: string;
}

const ManagePortfolioCard = ({ className }: ManagePortfolioCardProps) => {
    const { connected } = useWallet();

    return (
        <Card className={cn("w-full flex flex-col sm:flex-row sm:items-center justify-between mt-6", className)}>
            <div className="flex flex-col gap-1">
                <h4 className="font-medium">Manage your portfolio</h4>
                <p className="text-muted">Want to buy and sell shares, or check your latest dividend payments.</p>
            </div>
            {connected ?
                <Button className="bg-foreground text-background font-bold mt-4 sm:mt-0" asChild>
                    <Link href="/invest/portfolio">
                        View Portfolio
                    </Link>
                </Button>
                :
                <ConnectButton />
            }
        </Card>
    )
}

export { ManagePortfolioCard }interface ManagePortfolioCardProps {
    className?: string;
}

const ManagePortfolioCard = ({ className }: ManagePortfolioCardProps) => {
    return (
        <Card className={cn("w-full", className)}>
            {/* ... rest of the component ... */}
        </Card>
    );
};

export { ManagePortfolioCard };
export type { ManagePortfolioCardProps };
