'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ConnectButton } from '@/components/solana/connectButton';
import { ListingAccount } from '@/hooks/useLaunchpadProgram/types';
import { MarketListing } from '../types';
import { useLaunchpadProgram } from '@/hooks/useLaunchpadProgram/index';
import { DataTable } from '@/components/ui/datatable';
import { formatPublicKey } from '@/lib/utils';
import { PublicKey, VersionedTransaction } from '@solana/web3.js';
import { SellPositionModal } from '@/components/swarms/sellPositionModal';

export function MarketplaceListings() {
    const { connection } = useConnection();
    const { connected } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const { publicKey, signTransaction } = useWallet();
    const launchpadProgram = useLaunchpadProgram();
    const { 
        listings: rawListings, 
        isLoading: isLoadingListings, 
        pagination,
        refresh 
    } = launchpadProgram.useListingsPagination(20);

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Transform ListingAccount[] to MarketListing[]
    const listings: MarketListing[] = rawListings.map((listing: ListingAccount) => ({
        id: listing.account.listingId,
        swarm_id: listing.account.pool.toString(),
        number_of_shares: Number(listing.account.numberOfShares),
        price_per_share: Number(listing.account.pricePerShare),
        seller: listing.account.seller.toString(),
        token: {
            label: '$COMPUTE',
            icon: '/tokens/compute.svg'
        }
    }));

    const handleBuyListing = async (listing: ListingAccount) => {
        if (!connected || !publicKey) {
            toast.error('Please connect your wallet first');
            return;
        }

        try {
            const { transaction, signers } = await launchpadProgram.buyListing.mutateAsync({
                listing,
                pool: listing.account.pool
            });

            const simulation = await connection.simulateTransaction(transaction);
            if (simulation.value.err) {
                throw new Error(`Simulation failed: ${JSON.stringify(simulation.value.err)}`);
            }

            if (signers.length > 0) {
                signers.forEach(signer => transaction.sign([signer]));
            }
            const signedTx = await signTransaction!(transaction);
            
            const signature = await connection.sendRawTransaction(signedTx.serialize());
            await connection.confirmTransaction(signature);

            console.log('Successfully bought listing:', { signature, listingId: listing.account.listingId });
            toast.success('Successfully bought listing');
            refresh();
        } catch (error) {
            console.error('Error buying listing:', error);
            toast.error(`Failed to buy listing: ${error}`);
        }
    };

    const handleCancelListing = async (listing: ListingAccount) => {
        try {
            const tx = await launchpadProgram.cancelListing.mutateAsync(listing);
            
            console.log('Successfully cancelled listing:', {
                signature: tx,
                listingId: listing.account.listingId
            });
            
            toast.success('Successfully cancelled listing');
            refresh();
        } catch (error) {
            console.error('Error cancelling listing:', error);
            toast.error('Failed to cancel listing');
        }
    };

    const columns = [
        {
            accessorKey: 'swarm_id',
            header: 'Swarm ID',
            cell: ({ row }: { row: any }) => <span className="font-medium">{formatPublicKey(row.getValue('swarm_id'))}</span>
        },
        {
            accessorKey: 'number_of_shares',
            header: 'Shares',
            cell: ({ row }: { row: any }) => row.getValue('number_of_shares').toLocaleString()
        },
        {
            accessorKey: 'price_per_share',
            header: 'Price/Share',
            cell: ({ row }: { row: any }) => row.getValue('price_per_share').toLocaleString()
        },
        {
            accessorKey: 'seller',
            header: 'Seller',
            cell: ({ row }: { row: any }) => formatPublicKey(row.getValue('seller'))
        },
        {
            accessorKey: 'total_price',
            header: 'Total Price',
            cell: ({ row }: { row: any }) => {
                const listing = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <span>{(listing.number_of_shares * listing.price_per_share).toLocaleString()}</span>
                        <img src={listing.token.icon} alt={listing.token.label} className="w-4 h-4" />
                    </div>
                );
            }
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }: { row: any }) => {
                const listing = rawListings.find(l => l.account.listingId === row.original.id);
                return (
                    <div className="flex gap-2">
                        <Button 
                            onClick={() => handleBuyListing(listing!)}
                            className="bg-green-500/20 text-green-300 hover:bg-green-500/30"
                        >
                            Buy
                        </Button>
                        {row.original.seller === publicKey?.toString() && (
                            <Button 
                                onClick={() => handleCancelListing(listing!)}
                                className="bg-red-500/20 text-red-300 hover:bg-red-500/30"
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                );
            }
        }
    ];

    return (
        <div className="space-y-8">
            {/* Create Listing Card */}
            <Card className="p-6 bg-white/5 border-amber-500/20 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold text-white mb-6">Create New Listing</h2>
                {connected ? (
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/20"
                    >
                        Create Listing
                    </Button>
                ) : (
                    <ConnectButton className="w-full" />
                )}
            </Card>

            {/* Active Listings */}
            <Card className="p-6 w-full bg-white/5 border-amber-500/20 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-white">Active Listings</h2>
                    <Button 
                        onClick={refresh}
                        disabled={isLoadingListings}
                        className="bg-white/5 hover:bg-white/10 text-foreground"
                    >
                        Refresh
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={!isLoadingListings ? listings : []}
                    pagination={true}
                    searchable={true}
                />
            </Card>

            <SellPositionModal
                isModalOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
            />
        </div>
    );
} 