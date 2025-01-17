'use client'

import { Button } from "@/components/shadcn/button";
import { SwarmComboBox } from "@/components/swarms/comboBox";
import { TokenComboBox } from "@/components/tokens/comboBox";
import { Token } from "@/components/tokens/tokens.types";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Tag } from "@/components/ui/tag";
import { IntlNumberFormat } from "@/lib/utils";
import { ChangeEvent, useRef, useState } from "react";

interface SellPositionProps {
    isModalOpen: boolean;
    closeModal: () => void;
    swarmId?: string;
}

const mockData = {
    owned_shares: 7950,
    available_shares: 5000
}

const SellPositionModal = ({ isModalOpen, closeModal, swarmId }: SellPositionProps) => {

    const [swarm, setSwarm] = useState<string>(swarmId || '');
    const [numShares, setNumShares] = useState<string>('');
    const [pricePerShare, setPricePerShare] = useState<number>(0);
    const [token, setToken] = useState<Token>();

    const sharesRef = useRef<HTMLParagraphElement>(null);

    const handleSharesInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value); // Remove commas for calculation
        if (isNaN(value) || value < 0 || value > mockData.available_shares) return;
        setNumShares(String(value));
    }

    const handlePriceInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (isNaN(value) || value < 0) return;
        setPricePerShare(value);
    }

    return (
        <Modal isOpen={isModalOpen} onClose={closeModal} className="p-6">
            <h4 className="mb-2 font-medium">Sell shares</h4>
            <p className="text-muted text-sm mb-4">Select which swarm you want to sell shares from, set a price per share, and the number of shares you want to sell.</p>
            <SwarmComboBox
                className="mb-4"
                defaultValue={swarm}
                onChange={(value: string) => setSwarm(value)}
            />
            <div className="border border-border rounded-md bg-card p-4 pb-2 flex flex-col">
                <p className="text-muted text-sm">You&apos;ll sell</p>
                <div className="flex flex-row">
                    <Input
                        className="border-none rounded-none bg-transparent pl-0 text-4xl font-bold no-arrows w-full"
                        style={{
                            minWidth: '2ch',
                            width: `${Number(numShares) !== 0 ? numShares.length + 1 : String(mockData.available_shares).length + 1.2}ch`,
                            maxWidth: `calc(100% - ${sharesRef.current?.offsetWidth}px - 10px)`,
                        }}
                        disabled={mockData.available_shares === 0 || !swarm}
                        type="number"
                        placeholder={IntlNumberFormat(mockData.available_shares)}
                        step={1}
                        min={0}
                        max={mockData.available_shares}
                        value={Number(numShares) !== 0 ? numShares : ''}
                        onChange={handleSharesInput}
                    />
                    <p className="mt-auto mb-4" ref={sharesRef}>/ Shares</p>
                </div>
            </div>
            <div className="flex flex-row justify-between mt-2 text-sm text-muted px-4 gap-6 flex-wrap mb-4">
                <p>Available to sell: {IntlNumberFormat(mockData.available_shares)}</p>
                <p>You own: {IntlNumberFormat(mockData.owned_shares)} share{mockData.owned_shares > 1 ? 's' : ''}</p>
            </div>
            <div className="border border-border rounded-md bg-card p-4 pb-2 flex flex-col">
                <p className="text-muted text-sm">Price per share</p>
                <div className="flex flex-row">
                    <Input
                        className="border-none rounded-none bg-transparent pl-0 text-4xl font-bold no-arrows w-full"
                        disabled={mockData.available_shares === 0 || Number(numShares) === 0}
                        type="number"
                        placeholder="--"
                        step={1}
                        min={0}
                        value={pricePerShare === 0 ? '' : pricePerShare}
                        onChange={handlePriceInput}
                    />
                    <TokenComboBox onChange={(token?: Token) => setToken(token)} disabled={mockData.available_shares === 0 || Number(numShares) === 0} />
                </div>
            </div>
            <div className="flex flex-row justify-between mt-2 text-sm text-muted px-4 gap-6 flex-wrap mb-4">
                <p>Minimum: 1 share</p>
            </div>
            {pricePerShare !== 0 && Number(numShares) !== 0 && token &&
                <div className="px-4 py-3 mb-4 w-full">
                    <p className="text-muted text-sm">You&apos;ll receive</p>
                    <div className="overflow-hidden flex flex-row items-center no-wrap gap-2">
                        <p className="text-4xl leading-none font-bold text-emerald-500 truncate">+{pricePerShare * Number(numShares)}</p>
                        <Tag>{token?.label}</Tag>
                    </div>
                </div>
            }
            <Button
                onClick={() => alert('selling shares...')}
                variant='destructive'
                disabled={mockData.available_shares === 0 || Number(numShares) === 0}
                className="w-full"
            >
                Sell shares
            </Button>
        </Modal>
    )
}

export { SellPositionModal }
export type { SellPositionProps }