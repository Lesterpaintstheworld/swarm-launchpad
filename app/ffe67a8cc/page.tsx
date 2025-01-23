'use client'

import { Button } from "@/components/shadcn/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLaunchpadProgram } from "@/hooks/useLaunchpadProgram";
import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";

export default function Page() {

    const { initializePool, removePool, pools } = useLaunchpadProgram();

    const [poolName, setPoolName] = useState<string>('');
    const [poolAddress, setPoolAddress] = useState<string>('');
    const [totalShares, setTotalShares] = useState<string>(''); // Changed to string
    const [feeRatio, setFeeRatio] = useState<string>('');       // Changed to string
    const [custodialAccount, setCustodialAccount] = useState<string>('');

    useEffect(() => {
        console.log(pools.data && pools?.data[0].publicKey.toBase58());
    }, [pools.data]);

    const initialize = async () => {
        try {
            if (!poolName || !totalShares || !feeRatio || !custodialAccount) {
                console.error('All fields are required');
                return;
            }

            await initializePool.mutateAsync({
                poolName,
                totalShares: new BN(totalShares),
                feeRatio: new BN(feeRatio),
                custodialAccount: new PublicKey(custodialAccount),
            });
        } catch (error) {
            console.error('Failed to initialize pool:', error);
        }
    };

    const handleRemove = async () => {
        removePool.mutateAsync({ pool: new PublicKey(poolAddress) });
    }

    return (
        <main className="container justify-center flex flex-row gap-8">
            <Card className="flex flex-col gap-4 max-w-80 w-full">
                <h4>Create pool</h4>
                <Input value={poolName} onChange={(e) => setPoolName(e.target.value)} placeholder="Pool name"/>
                <Input value={totalShares} onChange={(e) => setTotalShares(e.target.value)} placeholder="Total shares"/>
                <Input value={feeRatio} onChange={(e) => setFeeRatio(e.target.value)} placeholder="Fee ratio"/>
                <Input value={custodialAccount} onChange={(e) => setCustodialAccount(e.target.value)} placeholder="custodial account" />
                <Button onClick={() => initialize()} variant='success'>Create Pool</Button>
            </Card>
            <Card className="min-h-none h-fit">
                <Input value={poolAddress} onChange={(e) => setPoolAddress(e.target.value)} placeholder="Pool address"/>
                {poolAddress}
                <Button onClick={handleRemove} variant='destructive'>Close</Button>
            </Card>
        </main>
    );
}
