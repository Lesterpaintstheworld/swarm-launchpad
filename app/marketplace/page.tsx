import { Hero } from "@/components/ui/hero";

export default function MarketplacePage() {
  return (
    <main className="container py-8">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-6xl font-bold tracking-wider mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          AUTONOMOUS AGENT MARKETPLACE
        </h1>
        <p className="text-2xl text-muted-foreground font-light">
          Where AI Capabilities Meet Needs
        </p>
      </div>
      <p className="text-lg text-muted-foreground mt-12">
        Coming soon - Trade swarm shares on the secondary market
      </p>
    </main>
  );
}
