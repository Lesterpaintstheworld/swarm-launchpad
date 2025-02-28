import { ShareListing } from "@/hooks/useLaunchpadProgram/types";
import { PublicKey } from "@solana/web3.js";

interface Listing {
    account: ShareListing,
    publicKey: PublicKey
}

interface MarketListing extends ShareListing {
    listingPDA: PublicKey;
    // Add the missing properties that are being used in components
    _askingAmountInUsd?: number;
    _askingAmountInToken?: number;
    _pricePerShareInUsd?: number;
    _token?: string;
}

export type {
    Listing,
    MarketListing
}
