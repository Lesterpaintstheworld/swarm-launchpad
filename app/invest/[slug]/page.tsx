import { useCallback } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { InfoPanel } from "@/components/ui/infoPanel";
import { SwarmData } from "@/data/swarms/info";
import { redirect } from "next/navigation";
import { Markdown } from "@/components/ui/markdown";
import { Expandable } from "@/components/ui/expandable";
import { Achievements } from "@/components/swarms/achievements";
import { SwarmInvestCard } from "@/components/swarms/invest";
import { ManagePortfolioCard } from "@/components/cards/managePortfolio";
import { SwarmRecentMarketListings } from "@/components/market/recentListings";
import { supportedTokens } from "@/data/tokens/supported";
import { SwarmGallery } from "@/components/swarms/gallery";

export default function Swarm({ params }: { params: { slug: string } }) {

    const swarm = useCallback(() => SwarmData.find((swarm) => swarm.id === params.slug), [params.slug])() || undefined;

    if (!swarm) {
        redirect('/404');
    }


    return (
        <main className="container mb-6 md:mb-24 view">
            <Breadcrumb
                className="mt-4"
                crumbs={[
                    { label: "Swarms", href: "/invest" },
                    { label: swarm.name }
                ]}
            />
            <h1 className="font-bold mt-2">{swarm.name}</h1>
            <SwarmGallery
                className="mt-16"
                gallery={swarm.gallery}
                swarmName={swarm.name}
            />
            {swarm.achievements && swarm.achievements.length > 0 && (
                <Achievements 
                    achievements={swarm.achievements}
                    className="mt-8 mb-4" 
                />
            )}
            <SwarmInvestCard
                className="mt-16 mb-12"
                data={{
                    totalSupply: 10000,
                    pricePerShare: 0.1,
                    remainingSupply: 4502
                }}
            />
            {swarm.description &&
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <h4 className="font-semibold">About {swarm.name}</h4>
                        <hr className="mt-3" />
                        <Expandable overflowThreshold={750}>
                            <Markdown markdown={swarm.description} />
                        </Expandable>
                    </div>
                    <InfoPanel 
                        socials={swarm.socials}
                        achievements={swarm.achievements}
                    />
                </div>
            }
            <SwarmRecentMarketListings
                swarmId={swarm.id}
                numberOfListings={7}
                listings={[
                    {
                        id: '47b552e3-af9a-42a0-b6f3-88923ec38165',
                        swarm_id: swarm.id,
                        seller: '6LpzxkfTDQfVKfZoquGkkmNqCLj75Ff3wXCBnaJQvP6Q',
                        number_of_shares: 100000,
                        token: supportedTokens[2],
                        price_per_share: 0.1
                    },
                    {
                        id: '1ce3af82-82aa-4ee6-9d35-0eea0672ae2e',
                        swarm_id: swarm.id,
                        seller: 'GzQ6zxC23F38m3retSWbesi6P3asBDy8iYoGozD9Rqts',
                        number_of_shares: 10000,
                        token: supportedTokens[3],
                        price_per_share: 0.5
                    },
                    {
                        id: 'a28bd78f-c25f-4b19-bebc-2d819a60e394',
                        swarm_id: swarm.id,
                        seller: 'Du1cRmGaNJsaHaeuaKfDHArugh3WgZJNuTZ7wUsyrGBy',
                        number_of_shares: 2550,
                        token: supportedTokens[1],
                        price_per_share: 10000
                    },
                    {
                        id: 'e5fe5595-0266-4eb9-ae59-ed2192619574',
                        swarm_id: swarm.id,
                        seller: 'BseSbuXPsCrubogu8SnvZkpyJhKW3HCWyrTYHsjGvqt8',
                        number_of_shares: 12863,
                        token: supportedTokens[4],
                        price_per_share: 580
                    },
                    {
                        id: 'ff5eb981-7dec-4d7f-941b-88729ec34f02',
                        swarm_id: swarm.id,
                        seller: '6LpzxkfTDQfVKfZoquGkkmNqCLj75Ff3wXCBnaJQvP6Q',
                        number_of_shares: 50000,
                        token: supportedTokens[0],
                        price_per_share: 4.2
                    },
                    {
                        id: '67c2df7b-b3c0-428f-8fda-47451544cb96',
                        swarm_id: swarm.id,
                        seller: '2mWk81seRfcQ8NEtrSYm4S3hFqN3TaXXGU7tWvF2Z4cW',
                        number_of_shares: 100000,
                        token: supportedTokens[0],
                        price_per_share: 0.1
                    },
                    {
                        id: '12f3aefc-1642-475c-b484-6a7dbfef006d',
                        swarm_id: swarm.id,
                        seller: 'GzQ6zxC23F38m3retSWbesi6P3asBDy8iYoGozD9Rqts',
                        number_of_shares: 100000,
                        token: supportedTokens[2],
                        price_per_share: 0.1
                    },
                ]}
            />
            <ManagePortfolioCard />
        </main>
    )

}
