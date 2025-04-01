'use client'

import { Button } from "@/components/shadcn/button";
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { useLaunchpadProgram } from "@/hooks/useLaunchpadProgram";
import { cn } from "@/lib/utils";
import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { LucideLoaderCircle, LucidePackagePlus } from "lucide-react";
import { useState } from "react";

interface CreatePoolProps {
    className?: string;
}

const CreatePool = ({ className }: CreatePoolProps) => {

    const { initializePool } = useLaunchpadProgram();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [poolName, setPoolName] = useState<string>('');
    const [totalShares, setTotalShares] = useState<string>(''); // Changed to string
    const [feeRatio, setFeeRatio] = useState<string>('');       // Changed to string
    const [custodialAccount, setCustodialAccount] = useState<string>('');

    const create = async () => {
        setLoading(true);
        try {

            if (!poolName || !totalShares || !feeRatio || !custodialAccount) {
                throw new Error('All fields are required');
            }

            if (feeRatio.includes('.') || Number(feeRatio) % 1 !== 0) {
                throw new Error('Fee ratio must be a whole number');
            }

            await initializePool.mutateAsync({
                poolName,
                totalShares: new BN(totalShares),
                feeRatio: new BN(100 / Math.floor(Number(feeRatio))),
                custodialAccount: new PublicKey(custodialAccount),
            });
        } catch (error) {
            console.error('Failed to initialize pool:', error);
        }
        setLoading(false);
    };

    return (
        <>
            <Card className={cn("flex flex-row items-center justify-between gap-4 w-full", className)}>
                <div>
                    <h4>Create Pool</h4>
                    <p className="opacity-60 text-balance">Create a new pool for investors to purchase shares from.</p>
                </div>
                <Button
                    className="w-fit bg-foreground text-background"
                    onClick={() => setOpen(true)}
                >
                    <LucidePackagePlus />
                    <span className="sr-only">Create</span>
                </Button>
            </Card>
            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                className={`
                    [@media(max-height:620px)]:h-[88vh]
                    [@media(max-height:620px)]:w-[calc(100vw-12vh)]
                    overflow-scroll p-6 flex flex-col min-w-[650px]
                `}
            >
                <h4 className="mb-1">Create pool</h4>
                <p className="opacity-60 mb-6">This can only be done by the UBC admin wallet.</p>
                <Label htmlFor="poolName" className="ml-1 mb-2 font-normal" >
                    Name<span className="text-red-500"> *</span>
                </Label>
                <Input disabled={loading} value={poolName} onChange={(e) => setPoolName(e.target.value)} placeholder="Swarm XYZ" className="rounded-sm" />
                <p className="text-muted text-xs ml-1 mt-1">This must be unique</p>
                <Label htmlFor="poolName" className="ml-1 mb-2 mt-6 font-normal">
                    Total shares<span className="text-red-500"> *</span>
                </Label>
                <Input disabled={loading} value={totalShares} onChange={(e) => setTotalShares(e.target.value)} placeholder="1,000,000" className="rounded-sm" />
                <p className="text-muted text-xs ml-1 mt-1">This is the number of shares available for purchase</p>
                <Label htmlFor="poolName" className="ml-1 mb-2 mt-6 font-normal">
                    Fee %<span className="text-red-500"> *</span>
                </Label>
                <Input disabled={loading} value={feeRatio} onChange={(e) => setFeeRatio(e.target.value)} placeholder="5" className="rounded-sm" />
                <p className="text-muted text-xs ml-1 mt-1">Must be a whole integer. e.g. 5 = 5%</p>
                <Label htmlFor="poolName" className="ml-1 mb-2 mt-6 font-normal">
                    Custodial Wallet<span className="text-red-500"> *</span>
                </Label>
                <Input disabled={loading} value={custodialAccount} onChange={(e) => setCustodialAccount(e.target.value)} placeholder="2kzar...ihH9" className="rounded-sm" />
                <Button disabled={loading} onClick={() => create()} variant='success' className="mt-6">
                    {loading ? <LucideLoaderCircle width={18} className="animate-spin" /> : 'Create'}
                </Button>
            </Modal>
        </>
    )

}

export { CreatePool };
export type { CreatePoolProps };