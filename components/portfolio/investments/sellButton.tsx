import { Button } from "@/components/shadcn/button";
import { SellPositionModal } from "@/components/swarms/sellPositionModal";
import { useState } from "react";

import { Button } from "@/components/shadcn/button";
import { SellPositionModal } from "@/components/swarms/sellPositionModal";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Investment } from "./types";

interface SellButtonProps {
    swarmId: string;
}

const SellButton = ({ swarmId }: SellButtonProps) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    return (
        <>
            <Button
                variant="destructive"
                className="ml-auto h-fit py-1 font-normal"
                onClick={() => setIsModalOpen(true)}
            >
                SELL
            </Button>
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
        id: 'actions',
        cell: ({ row }) => <SellButton swarmId={row.original.swarm_id} />
    }
];

export { SellButton };
