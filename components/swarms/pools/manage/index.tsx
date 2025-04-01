import { Modal } from "@/components/ui/modal";
import { Tag } from "@/components/ui/tag";
import { formatPublicKey, IntlNumberFormat } from "@/lib/utils";
import { PoolAccount } from "@/types/pool";
import { ProgramAccount } from "@coral-xyz/anchor";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UpdatePool } from "./updatePool";
import { useLaunchpadProgramAccount } from "@/hooks/useLaunchpadProgram";
import { Button } from "@/components/shadcn/button";
import { LucideLoaderCircle } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Status } from "@/components/ui/status";
import { usePermissions } from "@/hooks/usePermissions";

interface ManagePoolProps {
    open: boolean;
    isOpen: (value: boolean) => void;
    poolAccount: ProgramAccount<PoolAccount>;
}

const ManagePool = ({ poolAccount, open, isOpen }: ManagePoolProps) => {

    const { publicKey } = useWallet();

    const { updateCustodialAccount, updateAdminAuthority, increaseSupply, closePool, freezePool } = useLaunchpadProgramAccount({ poolAddress: poolAccount.publicKey.toBase58() });

    const [sharesError, setSharesError] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const { data: swarm, isLoading } = useQuery({
        queryKey: ['swarm', poolAccount.publicKey.toBase58()],
        queryFn: async () => {
            const response = await fetch(`/api/swarms/find-using-pool-id/${poolAccount.publicKey.toBase58()}`);
            if (!response.ok) {
                throw new Error('Could not fetch swarm');
            }
            return response.json();
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });

    const handleUpdateCustodialAccount = async (newAccount: string) => {
        await updateCustodialAccount.mutateAsync(newAccount);
    }

    const handleUpdateAuthority = async (newAccount: string) => {
        await updateAdminAuthority.mutateAsync(newAccount);
    }

    const handleIncreaseSupply = async (newShares: string) => {
        const n = Number(newShares) - Number(poolAccount.account.totalShares);
        if (n <= 0) {
            setSharesError('New total must be greater larger than before.');
            return;
        }
        await increaseSupply.mutateAsync(n);
    }

    const handleClosePool = async () => {
        setLoading(true);
        await closePool.mutateAsync();
        handleClose();
        setLoading(false);
    }

    const togglePoolFrozenStatus = async () => {
        await freezePool.mutateAsync(!poolAccount.account.isFrozen);
    }

    const handleClose = () => {
        isOpen(false);
        setSharesError('');
    }

    return (
        <Modal isOpen={open} onClose={handleClose} className="px-4 max-w-none">
            <h4 className="mb-1 mt-3 font-medium">Manage Pool</h4>
            <Status status={!poolAccount.account.isFrozen} labels={{ positive: "Tradeable", negative: "Frozen" }} />
            <div className='bg-card min-w-[320px] rounded-md flex flex-col px-4 my-6'>
                {swarm && !isLoading ?
                    <div className="flex items-center min-w-[200px] gap-2 py-4">
                        <Image
                            src={swarm.image}
                            alt={`${swarm.name} avatar`}
                            width={35}
                            height={35}
                            className="rounded-full"
                        />
                        <div className="flex flex-col">
                            <Link className="text-lg mb-0 leading-1 truncate hover:underline" href={`/invest/${swarm.id}`}>
                                {swarm.name}
                            </Link>
                            {swarm.role && <p className="text-sm text-muted truncate">{swarm.role}</p>}
                        </div>
                    </div>
                    :
                    <div className="flex items-center min-w-[200px] gap-4 py-4">
                        <div className="w-8 h-8 rounded-full bg-white/10" />
                        <p className="text-lg mb-0 leading-1 truncate">{poolAccount.account.poolName}</p>
                    </div>
                }
                <div className="flex flex-row gap-8 py-4 border-t border-border items-center">
                    <p className="font-bold">Custodial Wallet</p>
                    <UpdatePool
                        className="ml-auto"
                        defaultValue={poolAccount.account.custodialAccount.toBase58()}
                        formatFn={formatPublicKey}
                        updateFn={handleUpdateCustodialAccount}
                        authority={poolAccount.account.adminAuthority.toBase58()}
                    />
                </div>
                <div className="flex flex-row gap-8 py-4 border-t border-border items-center">
                    <p className="font-bold">Authority</p>
                    <UpdatePool
                        className="ml-auto"
                        defaultValue={poolAccount.account.adminAuthority.toBase58()}
                        formatFn={formatPublicKey}
                        updateFn={handleUpdateAuthority}
                        authority={poolAccount.account.adminAuthority.toBase58()}
                    />
                </div>
                <div className="flex flex-row gap-8 py-4 border-t border-border items-center">
                    <div className="flex flex-col">
                        <p className="font-bold">Total Shares</p>
                        {sharesError && <p className="text-red-500/80 text-sm max-w-[200px]">{sharesError}</p>}
                    </div>
                    <UpdatePool
                        className="ml-auto"
                        defaultValue={Number(poolAccount.account.totalShares)}
                        formatFn={IntlNumberFormat}
                        updateFn={handleIncreaseSupply}
                        authority={poolAccount.account.adminAuthority.toBase58()}
                    />
                </div>
                <div className="flex flex-row gap-8 py-4 border-t border-border items-center">
                    <p className="font-bold">Available Shares</p>
                    {Number(poolAccount.account.availableShares) == 0 ?
                        <Tag className="text-red-500 ml-auto">
                            Sold Out
                        </Tag>
                        :
                        <p className="text-muted ml-auto">{IntlNumberFormat(Number(poolAccount.account.availableShares))}</p>
                    }
                </div>
                {publicKey?.toBase58() === poolAccount.account.adminAuthority.toBase58() &&
                    <div className="flex flex-row gap-8 py-4 border-t border-border items-center">
                        <div className="flex flex-col gap-1">
                            <p className="font-bold">Frozen</p>
                            <p className="text-muted max-w-[300px]">If enabled <span className="underline font-bold">all</span> trading related to this pool will stop.</p>
                        </div>
                        <UpdatePool
                            type="toggle"
                            className="ml-auto"
                            defaultValue={!!poolAccount.account.isFrozen}
                            updateFn={togglePoolFrozenStatus}
                            authority={poolAccount.account.adminAuthority.toBase58()}
                        />
                    </div>
                }
            </div>
            {publicKey?.toBase58() === process.env.NEXT_PUBLIC_AUTHORITY &&
                <div className="flex flex-row justify-between items-center mb-2">
                    <Button onClick={handleClose} disabled={loading}>Cancel</Button>
                    <Button variant="destructive" onClick={handleClosePool} disabled={loading}>
                        {loading ?
                            <LucideLoaderCircle className="animate-spin" />
                            :
                            'Close Pool'
                        }
                    </Button>
                </div>
            }
        </Modal>
    );
};

export { ManagePool };
export type { ManagePoolProps };