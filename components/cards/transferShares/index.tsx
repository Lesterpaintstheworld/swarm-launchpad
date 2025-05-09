'use client'

import { Button } from "@/components/shadcn/button"
import { ConnectButton } from "@/components/solana/connectButton"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useWallet } from "@solana/wallet-adapter-react"
import { useState } from "react"
import { TransferSharesModal } from "@/components/swarms/transferModal"

const TransferSharesCard = ({ className }: { className?: string }) => {

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { publicKey } = useWallet();

    const { connected } = useWallet();

    return (
        <>
            <Card className={cn("w-full flex flex-col sm:flex-row sm:items-center justify-between", className)}>
                <div className="flex flex-col gap-1">
                    <h4 className="font-medium">Transfer shares</h4>
                    <p className="text-muted text-balance">Execute a private transfer of shares to another wallet.</p>
                </div>
                {connected ?
                    <Button onClick={() => setIsModalOpen(true)} className="w-full sm:max-w-36 sm:ml-20 mt-4 sm:mt-0">
                        Transfer
                    </Button>
                    :
                    <ConnectButton />
                }
            </Card>
            {publicKey &&
                <TransferSharesModal
                    isModalOpen={isModalOpen}
                    closeModal={() => setIsModalOpen(false)}
                />
            }
        </>
    )
}

export { TransferSharesCard }