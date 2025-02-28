'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/shadcn/button';
import { useState } from 'react';
import { Transaction } from '@solana/web3.js';
import { toast } from 'sonner';

export function ClaimButton() {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [isLoading, setIsLoading] = useState(false);

    const handleClaim = async () => {
        if (!publicKey) {
            toast.error('Please connect your wallet first');
            return;
        }

        setIsLoading(true);
        try {
            const {
                error,
                message,
                transaction: encodedTx,
                blockhashInfo,
            } = await fetch('/api/claim', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    userAddress: publicKey,
                }),
            }).then((r) => r.json());

            if (error || message) {
                toast.error(`${error}: ${message}`);
                return;
            }

            // Send transaction
            const transaction = Transaction.from(
                Buffer.from(encodedTx, 'base64'),
            );
            const signature = await sendTransaction(transaction, connection);

            // Wait for confirmation
            await connection.confirmTransaction({
                signature,
                ...blockhashInfo,
            });

            toast.success('Successfully claimed 10,000 $COMPUTE!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to claim tokens');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted">Snapshot holder?</span>
            <div className="flex flex-col items-center">
                <Button
                    variant="default"
                    size="default"
                    className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 px-4 py-2 text-sm rounded-lg font-medium"
                    onClick={handleClaim}
                    disabled={isLoading}
                >
                    {isLoading ? 'Claiming...' : 'Claim 10,000 $COMPUTE!'}
                </Button>
                <span className="text-xs text-muted mt-1">
                    Max distribution: 5M $COMPUTE
                </span>
            </div>
        </div>
    );
}
