'use client';

import { Hero } from "@/components/ui/hero";
import { ProcessFlow } from "@/components/ui/processFlow";
import { Returns } from "@/components/ui/returns";
import { SecondaryMarket } from "@/components/ui/secondaryMarket";
import { FAQ } from "@/components/ui/faq";
import { LearnToEarn } from "@/components/ui/learnToEarn";
import { BackgroundBlur } from "@/components/background";

export default function HomePage() {
    return (
        <main>
            <BackgroundBlur />
            <Hero />
            <ProcessFlow />
            <Returns />
            <SecondaryMarket />
            <FAQ />
            <LearnToEarn />
        </main>
    );
}
