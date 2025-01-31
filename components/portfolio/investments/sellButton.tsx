import { Button } from "@/components/shadcn/button";
import { SellPositionModal } from "@/components/swarms/sellPositionModal";
import { useState } from "react";

const ClaimButton = ({ row }: { row: any }) => {
    const { publicKey } = useWallet();
    const computeAmount = row.getValue('amount') as number;
    const ubcAmount = row.original.ubcAmount;
    const swarmId = row.getValue('swarm_id') as string;
    const swarm = getSwarm(swarmId);
    const isDisabled = computeAmount < 10;

    // Generate a unique key for this week's claim
    const getWeekKey = () => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Get Sunday
        return startOfWeek.toISOString().split('T')[0];
    };
    
    const claimKey = `claimed_${swarmId}_${publicKey?.toString()}_week_${getWeekKey()}`;
    
    // Check if already claimed this week
    const [isClaimed, setIsClaimed] = useState(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem(claimKey) === 'true';
        }
        return false;
    });

    const handleClaim = async () => {
        if (!publicKey) return;

        const message = `New Dividend Claim:\n\n` +
            `Wallet: ${publicKey.toString()}\n` +
            `Swarm: ${swarm?.name}\n` +
            `Amount: ${computeAmount.toLocaleString()} $COMPUTE\n` +
            `UBC Amount: ${ubcAmount.toLocaleString()} $UBC\n` +
            `Week: ${getWeekKey()}`;

        try {
            await fetch(`https://api.telegram.org/bot7728404959:AAHoVX05vxCQgzxqAJa5Em8i5HCLs2hJleo/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: -4680349356,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

            // Show success message with details
            toast.success(
                <div className="relative transform transition-all">
                    {/* Background glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-pink-500/20 blur-xl animate-pulse" />
                    
                    {/* Content */}
                    <div className="relative p-4 space-y-4">
                        {/* Success Icon */}
                        <div className="flex justify-center">
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                <svg 
                                    className="w-6 h-6 text-green-400 animate-[bounce_1s_ease-in-out_1]" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M5 13l4 4L19 7" 
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-white mb-1">
                                Claim Registered Successfully!
                            </h3>
                            <p className="text-white/60 text-sm">
                                for {swarm?.name}
                            </p>
                        </div>

                        {/* Amount Details */}
                        <div className="bg-white/5 rounded-lg p-3 space-y-2 backdrop-blur-sm border border-white/10">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white/60">$COMPUTE</span>
                                <span className="font-semibold text-green-400">
                                    {computeAmount.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white/60">$UBC</span>
                                <span className="font-semibold text-yellow-400">
                                    {ubcAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Transfer Notice */}
                        <div className="flex items-center gap-2 text-center justify-center text-sm text-white/60 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                            <svg 
                                className="w-4 h-4 text-blue-400 animate-pulse" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                            <span>Transfer will arrive within 24 hours</span>
                        </div>
                    </div>
                </div>,
                {
                    duration: 8000,
                    className: "transform-gpu",
                    position: "top-center",
                    style: {
                        background: "rgba(0, 0, 0, 0.8)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "1rem",
                        padding: "1rem",
                        minWidth: "380px",
                        animation: "custom-bounce 0.5s ease-out"
                    }
                }
            );

            // Store in session storage with weekly key
            sessionStorage.setItem(claimKey, 'true');
            
            // Update state
            setIsClaimed(true);

        } catch (error) {
            console.error('Error sending claim notification:', error);
            toast.error('Error submitting claim');
        }
    };
    
    return (
        <div className="w-full flex justify-end">
            <Button 
                variant="secondary" 
                size="sm"
                className="bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 hover:text-violet-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleClaim}
                disabled={isDisabled || isClaimed}
                title={
                    isDisabled ? "Minimum 10 $COMPUTE required to claim" : 
                    isClaimed ? "Already claimed this week" : 
                    undefined
                }
            >
                {isDisabled ? "Below Minimum" : 
                 isClaimed ? "Claimed" : 
                 "Claim"}
            </Button>
        </div>
    );
};

export const columns: ColumnDef<DividendPayment>[] = [
    {
        accessorKey: 'swarm_id',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Swarm" />
        ),
        minSize: 250,
        cell: ({ row }) => {
            // Get swarm ID from the row
            const swarmId = row.getValue('swarm_id') as string;
            console.log('Looking up swarm with ID:', swarmId); // Debug log
            
            // Look up the swarm using the correct ID
            const swarm = getSwarm(swarmId);
            console.log('Found swarm:', swarm); // Debug log
            
            if (!swarm) {
                console.error('Swarm not found for ID:', swarmId);
                return (
                    <div className="flex items-center min-w-[200px] gap-4 py-1">
                        <div className="w-8 h-8 rounded-full bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-lg mb-0 leading-1 truncate text-white/60">
                                Unknown Swarm
                            </span>
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
                        <Link 
                            className="text-lg mb-0 leading-1 truncate hover:underline" 
                            href={`/invest/${swarm.id}`}
                        >
                            {swarm.name}
                        </Link>
                        {swarm.role && (
                            <p className="text-sm text-muted truncate">
                                {swarm.role}
                            </p>
                        )}
                    </div>
                </div>
            );
        }
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => (
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="font-bold">{IntlNumberFormat(row.getValue('amount'))}</span>
                    <span className="metallic-text">$COMPUTE</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-bold">{IntlNumberFormat(row.original.ubcAmount || 0)}</span>
                    <span className="metallic-text-ubc">$UBC</span>
                </div>
            </div>
        )
    },
    {
        accessorKey: 'timestamp',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ row }) => (
            <p className="text-muted whitespace-nowrap">30/01/2025</p>
        )
    },
    {
        id: 'actions',
        header: () => null,
        cell: ({ row }) => <ClaimButton row={row} />
    }
];
