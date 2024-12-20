'use client'

import Image from "next/image"
import { Link, Links } from "./nav-data"
import css from "./navigation.module.css";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Navigation = () => {
    
    return (
        <nav className={css.navigation__wrapper}>
            <div className={css.navigation__container}>
                <a href="/" className={css.logo__container}><Image src="/brand-assets/logo.jpg" alt="logo" width={30} height={30} /></a>
                {Links.map((link: Link, index: number) => {
                    return (
                        <span className={css.link__container} key={index}>
                            <a
                                href={link.disabled ? undefined : link.url}
                                data-disabled={!!link.disabled}
                                data-active={window.location.pathname.includes(link.url)}
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