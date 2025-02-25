'use client'

import { Adapter, WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { useCallback, createContext, useMemo, useState } from "react"
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
import { clusterApiUrl } from "@solana/web3.js";

const SolanaProviderContext = createContext<SolanaProviderContextProps>({
    rpc: '',
    useFallbackRPC: () => { },
    updateRPC: (value: string) => { }
});

const SolanaProvider = ({ children }: { children: React.ReactNode }) => {

    // RPC endpoint
    const [rpc, setRpc] = useState<string>(constants.rpcUrl.custom || clusterApiUrl(constants.environment === 'production' ? "mainnet-beta" : "devnet"));

    // 'devnet' or 'mainnet-beta'
    const network = constants.environment === 'production' ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet;

    const useFallbackRPC = () => {
        setRpc(clusterApiUrl(constants.environment === 'production' ? "mainnet-beta" : "devnet"));
    }

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
        <SolanaProviderContext.Provider value={{ rpc, useFallbackRPC, updateRPC: setRpc }}>
            <ConnectionProvider endpoint={rpc}>
                <WalletProvider wallets={wallets} onError={onError} autoConnect>
                    <WalletModalProvider>
                        {children}
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </SolanaProviderContext.Provider>
    )
}

export { SolanaProvider, SolanaProviderContext }
