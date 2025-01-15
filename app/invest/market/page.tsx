import { SellPositionCard } from "@/components/cards/sellPosition";
import { MarketListings } from "@/components/market/listings";

export default function Market() {

    return (
        <main className="container view">
            <SellPositionCard className="mb-6" />
            <MarketListings />
        </main>
    )

}
