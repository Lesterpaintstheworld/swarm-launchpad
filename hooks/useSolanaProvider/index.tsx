import { SolanaProviderContext } from "@/providers/solana";
import { useContext } from "react";

const useSolanaProvider = () => useContext(SolanaProviderContext);

export { useSolanaProvider };