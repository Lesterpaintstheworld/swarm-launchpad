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
import { forwardRef } from "react";
import { WavesLadder } from "lucide-react";

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
					<NavigationMenuTrigger><Link href="/invest">Invest</Link></NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
							<ListItem
								title="Explore Swarms"
								href="/invest"
							>
								Discover partner swarms and invest in your future.
							</ListItem>
							<ListItem
								title="Marketplace"
								href="/invest/marketplace"
							>
								Discover partner swarms and invest in your future.
							</ListItem>
							<ListItem
								title="Portfolio"
								href="/invest/portfolio"
							>
								Manage your AI swarm investments, and track returns
							</ListItem>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Stake UBC</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
							<li className="row-span-3">
								<NavigationMenuLink asChild>
									<a
										className="flex h-full w-full select-none flex-col justify-end transition-colors rounded-sm bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md hover:bg-foreground/5"
										href="https://stake.smithii.io/ubc3"
									>
										<WavesLadder className="h-12 w-12" />
										<div className="mb-2 mt-4 text-lg font-medium">
											365 Day Pool
										</div>
										<p className="text-sm leading-tight text-muted">
											Stake UBC for COMPUTE rewards
										</p>
									</a>
								</NavigationMenuLink>
							</li>
							<ListItem href="https://stake.smithii.io/ubc2" title="165 Day Pool" className="flex flex-row flex-wrap">
								For those looking for a more long term investment. 
							</ListItem>
							<ListItem href="https://stake.smithii.io/ubc" title="90 Day Pool">
								Our most popular pool with over 55M UBC staked. 
							</ListItem>
							<ListItem href="" title="30 Day pool">
								The shortest length pool for the quickest rewards.
							</ListItem>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem asChild>
					<Link href="get-compute">
						<span className="text-foreground">
							Get <span className="metallic-text">$COMPUTE</span>
						</span>
					</Link>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
		<ConnectButton />
    </nav>
  )

}

const ListItem = forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
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
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 mt-5 text-sm leading-snug text-muted">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
