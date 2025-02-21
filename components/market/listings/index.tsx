"use client";

import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/datatable";
import { cn } from "@/lib/utils";
import { columns } from "./columns";
import { Button } from "@/components/shadcn/button";
import { LucideRefreshCcw } from "lucide-react";
import { useLaunchpadProgram } from "@/hooks/useLaunchpadProgram";
import { MarketListing } from "@/types/listing";
import { useQueryClient } from "@tanstack/react-query";

const MarketListings = ({ className }: { className?: string }) => {

	const { allListings } = useLaunchpadProgram();
	const { data, isFetching } = allListings;

	const queryClient = useQueryClient();

	const handleRefresh = () => {
		queryClient.invalidateQueries({ queryKey: ['all-listings'] });
	}

	return (
		<Card className={cn("w-full flex flex-col", className)}>
			<div className="flex flex-row items-center justify-between">
				<h4 className="mb-6">Market Listings</h4>
				<Button disabled={isFetching} onClick={handleRefresh}>
					<LucideRefreshCcw size={16} />
				</Button>
			</div>
			<DataTable
				columns={columns}
				data={isFetching ? [] : data as MarketListing[]}
				searchable
			/>
		</Card>
	);
};

export { MarketListings };
