'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "../solana/connectButton";
import { Links } from "@/data/navigation/links";
import { stakeMenuItems, buyMenuItems } from "@/data/navigation/menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/shadcn/navigation-menu";
import { cn } from "@/lib/utils";
import { MenuItem } from "./navigation.types";

export function Navigation() {
  const pathname = usePathname();

  const getMenuItems = (type: string): MenuItem[] => {
    switch(type.toLowerCase()) {
      case 'stake':
        return stakeMenuItems;
      case 'buy':
        return buyMenuItems;
      default:
        return [];
    }
  };

  return (
    <div className="flex justify-between items-center w-full py-12 container">
      <Link href="/" className="flex items-center">
        <Image
          src="/brand-assets/logo.jpg"
          alt="UBC Logo"
          width={52}
          height={52}
          className="rounded-full"
        />
      </Link>

      <NavigationMenu className="px-12 justify-start">
        <NavigationMenuList className="gap-8 justify-start">
          {Links.map((link, index) => (
            <NavigationMenuItem key={index}>
              {link.hasDropdown ? (
                <>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-transparent text-base font-normal tracking-wide text-yellow-500/80 hover:text-yellow-500 justify-start metallic-text">
                    <span className="font-bold">{link.label}</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-6">
                      {getMenuItems(link.label).map((item, idx) => (
                        <li key={idx}>
                          <NavigationMenuLink asChild>
                            <a
                              href={item.url}
                              target={item.target}
                              className={cn(
                                "block select-none p-4 no-underline outline-none transition-colors hover:text-accent-foreground text-left",
                                "text-sm font-normal tracking-wide"
                              )}
                            >
                              <div className="text-sm font-normal leading-none">{item.label}</div>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <Link href={link.url} legacyBehavior passHref>
                  <NavigationMenuLink 
                    className={cn(
                      "text-base font-normal tracking-wide px-4 py-2 transition-colors text-left",
                      "hover:text-accent-foreground bg-transparent justify-start",
                      link.highlight && "text-yellow-500",
                      link.disabled && "text-gray-500 pointer-events-none",
                      pathname === link.url && "text-accent-foreground"
                    )}
                  >
                    {link.label === 'Get $COMPUTE' ? (
                      <span className="text-foreground">
                        Get <span className="metallic-text">$COMPUTE</span>
                      </span>
                    ) : (
                      link.label
                    )}
                  </NavigationMenuLink>
                </Link>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <ConnectButton />
    </div>
  );
}
