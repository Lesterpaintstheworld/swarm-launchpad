'use client'

import { Button } from "@/components/shadcn/button";
import { SwarmComboBox } from "@/components/swarms/comboBox";
import { TokenComboBox } from "@/components/tokens/comboBox";
import { Token as TokenType } from "@/components/tokens/tokens.types";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useLaunchpadProgramAccount } from "@/hooks/useLaunchpadProgram";
import { IntlNumberFormat } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { randomBytes } from "crypto";
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { Token } from '@/components/tokens/token';
import { supportedTokens } from '@/data/tokens/supported';
import { LucideLoaderCircle } from "lucide-react";

// const minPriceData: Record<string, number> = {
//     $COMPUTE: 6500, // ≈ 1 USD
//     UBC: 720, // ≈ 1 USD
//     SOL: 0.006, // ≈ 1 USD
//     USDT: 1, // ≈ 1 USD
//     USDC: 1, // ≈ 1 USD
// }
const minPriceData: Record<string, number> = {
    $COMPUTE: 1, // ≈ 1 USD
    UBC: 1, // ≈ 1 USD
    SOL: 0.0001, // ≈ 1 USD
    USDT: 1, // ≈ 1 USD
    USDC: 1, // ≈ 1 USD
}

interface CreateListingModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    swarmId?: string;
}

