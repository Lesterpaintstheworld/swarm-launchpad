import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { useAnchorProvider } from "../useAnchor";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { Program } from "@coral-xyz/anchor";
import { useQuery } from "@tanstack/react-query";
import { constants } from "@/lib/constants";
import IDL from "@/data/programs/idl.json";

const useInvestProgram = () => {

    const { connection } = useConnection();

    const network = constants.environment == 'development' ? WalletAdapterNetwork.Devnet : WalletAdapterNetwork.Mainnet;
    const provider = useAnchorProvider();
    const programId = useMemo(() => new PublicKey(constants.investmentProgram.id), [network]);
    const program = useMemo(() => new Program({ ...IDL, address: programId.toBase58() }, provider), [provider, programId])

    // Get all shareholder accounts
    const shareholders = useQuery({
        queryKey: ['get-all-shareholder-accounts', publicKey],
        queryFn: async () => program.account.Shareholders.all(),
        enabled: !!program && !!connection,
        staleTime: 30000,
        retry: 3
    });

    return {
        program,
        programId,
        connection,
        network,
        shareholders
    }

}

const useInvestProgramAccount = () => {

    const { publicKey } = useWallet();
    const { program } = useInvestProgram();

    // TODO: Get shareholder accounts for a specific publickey
    const swarmInvestments = useQuery({
        queryKey: ['get-shareholder-account', publicKey],
        // queryFn: async () => program.account.Shareholders.fetch(publicKey),
        enabled: !!program && !!publicKey,
        staleTime: 30000,
        retry: 3
    })

    return {
        swarmInvestments
    }

}

export {
    useInvestProgram,
    useInvestProgramAccount
};