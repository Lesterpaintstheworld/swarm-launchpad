import { SellPositionCard } from "@/components/cards/sellPosition";
import { MarketListings } from "@/components/market/listings";
import { redirect } from "next/navigation";

export default function Market() {

    redirect('/invest');

    return (
        <main className="container view">
            <SellPositionCard className="mb-6" />
            <MarketListings />
        </main>
    )

}
