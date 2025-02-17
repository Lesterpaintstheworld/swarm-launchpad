"use client";

import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/datatable";
import { cn } from "@/lib/utils";
import { columns } from "./columns";
import { Button } from "@/components/shadcn/button";
import { LucideRefreshCcw } from "lucide-react";
import { MarketListing } from "../market.types";
import { ListingAccount } from "@/hooks/useLaunchpadProgram/types";
import { useListings } from "@/hooks/useListings";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";

const MarketListings = ({ className }: { className?: string }) => {
  const ITEMS_PER_PAGE = 20;
  const { publicKey, signTransaction } = useWallet();
  const { 
    listings, 
    isLoading, 
    pagination, 
    refresh,
    buyListing,
    cancelListing,
    connection 
  } = useListings(ITEMS_PER_PAGE);

  // Transform ListingAccount[] to MarketListing[]
  const transformedListings: MarketListing[] = listings.map(
    (listing: ListingAccount) => ({
      id: listing.account.listingId,
      swarm_id: listing.account.pool.toString(),
      number_of_shares: Number(listing.account.numberOfShares),
      price_per_share: Number(listing.account.pricePerShare),
      seller: listing.account.seller.toString(),
      token: {
        label: "$COMPUTE",
        icon: "/tokens/compute.svg",
      },
    })
  );

  const handleBuyListing = async (listing: ListingAccount) => {
    if (!publicKey || !signTransaction) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      const { transaction, signers } = await buyListing.mutateAsync({
        listing,
        pool: listing.account.pool,
      });

      if (signers.length > 0) {
        signers.forEach((signer) => transaction.sign([signer]));
      }

      const signedTx = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(signature);

      toast.success("Successfully bought listing");
      refresh();
    } catch (error) {
      console.error("Error buying listing:", error);
      toast.error(`Failed to buy listing: ${error}`);
    }
  };

  const handleCancelListing = async (listing: ListingAccount) => {
    if (!publicKey || !signTransaction) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      const { transaction, signers } = await cancelListing.mutateAsync(listing);

      if (signers.length > 0) {
        signers.forEach((signer) => transaction.sign([signer]));
      }

      const signedTx = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(signature);

      toast.success("Successfully cancelled listing");
      refresh();
    } catch (error) {
      console.error("Error cancelling listing:", error);
      toast.error(`Failed to cancel listing: ${error}`);
    }
  };

  return (
    <Card className={cn("w-full flex flex-col", className)}>
      <div className="flex flex-row items-center justify-between">
        <h4 className="mb-6">Market Listings</h4>
        <Button onClick={refresh} disabled={isLoading}>
          <LucideRefreshCcw size={16} />
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={isLoading ? [] : transformedListings}
      />
      {listings.length > 0 && (
        <div className="flex gap-2 mt-4">
          <Button
            onClick={pagination.previousPage}
            disabled={!pagination.hasPreviousPage}
          >
            Previous
          </Button>
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            onClick={pagination.nextPage}
            disabled={!pagination.hasNextPage}
          >
            Next
          </Button>
        </div>
      )}
    </Card>
  );
};

export { MarketListings };
