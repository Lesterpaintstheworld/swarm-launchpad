'use client'

import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import { WalletModal } from "@/components/solana/walletModal";
import { Button } from "@/components/shadcn/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/shadcn/dropdown-menu";
import { ChartPie, Link, LucideArrowLeftRight, LucidePower } from "lucide-react";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { cn, formatPublicKey } from "@/lib/utils";
import { useRouter } from "next/navigation";

function ConnectButton({ className }: { className?: string }) {

    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [label, setlabel] = useState<string>('Connect Wallet');

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const { connected, connecting, disconnecting, publicKey, wallet, disconnect } = useWallet();

    useEffect(() => {
        setlabel(
            connected ? formatPublicKey(publicKey?.toBase58() as string) :
                connecting ? 'Connecting...' :
                    disconnecting ? 'Disconnecting...' :
                        'Connect Wallet'
        )
    }, [connected, connecting, disconnecting, publicKey]);

    const handleClick = useCallback(() => {
        if (connected) {
            return disconnect();
        }
        return openModal();
    }, [connected, disconnect]);

    return (
        <>
            {!connected ? (
                <Button disabled={connecting || disconnecting} onClick={handleClick} className={cn("px-4", className)}>
                    {connected && <img src={wallet?.adapter.icon} alt={`${wallet?.adapter.name} icon`} className="max-w-4" />}
                    {label}
                </Button>
            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button disabled={connecting || disconnecting}>
                            {connected && <img src={wallet?.adapter.icon} alt={`${wallet?.adapter.name} icon`} className="max-w-4" />}
                            {label}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-popover">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => router.push('/invest/portfolio')}>
                                Portfolio
                                <ChartPie className="ml-auto max-w-3" />
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                Market
                                <LucideArrowLeftRight className="ml-auto max-w-3 text-muted" />
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled>
                            Transactions
                            <Link className="ml-auto max-w-3 text-muted" />
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => disconnect()} className="cursor-pointer">
                            Disconnect
                            <LucidePower className="ml-auto max-w-3" />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
            <WalletModal isModalOpen={isModalOpen} closeModal={closeModal} />
        </>
    );
}

export { ConnectButton };