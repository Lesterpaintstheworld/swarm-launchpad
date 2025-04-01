'use client'

import { Button } from "@/components/shadcn/button";
import { SwarmComboBox } from "@/components/swarms/comboBox";
import { TokenComboBox } from "@/components/tokens/comboBox";
import { Token as TokenType } from "@/components/tokens/tokens.types";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useLaunchpadProgramAccount } from "@/hooks/useLaunchpadProgram";
import { IntlNumberFormat, IntlNumberFormatCurrency } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { randomBytes } from "crypto";
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { Token } from '@/components/tokens/token';
import { supportedTokens } from '@/data/tokens/supported';
import { LucideLoaderCircle } from "lucide-react";
import { useTokenPrices } from "@/hooks/useTokenPrices";

interface TransferSharesModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    swarmId?: string;
}

const TransferSharesModal = ({ isModalOpen, closeModal, swarmId }: TransferSharesModalProps) => {

    const { publicKey } = useWallet();

    const [swarmID, setSwarmID] = useState<string>(swarmId || 'kinkong');
    const [numShares, setNumShares] = useState<string>('');
    const [recipient, setRecipient] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const { data: swarm } = useQuery({
        queryKey: ['swarm', swarmID],
        queryFn: async () => {
            const response = await fetch(`/api/swarms/${swarmID}`);
            if (!response.ok) throw new Error('Failed to fetch swarm');
            return response.json();
        },
        enabled: !!swarmID,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });

    useEffect(() => {
        console.log('Swarm:', swarm);
    }, [swarm])

    const { position, transferShares } = useLaunchpadProgramAccount({ poolAddress: swarm?.pool || "37u532qgHbjUHic6mQK51jkT3Do7qkWLEUQCx22MDBD8" });

    const { data, isLoading: loadingPosition } = position;
    const queryClient = useQueryClient();

    const sharesRef = useRef<HTMLParagraphElement>(null);

    const handleSharesInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Math.floor(Number(e.target.value)); // Remove commas for calculation
        if (isNaN(value) || value < 0 || value > data?.availableShares.toNumber()) return;
        setNumShares(String(value));
    }

    const handleSale = async () => {

        setLoading(true);
        try {

            if (!transferShares) {
                throw new Error('Transfer shares not available');
            }

            await transferShares.mutateAsync({
                custodialWallet: swarm?.wallet,
                numberOfShares: Math.floor(Number(numShares)),
                recipient: recipient,
            })

            queryClient.refetchQueries({ queryKey: ['listings', publicKey] });
            queryClient.refetchQueries({ queryKey: ['listings', swarm.pool] });

            closeModal();

        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    const handleClose = () => {
        setSwarmID('');
        setNumShares('');
        setRecipient('');
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
        <Modal
            isOpen={isModalOpen}
            onClose={handleClose}
            className={`
                [@media(max-height:740px)]:h-[88vh]
                [@media(max-height:740px)]:w-[calc(100vw-12vh)]
                [@media(max-height:740px)]:max-w-[1048px]
                [@media(max-height:740px)]:-top-6
                flex flex-col
                overflow-scroll p-6
            `}
        >
            <h4 className="mb-2 font-medium">Transfer shares</h4>
            <p className="text-muted text-sm mb-6">Select which swarm you want to transfer shares from, define the number of shares you want to let go, and enter the recipients wallet address.</p>
            <SwarmComboBox
                className="mb-4"
                defaultValue={swarmID}
                onChange={(value: string) => setSwarmID(value)}
            />
            <div className="border border-border rounded-md bg-card p-4 pb-2 flex flex-col">
                <p className="text-muted text-sm">You&apos;ll transfer</p>
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
                <p>Available to transfer: {IntlNumberFormat(data?.availableShares)}</p>
                <p>You own: {IntlNumberFormat(data?.shares)} share{data?.shares > 1 ? 's' : ''}</p>
            </div>
            <div className="border border-border rounded-md bg-card p-4 pb-2 flex flex-col mb-4">
                <p className="text-muted text-sm">Recipient</p>
                <Input
                    className="border-none rounded-none bg-transparent pl-0 text-4xl font-semibold no-arrows w-full"
                    disabled={data?.availableShares === 0 || Number(numShares) === 0 || loadingPosition || loading}
                    placeholder="Wallet address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
            </div>
            <Button
                onClick={() => handleSale()}
                variant='destructive'
                disabled={data?.availableShares === 0 || Number(numShares) === 0 || !publicKey || !swarmID || loadingPosition || loading}
                className="w-full mt-auto"
            >
                {loading ?
                    <LucideLoaderCircle className='animate-spin' />
                    :
                    'Transfer'
                }
            </Button>
        </Modal>
    )
}

export { TransferSharesModal }
export type { TransferSharesModalProps }
