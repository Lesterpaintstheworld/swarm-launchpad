import { Button } from "@/components/shadcn/button";
import { SellPositionModal } from "@/components/swarms/sellPositionModal";
import { useState } from "react";
import { useWallet } from '@solana/wallet-adapter-react';
import { getSwarm } from "@/data/swarms/previews";
import { toast } from 'sonner';

const SellButton = ({ swarmId }: { swarmId: string }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    return (
        <>
            <div className="w-full flex my-2 min-w-[100px]">
                <Button
                    variant='destructive'
                    className="ml-auto h-fit py-1 font-normal"
                    onClick={() => setIsModalOpen(true)}
                >
                    SELL
                </Button>
            </div>
            <SellPositionModal
                swarmId={swarmId}
                isModalOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
            />
        </>
    );
};

export { SellButton }
