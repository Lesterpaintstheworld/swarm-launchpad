interface SolanaProviderContextProps {
    rpc: string;
    useFallbackRPC: () => void;
    updateRPC: (value: string) => void;
}