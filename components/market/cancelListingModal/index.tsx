'use client'

import { SwarmResponse } from '@/types/api';

import { Button } from "@/components/shadcn/button";
import { Token as TokenType } from "@/components/tokens/tokens.types";
import { Modal } from "@/components/ui/modal";
import { useLaunchpadProgram, useLaunchpadProgramAccount } from "@/hooks/useLaunchpadProgram";
import { IntlNumberFormat, IntlNumberFormatCurrency } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { useQueryClient } from '@tanstack/react-query';
import { Token } from '@/components/tokens/token';
import { supportedTokens } from '@/data/tokens/supported';
import { MarketListing } from '@/types/listing';
import Link from 'next/link';
import Image from "next/image";
import { LucideLoaderCircle } from 'lucide-react';
import { useDexScreenerPrice } from '@/hooks/useTokenPrice';

interface CancelListingModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    listing: MarketListing;
    swarm: SwarmResponse;
}

const CancelListingModal = ({ isModalOpen, closeModal, listing, swarm }: CancelListingModalProps) => {

    const SHOW_USD_PRICE = true;

    const { publicKey } = useWallet();

    const { cancelListing } = useLaunchpadProgramAccount({ poolAddress: listing.pool.toBase58() });

    const [token, setToken] = useState<TokenType>(supportedTokens.find((token: TokenType) => token.mint === listing.desiredToken.toBase58()) as TokenType);
    const [loading, setLoading] = useState(false);

    const { data, isFetching } = useDexScreenerPrice({ token });
    const queryClient = useQueryClient();

    const handleCancel = () => {
        if (!listing) {
            console.error('Create listing mutation not available');
            return;
        }

        setLoading(true);

        cancelListing?.mutateAsync({
            listing: listing.listingPDA,
            shareholder: listing.shareholder
        }).catch(error => {
            console.error('Failed to create listing:', error);
        }).finally(() => {
            queryClient.refetchQueries({ queryKey: ['listings', publicKey] });
            queryClient.refetchQueries({ queryKey: ['listings', swarm.pool] });
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
        <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            className={`
                [@media(max-height:500px)]:h-[88vh]
                [@media(max-height:500px)]:w-[calc(100vw-12vh)]
                [@media(max-height:500px)]:max-w-[1048px]
                overflow-scroll p-6 flex flex-col
            `}
        >
            <h4 className="mb-2 font-medium">Cancel Sale Listing</h4>
            <p className="text-muted text-sm">Are you sure you want to cancel this sale listing?</p>
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
                    <p className='font-medium w-fit min-h-[26px] flex items-center'>No. shares:</p>
                    <p className='mt-2 sm:ml-auto sm:mt-0'>{Number(listing.numberOfShares)}</p>
                </div>
                <div className='border-t pt-4 flex-col sm:flex-row text-md border-border w-full flex flex-row leading-none sm:items-center'>
                    <p className='font-medium w-fit'>Price per share:</p>
                    <span className='flex flex-row items-center mt-2 sm:ml-auto sm:mt-0'>
                        <p className='sm:ml-auto'>{IntlNumberFormat((Number(listing.pricePerShare) / (token?.resolution || 1_000_000)), (token?.decimals || 6))}</p>
                        <Token token={token} className='ml-2' hover={false} />
                    </span>
                </div>
            </div>
            <div className='px-3 mb-6'>
                <p className="text-muted text-sm">You&apos;ll receive</p>
                <div className="overflow-hidden flex flex-row items-center no-wrap gap-2 py-1">
                    <p className="text-4xl leading-none font-bold text-emerald-500 truncate">
                        +
                        {IntlNumberFormat((Number(listing.pricePerShare) / (token?.resolution || 1_000_000)) * Number(listing.numberOfShares), (token?.decimals || 6))}
                    </p>
                    <Token token={token} hover={false} className='mt-1' />
                </div>
                {SHOW_USD_PRICE &&
                    <p className='text-muted text-sm pt-1'>
                        ≈&nbsp;
                        {isFetching ?
                            <span className='bg-white/10 rounded animate-pulse text-foreground/0'>1,000.00</span>
                            :
                            <span>
                                {data?.length > 0 ?
                                    IntlNumberFormatCurrency((((Number(listing.pricePerShare) / (token?.resolution || 1_000_000)) * Number(listing.numberOfShares)) * 1.05) * data[0].priceUsd)
                                    :
                                    'No dex data'
                                }
                            </span>
                        }
                    </p>
                }
            </div>
            <Button
                onClick={() => handleCancel()}
                variant='destructive'
                className="w-full mt-auto"
                disabled={loading}
            >
                {loading ?
                    <LucideLoaderCircle className='animate-spin' />
                    :
                    'Yes, Cancel Listing'
                }

            </Button>
        </Modal>
    )
}

export { CancelListingModal }
export type { CancelListingModalProps }
