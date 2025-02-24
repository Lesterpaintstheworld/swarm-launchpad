'use client';

import Image from "next/image";
import Link from "next/link";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/shadcn/sheet"
import { forwardRef, ReactNode, useState } from "react";
import { ConnectButton } from "@/components/solana/connectButton";
import { Button } from "@/components/shadcn/button";
import { LucideChevronDown, LucideChevronRight, LucideMenu } from "lucide-react";
import { Links } from "@/data/navigation/links";
import { NavigationMenuContentItem, NavigationMenuItemType } from "@/types/navigation";

export function MobileNavigation() {

	const [open, isOpen] = useState<boolean>(false);

	return (
		<nav className="container w-full py-8 flex flex-row items-center justify-between">
			<Sheet open={open} onOpenChange={isOpen}>
				<SheetTrigger asChild>
					<Button><LucideMenu /></Button>
				</SheetTrigger>
				<SheetContent side='left' className="flex flex-col">
					<SheetHeader>
						<SheetTitle className="text-left flex flex-row gap-3 items-center">
							<Link href="/" className="w-fit">
								<Image
									src="/brand-assets/logo.jpg"
									alt="UBC Logo"
									width={30}
									height={30}
									className="rounded-full w-[35px]"
								/>
							</Link>
							Universal Basic Compute
						</SheetTitle>
					</SheetHeader>
					<div className="flex flex-col">
						{Links.map((link: NavigationMenuItemType, index: number) => {
							return (
								<ListItem key={index} item={link} closeModal={() => isOpen(false)} />
							)
						})}
					</div>
					<SheetFooter className="mt-auto">
						<ConnectButton />
					</SheetFooter>
				</SheetContent>
			</Sheet>
			<ConnectButton />
		</nav>
	)

}

interface ListItemProps {
	icon?: ReactNode;
}

const ListItem = forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a"> & { item: NavigationMenuItemType, closeModal: () => void }
>(({ className, item, closeModal }, ref) => {

	const [open, isOpen] = useState<boolean>(false);

	const handleClick = () => {
		if (item.content) {
			isOpen(!open);
			return;
		}
	}

	return (
		<>
			<div
				onClick={handleClick}
				className={`
					${className} 
					flex flex-row cursor-pointer duration-100 p-4 hover:bg-foreground/10 gap-2 items-center border-b last:border-none
				`}
			>
				{item.trigger.isLink ?
					<Link className="flex flex-row items-center gap-2" href={item.trigger?.href || '#'}>{item.trigger?.label}</Link>
					:
					<p>{item.trigger.children}</p>
				}
				{item.content &&
					<div className="ml-auto">
						{open ? <LucideChevronDown width={14} /> : <LucideChevronRight width={14} />}
					</div>
				}
			</div>
			{open &&
				<div className="w-full h-full flex flex-col border-b">
					{item?.content?.map((item: NavigationMenuContentItem, index: number) => {
						return (
							<a
								className="flex flex-row items-center gap-2 p-4 hover:bg-foreground/10"
								href={item.href || '#'}
								key={index}
							>
								{item?.icon && <>{item.icon}</>}
								{item.title}
							</a>
						)
					})}
				</div>
			}
		</>
	)
})
ListItem.displayName = "ListItem"
