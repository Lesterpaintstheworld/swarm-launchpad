'use client'

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/datatable/columnHeader";
import { Investment } from "@/components/portfolio/investments";
import Image from "next/image";
import { IntlNumberFormat } from "@/lib/utils";
async function getSwarm(id: string) {
  try {
    const response = await fetch(`/api/swarms/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching swarm:', error);
    return null;
  }
}
async function getSwarm(id: string) {
  try {
    const response = await fetch(`/api/swarms/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching swarm:', error);
    return null;
  }
}
async function getSwarm(id: string) {
  try {
    const response = await fetch(`/api/swarms/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching swarm:', error);
    return null;
  }
}
import Link from "next/link";
import { useLaunchpadProgramAccount } from "@/hooks/useLaunchpadProgram";
import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { SellPositionModal } from "@/components/swarms/sellPositionModal";

const PriceCell = ({ poolAddress }: { poolAddress: string }) => {
    const { poolAccount } = useLaunchpadProgramAccount({ poolAddress });
    const [price, setPrice] = useState<number>(0);

    useEffect(() => {
        try {
            if (poolAccount?.data) {
                const totalShares = poolAccount.data.totalShares.toNumber();
                const availableShares = poolAccount.data.availableShares.toNumber();
                const soldShares = totalShares - availableShares;
                
                const cycle = Math.floor(soldShares / 5000);
                const base = Math.pow(1.35, cycle);
                const sharePrice = Math.floor(base * 100) / 100;
                
                setPrice(sharePrice);
            }
        } catch (error) {
            console.error('Error calculating price:', error);
            setPrice(0);
        }
    }, [poolAccount?.data]);

    return (
        <p className="font-bold">
            {IntlNumberFormat(price)} $COMPUTE
        </p>
    );
};


const ValueCell = ({ poolAddress, shares }: { poolAddress: string, shares: number }) => {
    const { poolAccount } = useLaunchpadProgramAccount({ poolAddress });
    const [value, setValue] = useState<number>(0);

    useEffect(() => {
        try {
            if (poolAccount?.data) {
                const totalShares = poolAccount.data.totalShares.toNumber();
                const availableShares = poolAccount.data.availableShares.toNumber();
                const soldShares = totalShares - availableShares;
                
                // Calculate price based on bonding curve
                const cycle = Math.floor(soldShares / 5000);
                const base = Math.pow(1.35, cycle);
                const sharePrice = Math.floor(base * 100) / 100; // Divide by 100 to fix scaling

                console.log('ValueCell data:', {
                    totalShares,
                    availableShares,
                    soldShares,
                    sharePrice,
                    shares,
                    calculatedValue: shares * sharePrice
                });

                setValue(shares * sharePrice);
            }
        } catch (error) {
            console.error('Error calculating value:', error);
            setValue(0);
        }
    }, [poolAccount.data, shares]);

    return (
        <p className="font-bold text-green-400">
            {IntlNumberFormat(value)} $COMPUTE
        </p>
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

export const columns: ColumnDef<Investment>[] = [
    {
        accessorKey: 'swarm_id',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Swarm" />
        ),
        minSize: 200,
        cell: ({ row }) => {
            const swarm = getSwarm(row.getValue('swarm_id'));
            return (
                <div className="flex items-center min-w-[200px] gap-4 py-1">
                    <Image
                        src={swarm?.image}
                        alt={`${swarm?.name} avatar`}
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                    <div className="flex flex-col">
                        <Link className="text-lg mb-0 leading-1 truncate hover:underline" href={`/invest/${swarm.id}`}>{swarm?.name}</Link>
                        {swarm?.role && <p className="text-sm text-muted truncate">{swarm?.role}</p>}
                    </div>
                </div>
            )
        }
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
        cell: ({ row }) => {
            const swarm = getSwarmUsingId(row.getValue('swarm_id'));
            console.log('Swarm data:', {
                swarmId: row.getValue('swarm_id'),
                swarm,
                pool: swarm?.pool
            });
            if (!swarm?.pool) return null;
            return <PriceCell poolAddress={swarm.pool} />;
        }
    },
    {
        accessorKey: 'value',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Value" />
        ),
        cell: ({ row }) => {
            const swarm = getSwarmUsingId(row.getValue('swarm_id'));
            if (!swarm?.pool) return null;
            return <ValueCell poolAddress={swarm.pool} shares={row.original.number_of_shares} />;
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionCell swarmId={row.original.swarm_id} />
    }
];
