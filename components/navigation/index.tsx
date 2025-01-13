"use client"

import Image from "next/image"
import { usePathname } from "next/navigation";
import { ConnectButton } from "../solana/connectButton";
import { Links } from "@/data/navigation/links";
import { menuItems } from "@/data/navigation/menu";
import css from "./navigation.module.css";
import { LinkType } from "./navigation.types";
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { useState } from "react";

const Navigation = () => {
    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState(false);

    return (
        <nav className={css.navigation__wrapper}>
            <div className={css.navigation__container}>
                <a href="/" className={css.logo__container}>
                    <Image src="/brand-assets/logo.jpg" alt="logo" width={30} height={30} />
                </a>
                {Links.map((link: LinkType, index: number) => {
                    if (link.hasDropdown) {
                        return (
                            <span 
                                className={css.link__container} 
                                key={index}
                                onMouseEnter={() => setOpenDropdown(true)}
                                onMouseLeave={() => setOpenDropdown(false)}
                            >
                                <DropdownMenu open={openDropdown}>
                                    <DropdownMenuTrigger className={css.link}>
                                        {link.label}
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {menuItems.map((item, idx) => (
                                            <DropdownMenuItem key={idx}>
                                                <a 
                                                    href={item.url} 
                                                    target={item.target}
                                                    className="w-full"
                                                >
                                                    {item.label}
                                                </a>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </span>
                        );
                    }
                    return (
                        <span className={css.link__container} key={index}>
                            <a
                                href={link.disabled ? undefined : link.url}
                                data-disabled={!!link.disabled}
                                data-active={pathname.includes(link.url)}
                                className={css.link}
                                target={link?.target}
                            >
                                {link.label}
                            </a>
                        </span>
                    );
                })}
                <ConnectButton />
            </div>
        </nav>
    )
}

export { Navigation }
