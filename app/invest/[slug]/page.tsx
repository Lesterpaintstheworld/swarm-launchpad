import { SwarmData } from "@/data/swarms/info";
import { redirect } from 'next/navigation';
import { SwarmInvestCard } from "@/components/swarms/invest";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { InfoPanel } from "@/components/ui/infoPanel";
import { Markdown } from "@/components/ui/markdown";
import { Expandable } from "@/components/ui/expandable";
import { SwarmGallery } from "@/components/swarms/gallery";
import { SwarmRecentMarketListings } from "@/components/market/recentListings";
import { ManagePortfolioCard } from "@/components/cards/managePortfolio";

export default function SwarmPage({ params }: { params: { slug: string } }) {
    const swarm = SwarmData.find((s) => s.id === params.slug);
    if (!swarm) {
        redirect('/404');
    }

    return (
        <main className="container mb-6 md:mb-24 view">
            {/* Rest of your original JSX */}
        </main>
    );
}
