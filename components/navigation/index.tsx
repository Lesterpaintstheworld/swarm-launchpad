'use client';

import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "../solana/connectButton";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/shadcn/navigation-menu";
import { cn } from "@/lib/utils";
import { forwardRef, ReactNode } from "react";
import { LucideArrowLeftRight, LucidePieChart, LucideRadar, LucideRoute, LucideUsers, LucideWrench } from "lucide-react";

export function Navigation() {

	return (
		<nav className="container w-full py-8 flex flex-row items-center">
			<Link href="/" className="w-fit">
				<Image
					src="/brand-assets/logo.jpg"
					alt="UBC Logo"
					width={30}
					height={30}
					className="rounded-full w-[35px]"
				/>
			</Link>
			<NavigationMenu className="ml-10 mr-auto">
				<NavigationMenuList className="flex flex-row gap-6">
					<NavigationMenuItem>
						<NavigationMenuTrigger>Invest</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
								<ListItem
									title="Explore Swarms"
									href="/invest"
									icon={<LucideRadar width={16} />}
								>
									Discover partner swarms and invest in your future.
								</ListItem>
								<ListItem
									title="Portfolio"
									href="/invest/portfolio"
									icon={<LucidePieChart width={16} />}
								>
									Manage your AI swarm investments, and track returns
								</ListItem>
								<ListItem
									title="Your Transition"
									href="/invest/transition"
									icon={<LucideRoute width={16} />}
								>
									From worker today to investor tomorrow
								</ListItem>
								<ListItem
									title="Secondary Market"
									href="/marketplace?tab=listings"
									icon={<LucideArrowLeftRight width={16} />}
								>
									Buy and sell shares to other investors in the secondary market.
								</ListItem>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink asChild>
							<Link href="/get-compute" className="text-sm hover:bg-foreground/5 px-3 py-2 rounded-md">
								Get <span className="metallic-text text-sm">$COMPUTE</span>
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Join</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid w-[400px] gap-3 p-4">
								<ListItem
									title="Lead a Swarm"
									href="/lead"
									icon={<LucideWrench width={16} />}
								>
									Create and manage your own AI swarm
								</ListItem>
								<ListItem
									title="Join the DAO"
									href="/dao"
									icon={<LucideUsers width={16} />}
								>
									Participate in governance and shape the future
								</ListItem>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink asChild>
							<Link href="/marketplace-intro" className="text-sm hover:bg-foreground/5 px-3 py-2 rounded-md">
								Marketplace <span className="italic text-muted-foreground">(alpha)</span>
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
			<ConnectButton />
		</nav>
	)

}

interface ListItemProps {
	icon?: ReactNode;
}

const ListItem = forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a"> & ListItemProps
>(({ className, title, icon, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 gap-2 rounded-sm p-3 leading-none no-underline outline-none transition-colors hover:bg-foreground/5 hover:text-accent-foreground focus:bg-foreground/5 focus:text-accent-foreground",
						className
					)}
					{...props}
				>
					<div className="flex flex-row items-center gap-2">
						{icon && icon}
						<p className="text-sm font-medium leading-none">{title}</p>
					</div>
					<p className="line-clamp-2 mt-5 text-sm leading-snug text-muted">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	)
})
ListItem.displayName = "ListItem"
