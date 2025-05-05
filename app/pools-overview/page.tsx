'use client'

import { TransferSharesCard } from "@/components/cards/transferShares";
import { CreatePool } from "@/components/swarms/pools/create";
import { PoolTable } from "@/components/swarms/pools/table";
import { Card } from "@/components/ui/card";
import { usePermissions } from "@/hooks/usePermissions";
import { useWallet } from "@solana/wallet-adapter-react";
import { LucideLoaderCircle, LucideTriangleAlert } from "lucide-react";
import { redirect } from "next/navigation";

export default function Page() {

    const { publicKey } = useWallet();

    const { permissions, isLoading, error } = usePermissions(publicKey);

    if (isLoading) {
        return <div className="container view"></div>;
    }

    if (error) {
        return (
            <Card className={"container mb-20 w-full h-full flex flex-col justify-center items-center text-center p-4 py-10 bg-card shadow-md"}>
                <h2 className="text-2xl font-bold">{isLoading ? <LucideLoaderCircle className="animate-spin text-foreground/50" /> : <LucideTriangleAlert className="text-amber-500" />}</h2>
                <p className="text-amber-500">{error?.message}</p>
            </Card>
        )
    }

    if (permissions?.includes('pools::overview')) {
        return (
            <main className="container flex flex-col min-h-[100vh]">
                {permissions.includes('swarm::pool::create') && <CreatePool className="mt-10" />}
                {permissions.includes('swarm::shares::transfer') && <TransferSharesCard className="mt-6" />}
                <PoolTable className="mt-6" />
            </main>
        );
    } else if (!isLoading && permissions) {
        redirect('/');
    }



}
