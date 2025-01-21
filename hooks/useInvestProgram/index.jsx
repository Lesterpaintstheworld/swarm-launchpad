import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { useAnchorProvider } from "../useAnchor";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { Program } from "@coral-xyz/anchor";
import { useQuery } from "@tanstack/react-query";
import { constants } from "@/lib/constants";
import IDL from "@/data/programs/idl.json";

const getShareholderPDA = async (programId, ownerPublicKey, poolPublicKey) => {
    const [shareholderPda] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("shareholder"),
            poolPublicKey.toBuffer(),
            ownerPublicKey.toBuffer()
        ],
        programId
    );
    return shareholderPda;
}

const useInvestProgram = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const network = constants.environment === 'development' ? WalletAdapterNetwork.Devnet : WalletAdapterNetwork.Mainnet;
    const provider = useAnchorProvider();
    const programId = useMemo(() => new PublicKey(constants.investmentProgram.id), [network]);
    
    // Only create program if we have a valid provider
    const program = useMemo(() => {
        if (!provider) return null;
        return new Program(
            { ...IDL, address: programId.toBase58() },
            provider
        );
    }, [provider, programId]);

    // Get all shareholder accounts
    const shareholders = useQuery({
        queryKey: ['get-all-shareholder-accounts', publicKey?.toBase58()],
        queryFn: async () => {
            if (!program) throw new Error("Program not initialized");
            return program.account.Shareholders.all();
        },
        enabled: !!program && !!connection && !!publicKey,
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

const useInvestProgramAccount = (poolAddress) => {
    const { publicKey } = useWallet();
    const { program, programId } = useInvestProgram();

    const poolPDA = useMemo(() => {
        if (!publicKey || !poolAddress) return null;
        return getShareholderPDA(programId, publicKey, new PublicKey(poolAddress));
    }, [programId, publicKey, poolAddress]);

    // Get shareholder position in a specific pool
    const position = useQuery({
        queryKey: ['get-shareholder-account', publicKey?.toBase58(), poolAddress],
        queryFn: async () => {
            if (!program || !poolPDA) throw new Error("Program or PDA not initialized");
            return program.account.shareholder.fetch(poolPDA);
        },
        enabled: !!program && !!publicKey && !!poolPDA,
        staleTime: 30000,
        retry: 3
    });

    return {
        position
    }
}

export {
    useInvestProgram,
    useInvestProgramAccount
};
