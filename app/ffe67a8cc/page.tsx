'use client'

import { Button } from "@/components/shadcn/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLaunchpadProgram } from "@/hooks/useLaunchpadProgram";
import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";

export default function Page() {

    const { initializePool, removePool, pools, freezePool } = useLaunchpadProgram();

    const [poolName, setPoolName] = useState<string>('');
    const [poolAddress, setPoolAddress] = useState<string>('');
    const [totalShares, setTotalShares] = useState<string>(''); // Changed to string
    const [feeRatio, setFeeRatio] = useState<string>('');       // Changed to string
    const [custodialAccount, setCustodialAccount] = useState<string>('');
    const [state, setState] = useState<string>('');

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

    const handleFreeze = async () => {
        freezePool.mutateAsync({ pool: new PublicKey(poolAddress), state: state == 'true' ? true : state == 'false' ? false : true });
    }

    return (
        <main className="container flex flex-col min-h-[100vh]">
            <div className="flex flex-row gap-8 mt-20">
                <Card className="flex flex-col gap-4 max-w-80 w-full h-fit">
                    <h4>Create pool</h4>
                    <Input value={poolName} onChange={(e) => setPoolName(e.target.value)} placeholder="Pool name"/>
                    <Input value={totalShares} onChange={(e) => setTotalShares(e.target.value)} placeholder="Total shares"/>
                    <Input value={feeRatio} onChange={(e) => setFeeRatio(e.target.value)} placeholder="Fee ratio"/>
                    <Input value={custodialAccount} onChange={(e) => setCustodialAccount(e.target.value)} placeholder="custodial account" />
                    <Button onClick={() => initialize()} variant='success'>Create Pool</Button>
                </Card>
                <Card className="min-h-none  min-w-[350px] h-fit">
                    <Input value={poolAddress} onChange={(e) => setPoolAddress(e.target.value)} placeholder="Pool address"/>
                    <Button onClick={handleRemove} variant='destructive' className="mt-4 w-full">Close</Button>
                </Card>
                <Card className="min-h-none  min-w-[350px] h-fit">
                    <Input value={poolAddress} onChange={(e) => setPoolAddress(e.target.value)} placeholder="Pool address"/>
                    <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="Freeze State" className="mt-2"/>
                    <Button onClick={handleFreeze} className="mt-4 w-full">Update</Button>
                </Card>
            </div>
            <div>
                <hr className="my-8"/>
                <h4>Pools</h4>
                {/* {pools.data && pools.data.map((pool, index) =>
                    <div className="flex flex-row gap-2 mt-2" key={index}>
                        <p>{pool.account.poolName}</p>
                        <p>{pool.publicKey.toBase58()}</p>
                        <p>{pool.account.isFrozen.toString()}</p>
                    </div>
                )} */}
            </div>
        </main>
    );
}
