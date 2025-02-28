import { WalletName } from "@solana/wallet-adapter-base";
import { Wallet } from "@solana/wallet-adapter-react";

interface WalletListItemProps {
    handleClick: (walletName: WalletName) => void;
    tabIndex?: number;
    wallet: Wallet;
}

export type { WalletListItemProps}