import { PublicKey } from "@solana/web3.js";

interface ShareListing {
    pool: PublicKey;
    seller: PublicKey;
    shareholder: PublicKey;
    numberOfShares: number;
    pricePerShare: number;
    listingId: string;
}

interface ListingAccount {
    publicKey: PublicKey;
    account: ShareListing;
}

export type {
    ShareListing,
    ListingAccount
}