"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Connection,
  PublicKey,
  SystemProgram,
  VersionedTransaction,
  TransactionMessage,
} from "@solana/web3.js";
import { BorshAccountsCoder, BN } from "@coral-xyz/anchor";
import { ListingAccount } from "./useLaunchpadProgram/types";
import {
  getLaunchpadProgram,
  getShareholderPDA,
} from "./useLaunchpadProgram/utils";
import { useAnchorProvider } from "./useAnchor";
import { constants } from "@/lib/constants";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { toast } from "sonner";

// Get RPC endpoint with fallback
const getRpcEndpoint = () => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_HELIUS_RPC_KEY) {
    return `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_RPC_KEY}`;
  }
  return "https://api.mainnet-beta.solana.com";
};

export function useListings(limit: number = 20) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { publicKey } = useWallet();

  const connection = new Connection(getRpcEndpoint(), {
    commitment: "confirmed",
    wsEndpoint: undefined,
  });

  const provider = useAnchorProvider();
  const programId = new PublicKey(constants.investmentProgram.id);
  const program = getLaunchpadProgram(provider, programId);

  // Compute and UBC mint addresses
  const computeMint = new PublicKey(constants.investmentProgram.computeMint);
  const ubcMint = new PublicKey(constants.investmentProgram.ubcMint);

  // First, get only listing public keys to get total count
  const listingKeys = useQuery({
    queryKey: ["listing-keys"],
    queryFn: async () => {
      const accounts = await connection.getProgramAccounts(program.programId, {
        //filter is needed
        /* filters: [
          {
            memcmp: {
              offset: 0,
              bytes: BorshAccountsCoder.accountDiscriminator("ShareListing") as string,
            },
          },
        ],
        */
        dataSlice: {
          offset: 0,
          length: 0,
        },
      });
      setTotalItems(accounts.length);
      return accounts.map((acc) => acc.pubkey);
    },
  });

  // Then fetch only the current page's data
  const currentPageData = useQuery({
    queryKey: ["listings", currentPage, limit],
    queryFn: async () => {
      const startIndex = (currentPage - 1) * limit;
      const pageKeys = listingKeys.data?.slice(startIndex, startIndex + limit);

      if (!pageKeys) return [];

      const listings = await Promise.all(
        pageKeys.map(async (pubkey): Promise<ListingAccount> => {
          //@ts-ignore
          const account = await program.account.shareListing.fetch(pubkey);
          return {
            publicKey: pubkey,
            account: {
              pool: account.pool,
              seller: account.seller,
              shareholder: account.shareholder,
              numberOfShares: Number(account.numberOfShares),
              pricePerShare: Number(account.pricePerShare),
              listingId: account.listingId,
            },
          };
        })
      );

      return listings;
    },
    enabled: !!listingKeys.data,
  });

  // Create listing mutation
  const createListing = useMutation({
    mutationKey: ["listing", "create"],
    mutationFn: async ({
      listingId,
      numberOfShares,
      pricePerShare,
      pool,
    }: {
      listingId: string;
      numberOfShares: number;
      pricePerShare: number;
      pool: PublicKey;
    }) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const [shareholderPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("shareholder"), pool.toBuffer(), publicKey.toBuffer()],
        program.programId
      );

      const [listingPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("listing"),
          pool.toBuffer(),
          publicKey.toBuffer(),
          Buffer.from(listingId),
        ],
        program.programId
      );

      const tx = await program.methods
        .createListing(listingId, new BN(numberOfShares), new BN(pricePerShare))
        .accounts({
          shareholder: shareholderPda,
          shareListing: listingPda,
          pool,
          seller: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .transaction();

      const latestBlockhash = await connection.getLatestBlockhash();
      const versionedTx = new VersionedTransaction(
        new TransactionMessage({
          payerKey: publicKey,
          recentBlockhash: latestBlockhash.blockhash,
          instructions: tx.instructions,
        }).compileToV0Message()
      );

      return {
        transaction: versionedTx,
        signers: [],
        listingPda,
      };
    },
  });

  // Buy listing mutation
  const buyListing = useMutation({
    mutationKey: ["listing", "buy"],
    mutationFn: async ({
      listing,
      pool,
    }: {
      listing: ListingAccount;
      pool: PublicKey;
    }) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const buyerShareholder = await getShareholderPDA(
        program.programId,
        publicKey,
        pool
      );
      const sellerShareholder = await getShareholderPDA(
        program.programId,
        listing.account.seller,
        pool
      );

      if (!buyerShareholder || !sellerShareholder) {
        throw new Error("Failed to get shareholder PDA");
      }

      const tx = await program.methods
        .buyListing()
        .accounts({
          shareListing: listing.publicKey,
          buyerShareholder,
          sellerShareholder,
          computeMintAccount: computeMint,
          ubcMintAccount: ubcMint,
          buyerComputeAccount: await getAssociatedTokenAddress(
            computeMint,
            publicKey
          ),
          buyerUbcAccount: await getAssociatedTokenAddress(ubcMint, publicKey),
          sellerAccount: listing.account.seller,
          sellerComputeAccount: await getAssociatedTokenAddress(
            computeMint,
            listing.account.seller
          ),
          custodialAccount: await getAssociatedTokenAddress(
            ubcMint,
            listing.account.seller
          ),
          custodialComputeAccount: await getAssociatedTokenAddress(
            computeMint,
            listing.account.seller
          ),
          custodialUbcAccount: await getAssociatedTokenAddress(
            ubcMint,
            listing.account.seller
          ),
          pool,
          buyer: publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .transaction();

      const latestBlockhash = await connection.getLatestBlockhash();
      const versionedTx = new VersionedTransaction(
        new TransactionMessage({
          payerKey: publicKey,
          recentBlockhash: latestBlockhash.blockhash,
          instructions: tx.instructions,
        }).compileToV0Message()
      );

      return {
        transaction: versionedTx,
        signers: [],
      };
    },
  });

  // Cancel listing mutation
  const cancelListing = useMutation({
    mutationKey: ["listing", "cancel"],
    mutationFn: async (listing: ListingAccount) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const shareholder = await getShareholderPDA(
        program.programId,
        publicKey,
        listing.account.pool
      );

      if (!shareholder) {
        throw new Error("Failed to get shareholder PDA");
      }

      const tx = await program.methods
        .cancelListing()
        .accounts({
          shareListing: listing.publicKey,
          shareholder,
          pool: listing.account.pool,
          seller: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .transaction();

      const latestBlockhash = await connection.getLatestBlockhash();
      const versionedTx = new VersionedTransaction(
        new TransactionMessage({
          payerKey: publicKey,
          recentBlockhash: latestBlockhash.blockhash,
          instructions: tx.instructions,
        }).compileToV0Message()
      );

      return {
        transaction: versionedTx,
        signers: [],
      };
    },
  });

  const totalPages = Math.ceil(totalItems / limit);

  return {
    listings: currentPageData.data || [],
    isLoading: listingKeys.isLoading || currentPageData.isLoading,
    isError: listingKeys.isError || currentPageData.isError,
    error: listingKeys.error || currentPageData.error,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      nextPage: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)),
      previousPage: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
      goToPage: (page: number) =>
        setCurrentPage(Math.min(Math.max(1, page), totalPages)),
    },
    refresh: () => {
      listingKeys.refetch();
      currentPageData.refetch();
    },
    // Add mutations
    createListing,
    buyListing,
    cancelListing,
    // Add program-related objects that might be needed
    program,
    programId,
    connection,
    computeMint,
    ubcMint,
  };
}
