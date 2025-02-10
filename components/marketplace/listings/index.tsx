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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';
import { formatPublicKey } from '@/lib/utils';
import { PublicKey, VersionedTransaction } from '@solana/web3.js';

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

    const [newListing, setNewListing] = useState({
        numberOfShares: '',
        pricePerShare: '',
        swarmId: '' // Add swarm ID field
    });

    const handleCreateListing = async () => {
        if (!connected || !publicKey) {
            toast.error('Please connect your wallet first');
            return;
        }

        setIsLoading(true);
        try {
            const listingId = `listing-${Date.now()}`;
            const { transaction, signers } = await launchpadProgram.createListing.mutateAsync({
                listingId,
                numberOfShares: parseInt(newListing.numberOfShares),
                pricePerShare: parseInt(newListing.pricePerShare),
                pool: new PublicKey(newListing.swarmId)
            });

            // Simulate transaction
            const simulation = await connection.simulateTransaction(transaction);
            if (simulation.value.err) {
                throw new Error(`Simulation failed: ${JSON.stringify(simulation.value.err)}`);
            }

            // Sign transaction
            if (signers.length > 0) {
                signers.forEach(signer => transaction.sign([signer]));
            }
            const signedTx = await signTransaction!(transaction);
            
            // Send and confirm
            const signature = await connection.sendRawTransaction(signedTx.serialize());
            await connection.confirmTransaction(signature);

            console.log('Listing created successfully:', { signature, listingId });
            toast.success('Listing created successfully');
            refresh();
            setNewListing({ numberOfShares: '', pricePerShare: '', swarmId: '' });
        } catch (error) {
            console.error('Error creating listing:', error);
            toast.error(`Failed to create listing: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

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

    return (
        <div className="space-y-8">
            {/* Create Listing Card */}
            <Card className="p-6 bg-white/5 border-amber-500/20 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold text-white mb-6">Create New Listing</h2>
                {connected ? (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-white/60 mb-2 block">Swarm ID</label>
                            <Input
                                type="text"
                                value={newListing.swarmId}
                                onChange={(e) => setNewListing(prev => ({ ...prev, swarmId: e.target.value }))}
                                className="bg-white/5 border-amber-500/20"
                                placeholder="Enter Swarm ID"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-white/60 mb-2 block">Number of Shares</label>
                                <Input
                                    type="number"
                                    value={newListing.numberOfShares}
                                    onChange={(e) => setNewListing(prev => ({ ...prev, numberOfShares: e.target.value }))}
                                    className="bg-white/5 border-amber-500/20"
                                    placeholder="Enter number of shares"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-white/60 mb-2 block">Price per Share</label>
                                <Input
                                    type="number"
                                    value={newListing.pricePerShare}
                                    onChange={(e) => setNewListing(prev => ({ ...prev, pricePerShare: e.target.value }))}
                                    className="bg-white/5 border-amber-500/20"
                                    placeholder="Enter price in $COMPUTE"
                                />
                            </div>
                        </div>
                        <Button
                            onClick={handleCreateListing}
                            disabled={isLoading}
                            className="w-full bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/20"
                        >
                            {isLoading ? 'Creating...' : 'Create Listing'}
                        </Button>
                    </div>
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
                        className="bg-white/5 hover:bg-white/10 text-white"
                    >
                        Refresh
                    </Button>
                </div>

                <div className="rounded-md border w-full">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Swarm ID</TableHead>
                                <TableHead>Shares</TableHead>
                                <TableHead>Price/Share</TableHead>
                                <TableHead>Seller</TableHead>
                                <TableHead>Total Price</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!isLoadingListings && listings.map((listing) => (
                                <TableRow key={listing.id}>
                                    <TableCell className="font-medium">{formatPublicKey(listing.swarm_id)}</TableCell>
                                    <TableCell>{listing.number_of_shares.toLocaleString()}</TableCell>
                                    <TableCell>{listing.price_per_share.toLocaleString()}</TableCell>
                                    <TableCell>{formatPublicKey(listing.seller)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span>{(listing.number_of_shares * listing.price_per_share).toLocaleString()}</span>
                                            <img src={listing.token.icon} alt={listing.token.label} className="w-4 h-4" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button 
                                                onClick={() => handleBuyListing(rawListings.find(l => l.account.listingId === listing.id)!)}
                                                className="bg-green-500/20 text-green-300 hover:bg-green-500/30"
                                            >
                                                Buy
                                            </Button>
                                            {listing.seller === publicKey?.toString() && (
                                                <Button 
                                                    onClick={() => handleCancelListing(rawListings.find(l => l.account.listingId === listing.id)!)}
                                                    className="bg-red-500/20 text-red-300 hover:bg-red-500/30"
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {listings.length > 0 && (
                    <div className="flex gap-2 mt-4">
                        <Button 
                            onClick={pagination.previousPage}
                            disabled={!pagination.hasPreviousPage}
                            className="bg-white/5 hover:bg-white/10 text-white"
                        >
                            Previous
                        </Button>
                        <span className="text-white/60">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>
                        <Button 
                            onClick={pagination.nextPage}
                            disabled={!pagination.hasNextPage}
                            className="bg-white/5 hover:bg-white/10 text-white"
                        >
                            Next
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
} 