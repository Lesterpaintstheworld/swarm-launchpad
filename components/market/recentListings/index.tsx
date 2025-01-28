import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/datatable";
import { cn } from "@/lib/utils";
import { columns } from "./columns";
import { Button } from "@/components/shadcn/button";
import Link from "next/link";
import { LucideArrowRight } from "lucide-react";
import { MarketListing } from "../market.types";

interface SwarmRecentMarketListingsProps {
    swarmId: string;
    listings?: MarketListing[];
    numberOfListings: number;
    className?: string;
}

const SwarmRecentMarketListings = ({ swarmId, listings, numberOfListings, className }: SwarmRecentMarketListingsProps) => {

    return (
        <Card className={cn("w-full flex flex-col mt-6 md:mt-12", className)}>
            <h4 className="mb-4 font-foreground font-semibold">P2P Market Listings</h4>
            <DataTable
                columns={columns}
                data={listings?.slice(0, numberOfListings) || []}
            />
            {listings && listings?.length > 0 &&
                <>
                    <hr />
                    <Button variant='link' className="ml-auto hover:no-underline" asChild>
                        <div className="flex flex-row items-center gap-2 w-fit text-muted mt-4 hover:text-foreground">
                            <Link href={`/invest/market?swarmId=${swarmId}`}>
                                View all
                            </Link>
                            <LucideArrowRight />
                        </div>
                    </Button>
                </>
            }
        </Card>
    )

}

export { SwarmRecentMarketListings }
export type { SwarmRecentMarketListingsProps }