const CreateListingModal = ({ isModalOpen, closeModal, swarmId }: CreateListingModalProps) => {

    const { publicKey } = useWallet();

    const [swarmID, setSwarmID] = useState<string>(swarmId || 'kinkong');
    const [numShares, setNumShares] = useState<string>('');
    const [pricePerShare, setPricePerShare] = useState<number>(0);
    const [token, setToken] = useState<TokenType>(supportedTokens.find((token: TokenType) => token.label === '$COMPUTE') as TokenType);
    const [loading, setLoading] = useState(false);

    const queryClient = useQueryClient();

    const { data: swarm } = useQuery({
        queryKey: ['swarm', swarmID],
        queryFn: async () => {
            const response = await fetch(`/api/swarms/${swarmID}`);
            if (!response.ok) throw new Error('Failed to fetch swarm');
            return response.json();
        },
        enabled: !!swarmID,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const { position, createListing } = useLaunchpadProgramAccount({ poolAddress: swarm?.pool || "37u532qgHbjUHic6mQK51jkT3Do7qkWLEUQCx22MDBD8" });

    const { data, isLoading: loadingPosition } = position;

    const sharesRef = useRef<HTMLParagraphElement>(null);

    const handleSharesInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Math.floor(Number(e.target.value)); // Remove commas for calculation
        if (isNaN(value) || value < 0 || value > data?.availableShares.toNumber()) return;
        setNumShares(String(value));
    }

    const handlePriceInput = (e: ChangeEvent<HTMLInputElement>) => {
        let value = Number(e.target.value);
        value = Math.floor(value * token.resolution) / token.resolution; // Round to token decimal precision
        if (isNaN(value) || value < 0) return;
        setPricePerShare(value);
    }

    useEffect(() => {
        console.log({ positionData: data });
    }, [data])

    const handleSale = () => {
        if (!createListing) {
            console.error('Create listing mutation not available');
            return;
        }

        setLoading(true);

        createListing.mutateAsync({
            listingId: randomBytes(8).toString('hex'),
            numberOfShares: Math.floor(Number(numShares)),
            pricePerShare: Math.floor(pricePerShare * token.resolution), // Convert to base units
            desiredToken: token.mint
        }).catch(error => {
            console.error('Failed to create listing:', error);
        }).finally(() => {
            queryClient.invalidateQueries({ queryKey: ['position', publicKey, swarm.pool] });
            queryClient.refetchQueries({ queryKey: ['listings', publicKey] });
            setLoading(false);
            handleClose();
        });

    }

    const handleClose = () => {
        setSwarmID('');
        setNumShares('');
        setPricePerShare(0);
        setToken(supportedTokens.find((token: TokenType) => token.label === '$COMPUTE') as TokenType);
        closeModal();
    };

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isModalOpen]);

    return (
        <Modal isOpen={isModalOpen} onClose={handleClose} className="p-6">
            <h4 className="mb-2 font-medium">Sell shares</h4>
            <p className="text-muted text-sm mb-6">Select which swarm you want to sell shares from, define the number of shares you want to let go, and set your price.</p>
            <SwarmComboBox
                className="mb-4"
                defaultValue={swarmID}
                onChange={(value: string) => setSwarmID(value)}
                secondaryMarketAvailable
            />
            <div className="border border-border rounded-md bg-card p-4 pb-2 flex flex-col">
                <p className="text-muted text-sm">You&apos;ll sell</p>
                <div className="flex flex-row">
                    <Input
                        className="border-none rounded-none bg-transparent pl-0 text-4xl font-bold no-arrows w-full"
                        style={{
                            minWidth: '2ch',
                            width: `${Number(numShares) !== 0 ? numShares.length + 1 : String(data?.availableShares.toNumber()).length + 1.2}ch`,
                            maxWidth: `calc(100% - ${sharesRef.current?.offsetWidth}px - 10px)`,
                        }}
                        disabled={data?.availableShares === 0 || !swarmID || loadingPosition || loading}
                        type="number"
                        placeholder={IntlNumberFormat(Number(data?.availableShares)) || "--"}
                        step={1}
                        min={0}
                        max={data?.availableShares}
                        value={Number(numShares) !== 0 ? numShares : ''}
                        onChange={handleSharesInput}
                    />
                    <p className="mt-auto mb-4" ref={sharesRef}>/ Shares</p>
                </div>
            </div>
            <div className="flex flex-row justify-between mt-2 text-sm text-muted px-4 gap-6 flex-wrap mb-4">
                <p>Available to sell: {IntlNumberFormat(data?.availableShares)}</p>
                <p>You own: {IntlNumberFormat(data?.shares)} share{data?.shares > 1 ? 's' : ''}</p>
            </div>
            <div className="border border-border rounded-md bg-card p-4 pb-2 flex flex-col">
                <p className="text-muted text-sm">Price per share</p>
                <div className="flex flex-row">
                    <Input
                        className="border-none rounded-none bg-transparent pl-0 text-4xl font-bold no-arrows w-full"
                        disabled={data?.availableShares === 0 || Number(numShares) === 0 || loadingPosition || loading}
                        type="number"
                        placeholder={IntlNumberFormat(minPriceData[token.label as keyof typeof minPriceData], (token?.decimals || 6)) || "--"}
                        step={1}
                        min={minPriceData[token.label as keyof typeof minPriceData] || 0}
                        value={pricePerShare === 0 ? '' : pricePerShare}
                        onChange={handlePriceInput}
                    />
                    <TokenComboBox
                        defaultValue={token?.label}
                        onChange={(token: TokenType) => setToken(token)}
                        disabled={data?.availableShares === 0 || Number(numShares) === 0 || loadingPosition}
                    />
                </div>
            </div>
            <div className="flex flex-row justify-between mt-2 text-sm text-muted px-4 gap-6 flex-wrap mb-4">
                <p>Minimum: <span className='font-bold'>{minPriceData[token.label as keyof typeof minPriceData]}</span> {token.label}</p>
            </div>
            {pricePerShare !== 0 && Number(numShares) !== 0 && token &&
                <div className="px-4 py-3 mb-4 w-full">
                    <p className="text-muted text-sm">You&apos;ll receive</p>
                    <div className="overflow-hidden flex flex-row items-center no-wrap gap-2">
                        <p className="text-4xl leading-none font-bold text-emerald-500 truncate">
                            +
                            {IntlNumberFormat(pricePerShare * Number(numShares), token.decimals)}
                        </p>
                        <Token token={token} hover={false} />
                    </div>
                </div>
            }
            <Button
                onClick={() => handleSale()}
                variant='destructive'
                disabled={data?.availableShares === 0 || Number(numShares) === 0 || pricePerShare === 0 || !token || !publicKey || !swarmID || loadingPosition || loading}
                className="w-full"
            >
                {loading ?
                    <LucideLoaderCircle className='animate-spin' />
                    :
                    'Sell'
                }
            </Button>
        </Modal>
    )
}

export { CreateListingModal }
export type { CreateListingModalProps }
