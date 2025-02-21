'use client'

import { Card } from "@/components/ui/card";
import { useLaunchpadProgram } from "@/hooks/useLaunchpadProgram";
import { DataTable } from "@/components/ui/datatable";
import { columns } from "./columns";
import { cn } from "@/lib/utils";

const UserListings = ({ className }: { className?: string }) => {

    const { userListings } = useLaunchpadProgram();

    const { data, isLoading } = userListings;

    if (!data || data?.length === 0) {
        return null;
    }

    return (
        <Card className={cn("w-full mb-6", className)}>
            <h4 className="mb-6">Your Listings</h4>
            <DataTable
                columns={columns}
                data={isLoading ? [] : data}
            />
        </Card>
    )

}

export { UserListings };