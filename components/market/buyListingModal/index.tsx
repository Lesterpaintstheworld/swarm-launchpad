'use client'

import { SwarmResponse } from '@/types/api';

import { Button } from "@/components/shadcn/button";
import { Token as TokenType } from "@/components/tokens/tokens.types";
import { Modal } from "@/components/ui/modal";
import { useLaunchpadProgramAccount } from "@/hooks/useLaunchpadProgram";
import { IntlNumberFormat } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { useQueryClient } from '@tanstack/react-query';
import { Token } from '@/components/tokens/token';
import { supportedTokens } from '@/data/tokens/supported';
import { MarketListing } from '@/types/listing';
import Link from 'next/link';
import Image from "next/image";
import { LucideLoaderCircle } from 'lucide-react';
import { PoolAccount } from '@/types/pool';
import { ConnectButton } from '@/components/solana/connectButton';

interface BuyListingModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    listing: MarketListing;
    swarm: SwarmResponse;
    poolAccount: PoolAccount;
}

const BuyListingModal = ({ isModalOpen, closeModal, listing, swarm, poolAccount }: BuyListingModalProps) => {

    const { publicKey } = useWallet();

    const { buyListing } = useLaunchpadProgramAccount({ poolAddress: listing.pool.toBase58() });

    const [token, setToken] = useState<TokenType>(supportedTokens.find((token: TokenType) => token.mint === listing.desiredToken.toBase58()) as TokenType);
    const [loading, setLoading] = useState(false);

    const queryClient = useQueryClient();

    const handleBuy = () => {

        if (!listing) {
            console.error('Buy listing mutation not available');
            return;
        }

        setLoading(true);

        buyListing
            .mutateAsync({
                listing,
                swarm,
                poolAccount
            })
            .catch(error => {
                console.log("Full error:", JSON.stringify(error, null, 2));
            })
            .finally(() => {
                queryClient.invalidateQueries({ queryKey: ['position', publicKey, listing.pool] });
                queryClient.refetchQueries({ queryKey: ['listings', listing.seller] });
                queryClient.refetchQueries({ queryKey: ['all-listings', listing.seller] });
                setLoading(false);
                closeModal();
            });
    }

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isModalOpen]);

    return (
        <Modal isOpen={isModalOpen} onClose={closeModal} className="p-6">
            <h4 className="mb-2 font-medium">Buy Shares</h4>
            <p className="text-muted text-sm">Are you sure you want to buy {Number(listing.numberOfShares)} share{Number(listing.numberOfShares) > 1 ? 's' : ''} of {swarm?.name}.</p>
            <div className='bg-card min-w-[320px] p-5 rounded-md flex flex-col my-4'>
                {swarm &&
                    <div className="flex items-center min-w-[200px] gap-2 pb-4">
                        <Image
                            src={swarm.image}
                            alt={`${swarm.name} avatar`}
                            width={24}
                            height={24}
                            className="rounded-full"
                        />
                        <div className="flex flex-col">
                            <Link className="text-sm mb-0 leading-1 truncate hover:underline" href={`/invest/${swarm.id}`}>
                                {swarm.name}
                            </Link>
                            {swarm.role && <p className="text-sm text-muted truncate">{swarm.role}</p>}
                        </div>
                    </div>
                }
                <div className='border-t py-4 flex-col sm:flex-row text-md border-border w-full flex flex-row leading-none sm:items-center'>
                    <p className='font-medium w-fit'>No. Shares:</p>
                    <p className='mt-2 sm:ml-auto sm:mt-0'>{Number(listing.numberOfShares)}</p>
                </div>
                <div className='border-t py-4 flex-col sm:flex-row text-md border-border w-full flex flex-row leading-none sm:items-center'>
                    <p className='font-medium w-fit'>Price per share:</p>
                    <span className='flex flex-row items-center mt-2 sm:ml-auto sm:mt-0'>
                        <p className='sm:ml-auto'>{IntlNumberFormat((Number(listing.pricePerShare) / (token?.resolution || 1_000_000)), (token?.decimals || 6))}</p>
                        <Token token={token} className='ml-2' hover={false} />
                    </span>
                </div>
                <div className='border-t pt-4 flex-col sm:flex-row text-md border-border w-full flex flex-row leading-none sm:items-center'>
                    <p className='font-medium w-fit'>Txn Fee (5%):</p>
                    <p className='sm:ml-auto'>{IntlNumberFormat(((Number(listing.pricePerShare) / (token?.resolution || 1_000_000)) * Number(listing.numberOfShares)) * 0.05, (token?.decimals || 6))}</p>
                </div>
            </div>
            <div className='px-5 mb-6'>
                <p className="text-muted text-sm">You&apos;ll pay</p>
                <div className="overflow-hidden flex flex-row items-center no-wrap gap-2 py-1">
                    <p className="text-4xl leading-none font-bold text-emerald-500 truncate">
                        +
                        {IntlNumberFormat(((Number(listing.pricePerShare) / (token?.resolution || 1_000_000)) * Number(listing.numberOfShares)) * 1.05, (token?.decimals || 6))}
                    </p>
                    <Token token={token} hover={false} className='mt-1' />
                </div>
            </div>
            {!publicKey ?
                <ConnectButton className='w-full' />
                :
                <Button
                    onClick={() => handleBuy()}
                    variant={publicKey?.toBase58() === listing.seller.toBase58() ? 'destructive' : 'success'}
                    className="w-full"
                    disabled={loading || publicKey?.toBase58() === listing.seller.toBase58()}
                >
                    {loading ?
                        <LucideLoaderCircle className='animate-spin' />
                        :
                        publicKey?.toBase58() === listing.seller.toBase58() ?
                            'You can\'t buy your own shares'
                            :
                            'Buy Shares'
                    }
                </Button>
            }
        </Modal>
    )
}

export { BuyListingModal }
export type { BuyListingModalProps }
