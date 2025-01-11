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
import { ChartPie, Link, LucideArrowLeftRight, LucidePower, LucideUser } from "lucide-react";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";

function ConnectButton() {

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [label, setlabel] = useState<string>('Connect Wallet');

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const { connected, connecting, disconnecting, publicKey, wallet, disconnect } = useWallet();

    useEffect(() => {
        setlabel(
            connected ? publicKey?.toBase58().slice(0, 5) + '...' + publicKey?.toBase58().slice(-2) :
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
    }, [connected, connecting, disconnecting, publicKey]);

    return (
        <>
            {!connected ? (
                <Button disabled={connecting || disconnecting} onClick={handleClick} className="px-4">
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
                            <DropdownMenuItem disabled>
                                Portfolio
                                <ChartPie className="ml-auto max-w-3 text-muted" />
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                Transactions
                                <Link className="ml-auto max-w-3 text-muted" />
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                Profile
                                <LucideUser className="ml-auto max-w-3 text-muted" />
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled>
                            Market
                            <LucideArrowLeftRight className="ml-auto max-w-3 text-muted" />
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