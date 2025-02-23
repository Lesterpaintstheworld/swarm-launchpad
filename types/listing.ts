import { ShareListing } from "@/hooks/useLaunchpadProgram/types";
import { PublicKey } from "@solana/web3.js";

interface Listing {
    account: ShareListing,
    publicKey: PublicKey
}

interface MarketListing extends ShareListing {
    listingPDA: PublicKey;
}

export type {
    Listing,
    MarketListing
}