import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import UbclaunchpadIDL from "@/data/programs/ubclaunchpad.json";
import { Ubclaunchpad } from "./ubclaunchpad";

export const getShareholderPDA = (programId: PublicKey, ownerPublicKey: PublicKey, poolPublicKey: PublicKey): PublicKey | null => {
    if (!programId || !ownerPublicKey || !poolPublicKey) {
        console.log("Missing required keys:", { programId: !!programId, ownerPublicKey: !!ownerPublicKey, poolPublicKey: !!poolPublicKey });
        return null;
    }

    try {
        const [shareholderPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("shareholder"),
                poolPublicKey.toBuffer(),
                ownerPublicKey.toBuffer()
            ],
            programId
        );
        return shareholderPda;
    } catch (error) {
        console.error("Error generating shareholder PDA:", error);
        return null;
    }
};

export const getTokenAccountPDA = (owner: PublicKey, mint: PublicKey): PublicKey => {
    const [pda] = PublicKey.findProgramAddressSync(
        [
            owner.toBuffer(),
            Buffer.from([
                6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                245, 133, 126, 255, 0, 169
            ]),
            mint.toBuffer()
        ],
        new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
    );
    return pda;
};

// This is a helper function to get the Ubclaunchpad Anchor program.
export function getLaunchpadProgram(provider: AnchorProvider, address?: PublicKey) {
    return new Program({ ...UbclaunchpadIDL, address: address ? address.toBase58() : UbclaunchpadIDL.address } as Ubclaunchpad, provider)
  }