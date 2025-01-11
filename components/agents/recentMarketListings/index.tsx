import { Card } from "@/components/ui/card";
import { MarketListing } from "../agent.types";
import { DataTable } from "@/components/ui/datatable";
import { columns } from "./columns";
import { Button } from "@/components/shadcn/button";
import Link from "next/link";
import { LucideArrowRight } from "lucide-react";

interface AgentRecentMarketListingsProps {
    agentId: string;
    listings?: MarketListing[];
    numberOfListings: number;
}

const AgentRecentMarketListings = ({ agentId, listings, numberOfListings }: AgentRecentMarketListingsProps) => {

    return (
        <Card className="w-full flex flex-col mt-6 md:mt-12">
            <h4 className="mb-4 font-foreground font-semibold">Recent market listings</h4>
            <DataTable
                columns={columns}
                data={listings?.slice(0, numberOfListings) || []}
            />
            {listings && listings?.length > 0 &&
                <>
                    <hr />
                    <Button variant='link' className="ml-auto hover:no-underline" asChild>
                        <div className="flex flex-row items-center gap-2 w-fit text-muted mt-4 hover:text-foreground">
                            <Link href={`/market?agentId=${agentId}`}>
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

export { AgentRecentMarketListings }
export type { AgentRecentMarketListingsProps }