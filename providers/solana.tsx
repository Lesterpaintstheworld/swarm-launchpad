'use client'

import { Adapter, WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { useCallback, useMemo } from "react"
import { constants } from "@/lib/constants";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { toast } from "sonner";
import {
    CoinbaseWalletAdapter,
    LedgerWalletAdapter,
    SafePalWalletAdapter,
    SolflareWalletAdapter,
    WalletConnectWalletAdapter,
    PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import '@solana/wallet-adapter-react-ui/styles.css';

const SolanaProvider = ({ children }: { children: React.ReactNode }) => {

    // 'devnet' or 'mainnet-beta'
    const network = constants.environment === 'production' ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet;

    // Can accept a custom RPC endpoint
    const endpoint = useMemo(() => constants.rpcUrl, [constants.rpcUrl]);

    /**
     * Wallets that implement either of these standards will be available automatically.
     *
     *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
     *     (https://github.com/solana-mobile/mobile-wallet-adapter)
     *   - Solana Wallet Standard
     *     (https://github.com/anza-xyz/wallet-standard)
     *
     * To support a wallet that supports neither of these standards,
     * instantiate its legacy wallet adapter here. Common legacy adapters can be found
     * in the npm package `@solana/wallet-adapter-wallets`.
    */
    const wallets: Adapter[] = useMemo(() => [
        new PhantomWalletAdapter(),
        // new SolflareWalletAdapter(),
        // new WalletConnectWalletAdapter({ network, options: { projectId: constants.WalletConnect.projectId } }), // Requires project setup with wallet connect
        new LedgerWalletAdapter(),
        // new CoinbaseWalletAdapter(),
        new SafePalWalletAdapter(),
    ], [network])

    const onError = useCallback((error: WalletError) => {
        if (error?.message) {
            toast(error.message);
        }
        console.error(error);
    }, []);

    return (
        <ConnectionProvider endpoint={constants.rpcUrl}>
            <WalletProvider wallets={wallets} onError={onError} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export { SolanaProvider }
