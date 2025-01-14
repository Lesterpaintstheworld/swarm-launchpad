import { useCallback } from "react";
import Image from "next/image";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SwarmData } from "@/data/swarms/info";
import { redirect } from "next/navigation";

import { SwarmGalleryItem } from "@/components/swarms/swarm.types";
import { Markdown } from "@/components/ui/markdown";
import { Expandable } from "@/components/ui/expandable";
import { InfiniteCarousel, Slides } from "@/components/ui/infiniteCarousel";
import { SwarmInvestCard } from "@/components/swarms/invest";
import { SwarmRecentMarketListings } from "@/components/swarms/recentMarketListings";
import { ManagePortfolioCard } from "@/components/cards/managePortfolio";

export default function Swarm({ params }: { params: { slug: string } }) {

    const swarm = useCallback(() => SwarmData.find((swarm) => swarm.id === params.slug), [params.slug])() || undefined;

    if (!swarm) {
        redirect('/404');
    }

    const prepareSlides = useCallback(() => {
        return swarm.gallery.map((item: SwarmGalleryItem, index: number) => {
            let content;
            if (item.type === 'image') {
                content = <Image src={item.content as string} alt={`${swarm.name} carousel item ${index}`} width={1048} height={600} className="w-full object-cover" />
            } else if (item.type === 'video') {
                content = <video autoPlay={index === 1} controls muted={index === 1}><source src={item.content as string} type="video/mp4" className="h-full" /></video>
            } else {
                content = item.content;
            }
            return { id: index, content };
        }) as Slides;
    }, [swarm])

    return (
        <main className="container mb-6 md:mb-24">
            <Breadcrumb
                className="mt-4"
                crumbs={[
                    { label: "Swarms", href: "/invest" },
                    { label: swarm.name }
                ]}
            />
            <h1 className="font-bold mt-2">{swarm.name}</h1>
            <InfiniteCarousel
                className="mt-16"
                slides={prepareSlides()}
            />
            <SwarmInvestCard
                className="mt-16 mb-12"
                data={{
                    totalSupply: 10000,
                    pricePerShare: 0.1,
                    remainingSupply: 4502
                }}
            />
            {swarm.description &&
                <>
                    <h4 className="font-semibold">About {swarm.name}</h4>
                    <hr className="mt-3" />
                    <Expandable overflowThreshold={750}>
                        <Markdown markdown={swarm.description} />
                    </Expandable>
                </>
            }
            <SwarmRecentMarketListings
                swarmId={swarm.id}
                numberOfListings={7}
                listings={[
                    {
                        id: '47b552e3-af9a-42a0-b6f3-88923ec38165',
                        seller: '6LpzxkfTDQfVKfZoquGkkmNqCLj75Ff3wXCBnaJQvP6Q',
                        number_of_shares: 100000,
                        token: 'SOL',
                        price_per_share: 0.1
                    },
                    {
                        id: '1ce3af82-82aa-4ee6-9d35-0eea0672ae2e',
                        seller: 'GzQ6zxC23F38m3retSWbesi6P3asBDy8iYoGozD9Rqts',
                        number_of_shares: 10000,
                        token: 'USDC',
                        price_per_share: 0.5
                    },
                    {
                        id: 'a28bd78f-c25f-4b19-bebc-2d819a60e394',
                        seller: 'Du1cRmGaNJsaHaeuaKfDHArugh3WgZJNuTZ7wUsyrGBy',
                        number_of_shares: 2550,
                        token: '$COMPUTE',
                        price_per_share: 10000
                    },
                    {
                        id: 'e5fe5595-0266-4eb9-ae59-ed2192619574',
                        seller: 'BseSbuXPsCrubogu8SnvZkpyJhKW3HCWyrTYHsjGvqt8',
                        number_of_shares: 12863,
                        token: '$UBC',
                        price_per_share: 580
                    },
                    {
                        id: 'ff5eb981-7dec-4d7f-941b-88729ec34f02',
                        seller: '6LpzxkfTDQfVKfZoquGkkmNqCLj75Ff3wXCBnaJQvP6Q',
                        number_of_shares: 50000,
                        token: 'USDC',
                        price_per_share: 4.2
                    },
                    {
                        id: '67c2df7b-b3c0-428f-8fda-47451544cb96',
                        seller: '2mWk81seRfcQ8NEtrSYm4S3hFqN3TaXXGU7tWvF2Z4cW',
                        number_of_shares: 100000,
                        token: 'SOL',
                        price_per_share: 0.1
                    },
                    {
                        id: '12f3aefc-1642-475c-b484-6a7dbfef006d',
                        seller: 'GzQ6zxC23F38m3retSWbesi6P3asBDy8iYoGozD9Rqts',
                        number_of_shares: 100000,
                        token: 'SOL',
                        price_per_share: 0.1
                    },
                ]}
            />
            <ManagePortfolioCard />
        </main>
    )

}
