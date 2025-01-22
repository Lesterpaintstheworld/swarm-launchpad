'use client'

import { Button } from "@/components/shadcn/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLaunchpadProgram } from "@/hooks/useLaunchpadProgram";
import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";

export default function Page() {

    const { initializePool } = useLaunchpadProgram();

    const [poolName, setPoolName] = useState<string>('');
    const [totalShares, setTotalShares] = useState<string>('100000'); // Changed to string
    const [feeRatio, setFeeRatio] = useState<string>('50');       // Changed to string
    const [partnerAccount, setPartnerAccount] = useState<string>('7YHSoHd6UrNE1Uy6NT7pXMaYGcSUAQGbGX8smnbSkmC1');
    const [swarmAccount, setSwarmAccount] = useState<string>('GAnQJN3zhr21pNpacTERKSzxp2kWNCi2n3gUeyutfYq4');
    const [investorRedisAccount, setInvestorRedisAccount] = useState<string>('7YHSoHd6UrNE1Uy6NT7pXMaYGcSUAQGbGX8smnbSkmC1');
    const [platformAccount, setPlatformAccount] = useState<string>('Hy4jMABrLVfAGHF2W5ax2uHKc9Mi53KEz2PTcEPcbDNC');

    const initialize = async () => {
        try {
            if (!poolName || !totalShares || !feeRatio || !partnerAccount || 
                !swarmAccount || !investorRedisAccount || !platformAccount) {
                console.error('All fields are required');
                return;
            }

            await initializePool.mutateAsync({
                poolName,
                totalShares: new BN(totalShares),
                feeRatio: new BN(feeRatio),
                partnerAccount: new PublicKey(partnerAccount),
                swarmAccount: new PublicKey(swarmAccount),
                investorRedistributionAccount: new PublicKey(investorRedisAccount),
                platformAccount: new PublicKey(platformAccount),
            });
        } catch (error) {
            console.error('Failed to initialize pool:', error);
        }
    };

    return (
        <main className="container justify-center">
            <Card className="flex flex-col gap-4 max-w-80 w-full">
                <h4>Create pool</h4>
                <Input value={poolName} onChange={(e) => setPoolName(e.target.value)} placeholder="Pool name"/>
                <Input value={totalShares} onChange={(e) => setTotalShares(e.target.value)} placeholder="Total shares"/>
                <Input value={feeRatio} onChange={(e) => setFeeRatio(e.target.value)} placeholder="Fee ratio"/>
                <Input value={partnerAccount} onChange={(e) => setPartnerAccount(e.target.value)} placeholder="partner account" />
                <Input value={swarmAccount} onChange={(e) => setSwarmAccount(e.target.value)} placeholder="swarm account" />
                <Input value={investorRedisAccount} onChange={(e) => setInvestorRedisAccount(e.target.value)} placeholder="investor redis account" />
                <Input value={platformAccount} onChange={(e) => setPlatformAccount(e.target.value)} placeholder="platform account" />
                <Button onClick={() => initialize()} variant='success'>Create Pool</Button>
            </Card>
        </main>
    );
}
