'use client'

import { SwarmResponse } from '@/types/api';
import { Button } from "@/components/shadcn/button";
import { Token as TokenType } from "@/components/tokens/tokens.types";
import { Modal } from "@/components/ui/modal";
import { useLaunchpadProgram, useLaunchpadProgramAccount } from "@/hooks/useLaunchpadProgram";
import { IntlNumberFormat, IntlNumberFormatCurrency } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from '@tanstack/react-query';
import { Token } from '@/components/tokens/token';
import { supportedTokens } from '@/data/tokens/supported';
import { MarketListing } from '@/types/listing';
import Link from 'next/link';
import Image from "next/image";
import { LucideInfo, LucideLoaderCircle } from 'lucide-react';
import { PoolAccount } from '@/types/pool';
import { ConnectButton } from '@/components/solana/connectButton';
import { useTokenPrices } from '@/hooks/useTokenPrices';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/shadcn/tooltip';

interface BuyListingModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    listing: MarketListing;
    swarm: SwarmResponse;
    poolAccount: PoolAccount;
}

const BuyListingModal = ({ isModalOpen, closeModal, listing, swarm, poolAccount }: BuyListingModalProps) => {
    // Move all hooks to the top level
    const { publicKey } = useWallet();
    const { buyListing } = useLaunchpadProgramAccount({ 
        poolAddress: listing?.pool?.toBase58() || "" 
    });
    const { program } = useLaunchpadProgram();
    const [token, setToken] = useState<TokenType>(
        supportedTokens.find((token: TokenType) => 
            listing?.desiredToken?.toBase58() === token.mint
        ) as TokenType || supportedTokens[0]
    );
    const [loading, setLoading] = useState(false);
    const { data: tokenPrices, isFetching } = useTokenPrices();
    const queryClient = useQueryClient();
    
    // Move all useEffect and useCallback hooks to the top level
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isModalOpen]);

    const percent_fee = useCallback(() => {
        if (!poolAccount?.feeRatio) return 0;
        return ((Number(listing?.pricePerShare || 0) / (token?.resolution || 1_000_000)) * Number(listing?.numberOfShares || 0)) * ((1 / Number(poolAccount.feeRatio || 1)));
    }, [token?.resolution, listing?.pricePerShare, listing?.numberOfShares, poolAccount?.feeRatio]);

    const min_transaction_fee = useCallback(() => {
        if (!tokenPrices || !token?.mint || !tokenPrices.get(token.mint)) return 0;
        const TRANSACTION_CHARGE_MIN_USD = 3.87;
        const tokenPrice = tokenPrices.get(token.mint) || 1; // Default to 1 if undefined
        return Math.floor((TRANSACTION_CHARGE_MIN_USD / tokenPrice) * 100) / 100;
    }, [tokenPrices, token?.mint]);

    // Check if data is valid
    const isValidData = 
        listing && 
        listing.pool && 
        listing.shareholder && 
        listing.numberOfShares && 
        listing.pricePerShare &&
        swarm &&
        poolAccount;

    if (!isValidData) {
        return null;
    }

    const SHOW_USD_PRICE = true;
    const TRANSACTION_CHARGE_MIN_USD = 3.87;

    const handleBuy = async () => {
        if (!listing) {
            console.error('Buy listing mutation not available');
            return;
        }

        setLoading(true);

        try {
            // Validate pool account exists
            const poolAccountExists = await program?.account.pool.fetch(listing.pool)
                .catch(() => null);

            if (!poolAccountExists) {
                throw new Error('Pool account does not exist or is inaccessible');
            }

            // Try to fetch shareholder account - just for logging purposes
            let shareholderAccount;
            try {
                shareholderAccount = await program?.account.shareholder.fetch(listing.shareholder);
            } catch (error) {
                console.log('Shareholder account does not exist, it will be initialized during the transaction');
                // No need for a separate initialization call - the buy_listing instruction handles this
            }

            // Proceed with buy transaction
            await buyListing.mutateAsync({
                listing,
                swarm,
                poolAccount,
                fee: Math.floor(min_transaction_fee() * token.resolution)
            });

            // Send Telegram notification
            try {
                const totalAmount = ((Number(listing.pricePerShare) / (token?.resolution || 1_000_000)) * Number(listing.numberOfShares)) + percent_fee() + min_transaction_fee();
                
                // Send notification to the original channel
                await fetch('/api/notifications/telegram', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        swarmName: swarm?.name || 'Unknown Swarm',
                        numberOfShares: Number(listing.numberOfShares),
                        pricePerShare: IntlNumberFormat((Number(listing.pricePerShare) / (token?.resolution || 1_000_000)), (token?.decimals || 6)),
                        tokenSymbol: token.label,
                        totalAmount: IntlNumberFormat(totalAmount, (token?.decimals || 6))
                    }),
                });
                
                // Only send notification if number of shares is >= 10
                if (Number(listing.numberOfShares) >= 10) {
                    console.log('Sending notification for purchase with >= 10 shares');
                    
                    // Send simple notification to the new chat
                    const message = `🚀 A new share has been bought!`;
                    
                    // Use our proxy API instead of calling Telegram directly
                    const response = await fetch('/api/notifications/telegram-direct', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: message
                            // No need to specify chatId, the API will use the default
                        })
                    });
                    
                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('API error response:', errorText);
                    } else {
                        console.log('Notification sent successfully');
                    }
                } else {
                    console.log('Skipping notification for purchase with < 10 shares');
                }
            } catch (error) {
                console.error('Failed to send Telegram notification:', error);
                // Don't throw here - notification failure shouldn't stop the transaction
            }

        } catch (error) {
            console.error("Transaction failed:", error);
            const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
            console.error(errorMessage);
        } finally {
            queryClient.refetchQueries({ queryKey: ['all-listings'] });
            setLoading(false);
            closeModal();
        }
    }


    return (
        <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            className={`
                [@media(max-height:620px)]:h-[88vh]
                [@media(max-height:620px)]:w-[calc(100vw-12vh)]
                [@media(max-height:620px)]:max-w-[1048px]
                overflow-scroll p-6
            `}
        >
            <h4 className="mb-2 font-medium">Buy Shares</h4>
            <p className="text-muted text-sm">Are you sure you want to buy {Number(listing.numberOfShares)} share{Number(listing.numberOfShares) > 1 ? 's' : ''} of {swarm?.name}.</p>
            <div className='bg-card min-w-[320px] p-5 pb-3 rounded-md flex flex-col my-4'>
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
                <div className='border-t py-4 flex-col sm:flex-row text-md border-border w-full flex leading-none sm:items-center'>
                    <p className='font-medium w-fit'>Price per share:</p>
                    <span className='flex flex-row items-center mt-2 sm:ml-auto sm:mt-0'>
                        <p className='sm:ml-auto'>{IntlNumberFormat((Number(listing.pricePerShare) / (token?.resolution || 1_000_000)), (token?.decimals || 6))}</p>
                        <Token token={token} className='ml-2' hover={false} />
                    </span>
                </div>
                <div className='border-t py-4 flex-col sm:flex-row text-md border-border w-full flex leading-none sm:items-center'>
                    <p className='font-medium w-fit'>Sub total:</p>
                    <span className='flex flex-row items-center mt-2 sm:ml-auto sm:mt-0'>
                        <p className='sm:ml-auto'>{IntlNumberFormat((Number(listing.pricePerShare) / (token?.resolution || 1_000_000) * Number(listing.numberOfShares)), (token?.decimals || 6))}</p>
                        <Token token={token} className='ml-2' hover={false} />
                    </span>
                </div>
                <div className='border-t pt-4 pb-2 flex-col sm:flex-row text-md border-border w-full flex flex-row leading-none sm:items-center'>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant='ghost'
                                    className='flex flex-row items-center w-fit gap-1 -ml-2 px-2 py-1'
                                >
                                    <LucideInfo width={14} />
                                    <p className='font-medium w-fit'>Txn fee:</p>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className='border border-border'>
                                {IntlNumberFormatCurrency(TRANSACTION_CHARGE_MIN_USD)} + 5%
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <span className='flex flex-row items-center mt-2 sm:ml-auto sm:mt-0'>
                        <p className='sm:ml-auto'>{IntlNumberFormat(percent_fee() + min_transaction_fee(), (token?.decimals || 6))}</p>
                        <Token token={token} className='ml-2' hover={false} />
                    </span>
                </div>
            </div>
            <div className='px-3 mb-6'>
                <p className="text-muted text-sm">You&apos;ll pay</p>
                <div className="overflow-hidden flex flex-row items-center no-wrap gap-2 py-1">
                    <p className={`text-4xl leading-none font-bold text-emerald-500 truncate ${
                        token.mint === '9psiRdn9cXYVps4F1kFuoNjd2EtmqNJXrCPmRppJpump' 
                        ? 'metallic-text-ubc' 
                        : token.mint === 'B1N1HcMm4RysYz4smsXwmk2UnS8NziqKCM6Ho8i62vXo' 
                          ? 'metallic-text' 
                          : ''
                    }`}>
                        +
                        {IntlNumberFormat(((Number(listing.pricePerShare) / (token?.resolution || 1_000_000)) * Number(listing.numberOfShares)) + percent_fee() + min_transaction_fee(), (token?.decimals || 6))}
                    </p>
                    <Token token={token} hover={false} className='mt-1' />
                </div>
                {SHOW_USD_PRICE &&
                    <p className='text-muted text-sm pt-1'>
                        {isFetching ?
                            <span className='bg-white/10 rounded animate-pulse text-foreground/0'>1,000.00</span>
                            :
                            <span>
                                {tokenPrices && tokenPrices.get(token.mint === '11111111111111111111111111111111' ? '11111111111111111111111111111111' : token.mint) ?
                                    IntlNumberFormatCurrency((((Number(listing.pricePerShare) / (token?.resolution || 1_000_000)) * Number(listing.numberOfShares)) + percent_fee() + min_transaction_fee()) * tokenPrices.get(token.mint === '11111111111111111111111111111111' ? '11111111111111111111111111111111' : token.mint)!)
                                    :
                                    'No dex data'
                                }
                            </span>
                        }
                    </p>
                }
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
                            'You cannot buy your own shares'
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
