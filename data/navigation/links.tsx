import { NavigationMenuItemType } from "@/types/navigation";
import { LucideArrowLeftRight, LucidePieChart, LucideRadar, LucideRoute, LucideUsers, LucideWrench } from "lucide-react";
import Link from "next/link";

export const Links: NavigationMenuItemType[] = [
    {
        trigger: {
            children: 'Invest'
        },
        grid: {
            columns: 2,
        },
        content: [
            {
                title: 'Explore Swarms',
                href: '/invest',
                icon: <LucideRadar width={16} />,
                subheading: 'Discover partner swarms and invest in your future.'
            },
            {
                title: 'Portfolio',
                href: '/invest/portfolio',
                icon: <LucidePieChart width={16} />,
                subheading: 'Manage your AI swarm investments, and track returns.'
            },
            {
                title: 'Your Transition',
                href: '/invest/transition',
                icon: <LucideRoute width={16} />,
                subheading: 'From worker today to an investor of tomorrow.'
            },
            {
                title: 'Secondary Market',
                href: '/marketplace?tab=p2p',
                icon: <LucideArrowLeftRight width={16} />,
                subheading: 'Buy and sell shares to other investors in the secondary market.'
            },
        ]
    },
    {
        trigger: {
            isLink: true,
            href: '/get-compute',
            label: <>Get <span className="metallic-text text-sm">$COMPUTE</span></>,
            children:
                <Link href="/get-compute" className="text-sm hover:bg-foreground/5 px-3 py-2 rounded-md">
                    Get <span className="metallic-text text-sm">$COMPUTE</span>
                </Link>
        }
    },
    {
        trigger: {
            children: 'Join'
        },
        grid: {
            columns: 2,
        },
        content: [
            {
                title: 'Lead a Swarm',
                href: '/lead',
                icon: <LucideWrench width={16} />,
                subheading: 'Create and manage your own AI swarm.'
            },
            {
                title: 'Join the DAO',
                href: '/dao',
                icon: <LucideUsers width={16} />,
                subheading: 'Participate in governance and shape the future.'
            }
        ]
    },
    {
        trigger: {
            isLink: true,
            href: '/marketplace-intro',
            label: <>Marketplace <span className="italic text-muted-foreground">(alpha)</span></>,
            children:
                <Link href="/marketplace-intro" className="text-sm hover:bg-foreground/5 px-3 py-2 rounded-md">
                    Marketplace <span className="italic text-muted-foreground">(alpha)</span>
                </Link>
        }
    }
]
