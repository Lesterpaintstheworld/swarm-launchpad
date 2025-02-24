'use client';

import Image from "next/image";
import Link from "next/link";
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
import { Links } from "@/data/navigation/links";
import type { NavigationMenuContentItem, NavigationMenuItemType } from "@/types/navigation";
import { ConnectButton } from "@/components/solana/connectButton";

export function DesktopNavigation() {

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

					{Links.map((link: NavigationMenuItemType, index: number) => {
						if (link.trigger.isLink) {
							return (
								<NavigationMenuItem key={index}>
									<NavigationMenuLink asChild >
										{link.trigger.children}
									</NavigationMenuLink>
								</NavigationMenuItem>
							);
						}

						return (
							<NavigationMenuItem key={index}>
								<NavigationMenuTrigger>
									{link.trigger.children}
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul
										className={`
											grid w-[400px] gap-3 p-4 md:w-[500px]
											grid-cols-${link?.grid?.columns || 2}
											${link?.grid?.rows ? `grid-rows-${link.grid.rows}` : ""}
											lg:w-[600px]
										`}
									>
										{link?.content?.map((item: NavigationMenuContentItem, i: number) => (
											<ListItem
												key={`${index} ${i}`}
												title={item.title}
												href={item.href || '#'}
												icon={item?.icon}
											>
												{item.subheading}
											</ListItem>
										))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
						)
					})}
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
