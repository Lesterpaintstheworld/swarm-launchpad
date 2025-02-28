import { PublicKey } from "@solana/web3.js";

interface ShareListing {
    pool: PublicKey;
    seller: PublicKey;
    shareholder: PublicKey;
    numberOfShares: BigInt;
    pricePerShare: BigInt;
    desiredToken: PublicKey;
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