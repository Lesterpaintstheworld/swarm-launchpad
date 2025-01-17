import { Hero } from "@/components/ui/hero";
import { ProcessFlow } from "@/components/ui/processFlow";
import { Returns } from "@/components/ui/returns";
import { SecondaryMarket } from "@/components/ui/secondaryMarket";
import { FAQ } from "@/components/ui/faq";

export default function HowItWorksPage() {
    return (
        <main>
            <Hero />
            <ProcessFlow />
            <Returns />
            <SecondaryMarket />
            <FAQ />
        </main>
    );
}
