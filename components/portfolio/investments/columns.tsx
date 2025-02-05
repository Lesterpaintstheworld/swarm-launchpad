'use client'

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/datatable/columnHeader";
import { Investment } from "@/components/portfolio/investments";
import Image from "next/image";
import { IntlNumberFormat } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLaunchpadProgramAccount } from "@/hooks/useLaunchpadProgram";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { SellPositionModal } from "@/components/swarms/sellPositionModal";

interface SwarmData {
    id: string;
    name: string;
    image: string;
    pool?: string;
    role?: string;
}

const PriceCell = ({ swarmId }: { swarmId: string }) => {
    const [swarm, setSwarm] = useState<SwarmData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { poolAccount } = useLaunchpadProgramAccount({ 
        poolAddress: swarm?.pool || '' 
    });
    const [price, setPrice] = useState<number>(0);

    useEffect(() => {
        async function fetchSwarm() {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/swarms/${swarmId}`);
                if (!response.ok) return;
                const data = await response.json();
                setSwarm(data);
            } catch (error) {
                console.error('Error fetching swarm:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSwarm();
    }, [swarmId]);

    useEffect(() => {
        if (!swarm?.pool || !poolAccount?.data) {
            return;
        }

        try {
            const totalShares = poolAccount.data.totalShares.toNumber();
            const availableShares = poolAccount.data.availableShares.toNumber();
            const soldShares = totalShares - availableShares;
            
            const cycle = Math.floor(soldShares / 5000);
            const base = Math.pow(1.35, cycle);
            const sharePrice = Math.floor(base * 100) / 100;
            
            setPrice(sharePrice);
        } catch (error) {
            console.error('Error calculating price:', error);
        }
    }, [poolAccount?.data, swarm?.pool]);

    if (isLoading) {
        return <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />;
    }

    return (
        <p className="font-bold">
            {IntlNumberFormat(price)} $COMPUTE
        </p>
    );
};


const PriceAndValueCell = ({ swarmId, shares }: { swarmId: string; shares?: number }) => {
    const [swarm, setSwarm] = useState<SwarmData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { poolAccount } = useLaunchpadProgramAccount({ 
        poolAddress: swarm?.pool || '' 
    });
    const [value, setValue] = useState<number>(0);

    useEffect(() => {
        async function fetchSwarm() {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/swarms/${swarmId}`);
                if (!response.ok) return;
                const data = await response.json();
                setSwarm(data);
            } catch (error) {
                console.error('Error fetching swarm:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSwarm();
    }, [swarmId]);

    useEffect(() => {
        try {
            if (poolAccount?.data && shares) {
                const totalShares = poolAccount.data.totalShares.toNumber();
                const availableShares = poolAccount.data.availableShares.toNumber();
                const soldShares = totalShares - availableShares;
                
                const cycle = Math.floor(soldShares / 5000);
                const base = Math.pow(1.35, cycle);
                const sharePrice = Math.floor(base * 100) / 100;

                setValue(shares * sharePrice);
            }
        } catch (error) {
            console.error('Error calculating value:', error);
            setValue(0);
        }
    }, [poolAccount?.data, shares]);

    if (isLoading) {
        return <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />;
    }

    return (
        <div className="flex items-center gap-2">
            <p className="font-bold text-green-400">
                {IntlNumberFormat(value)} $COMPUTE
            </p>
        </div>
    );
};

const ActionCell = ({ swarmId }: { swarmId: string }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                        className="text-red-500"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Sell
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <SellPositionModal
                swarmId={swarmId}
                isModalOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
            />
        </>
    );
};

const SwarmCell = ({ swarmId }: { swarmId: string }) => {
    const [swarm, setSwarm] = useState<{ name: string; image: string; role?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchSwarm() {
            try {
                const response = await fetch(`/api/swarms/${swarmId}`);
                if (!response.ok) return;
                const data = await response.json();
                setSwarm(data);
            } catch (error) {
                console.error('Error fetching swarm:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSwarm();
    }, [swarmId]);

    if (isLoading || !swarm) {
        return (
            <div className="flex items-center min-w-[200px] gap-4 py-1">
                <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                <div className="flex flex-col gap-2">
                    <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                    <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center min-w-[200px] gap-4 py-1">
            <Image
                src={swarm.image}
                alt={`${swarm.name} avatar`}
                width={32}
                height={32}
                className="rounded-full"
            />
            <div className="flex flex-col">
                <Link className="text-lg mb-0 leading-1 truncate hover:underline" href={`/invest/${swarmId}`}>
                    {swarm.name}
                </Link>
                {swarm.role && <p className="text-sm text-muted truncate">{swarm.role}</p>}
            </div>
        </div>
    );
};

export const columns: ColumnDef<Investment>[] = [
    {
        accessorKey: 'swarm_id',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Swarm" />
        ),
        minSize: 200,
        cell: ({ row }) => <SwarmCell swarmId={row.getValue('swarm_id')} />
    },
    {
        accessorKey: 'number_of_shares',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Shares Owned" />
        ),
        cell: ({ row }) => (
            <p className="font-bold">{IntlNumberFormat(row.getValue('number_of_shares'))}</p>
        )
    },
    {
        accessorKey: 'ownership_percentage',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Ownership %" />
        ),
        cell: ({ row }) => {
            const percentage = (Number(row.original.number_of_shares) / Number(row.original.total_shares) * 100);
            
            let tierEmoji = '';
            let tierName = '';
            
            // Whale Tiers
            if (percentage > 5) {
                tierEmoji = '🐋';
                tierName = 'Mega Whale';
            } else if (percentage > 1) {
                tierEmoji = '🐳';
                tierName = 'Whale';
            } else if (percentage > 0.5) {
                tierEmoji = '🐋';
                tierName = 'Mini Whale';
            }
            // Mid Tiers
            else if (percentage > 0.1) {
                tierEmoji = '🐬';
                tierName = 'Dolphin';
            } else if (percentage > 0.01) {
                tierEmoji = '🐠';
                tierName = 'Fish';
            }
            // Small Tiers
            else {
                tierEmoji = '🦐';
                tierName = 'Shrimp';
            }

            return (
                <div className="flex flex-col">
                    <p className="text-muted">{percentage.toFixed(2)}%</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>{tierEmoji}</span>
                        <span>{tierName}</span>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: 'price_per_share',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Price per Share" />
        ),
        cell: ({ row }) => <PriceCell swarmId={row.getValue('swarm_id')} />
    },
    {
        accessorKey: 'value',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Value" />
        ),
        cell: ({ row }) => (
          <PriceAndValueCell 
            swarmId={row.getValue('swarm_id')} 
            shares={row.original.number_of_shares} 
          />
        )
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionCell swarmId={row.original.swarm_id} />
    }
];
