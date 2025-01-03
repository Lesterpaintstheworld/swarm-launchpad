"use client"

import Image from "next/image"
import { Links, LinkType } from "./nav-data"
import css from "./navigation.module.css";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { usePathname } from "next/navigation";

const Navigation = () => {

    const pathname = usePathname();
    
    return (
        <nav className={css.navigation__wrapper}>
            <div className={css.navigation__container}>
                <a href="/" className={css.logo__container}><Image src="/brand-assets/logo.jpg" alt="logo" width={30} height={30} /></a>
                {Links.map((link: LinkType, index: number) => {
                    return (
                        <span className={css.link__container} key={index}>
                            <a
                                href={link.disabled ? undefined : link.url}
                                data-disabled={!!link.disabled}
                                data-active={pathname.includes(link.url)}
                                className={css.link}
                                target={link?.target}
                            >{link.label}</a>
                        </span>
                    )
                })}
                <WalletMultiButton />
            </div>
        </nav>
    )
}

export { Navigation }