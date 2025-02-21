import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

interface PoolAccount {
    poolName: string;
    adminAuthority: PublicKey;
    totalShares: BN;
    availableShares: BN;
    isFrozen: boolean;
    ubcMint: PublicKey;
    computeMint: PublicKey;
    feeRatio: BN;
    custodialAccount: PublicKey;
}

export type {
    PoolAccount
}