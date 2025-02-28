import { Program } from "@coral-xyz/anchor";
import { PublicKey as SolanaPublicKey } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import UbclaunchpadIDL from "../../data/programs/ubclaunchpad.json";
import { Ubclaunchpad } from "../../types/ubclaunchpad";

const getShareholderPDA = (
    programId: SolanaPublicKey, 
    ownerPublicKey: SolanaPublicKey, 
    poolPublicKey: SolanaPublicKey
): SolanaPublicKey | null => {
    // Add detailed logging
    console.log('PDA Inputs:', {
        programId: programId?.toString(),
        ownerPublicKey: ownerPublicKey?.toString(),
        poolPublicKey: poolPublicKey?.toString()
    });

    if (!programId || !ownerPublicKey || !poolPublicKey) {
        console.log("Missing required keys:", { 
            programId: !!programId, 
            ownerPublicKey: !!ownerPublicKey, 
            poolPublicKey: !!poolPublicKey 
        });
        return null;
    }

    try {
        const [shareholderPda] = SolanaPublicKey.findProgramAddressSync(
            [
                Buffer.from("shareholder"),
                poolPublicKey.toBuffer(),
                ownerPublicKey.toBuffer()
            ],
            programId
        );

        // Log successful PDA generation
        console.log('Generated PDA:', shareholderPda.toString());
        
        return shareholderPda;
    } catch (error) {
        console.error("Error generating shareholder PDA:", error);
        return null;
    }
};

const getTokenAccountPDA = (
    owner: SolanaPublicKey, 
    mint: SolanaPublicKey
): SolanaPublicKey => {
    const [pda] = SolanaPublicKey.findProgramAddressSync(
        [
            owner.toBuffer(),
            Buffer.from([
                6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                245, 133, 126, 255, 0, 169
            ]),
            mint.toBuffer()
        ],
        new SolanaPublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
    );
    return pda;
};

// This is a helper function to get the Ubclaunchpad Anchor program.
const getLaunchpadProgram = (
    provider: AnchorProvider
): Program<Ubclaunchpad> => {    
    return new Program(UbclaunchpadIDL as Ubclaunchpad, provider);
}

export {
    getShareholderPDA,
    getTokenAccountPDA,
    getLaunchpadProgram,
};

