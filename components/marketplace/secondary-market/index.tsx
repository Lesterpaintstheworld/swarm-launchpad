import { CountdownTimer } from "@/app/invest/[id]/CountdownTimer";
import { SellPositionCard } from "@/components/cards/sellPosition";
import { MarketListings } from "@/components/market/listings";
import { UserListings } from "@/components/market/userListings";

const SecondaryMarket = () => {

    const LAUNCH_DATE = new Date('2025-02-24T18:00:00Z');

    if (Date.now() < LAUNCH_DATE.getTime()) {
        return (
            <CountdownTimer
                title="Secondary market will go live @ 18:00 UTC"
                hideDays
                launchDate={LAUNCH_DATE}
            />
        )
    }

    return (
        <>
            <SellPositionCard />
            <UserListings />
            <MarketListings />
        </>
    )

}

export { SecondaryMarket };