'use client'

import { Modal } from "@/components/ui/modal";
import { WalletName, WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet, Wallet } from "@solana/wallet-adapter-react";
import { useCallback, useMemo, useState } from "react";
import { WalletListItem } from "../walletListItem";
import { WalletSVG } from "../walletSVG";
import { AnimatePresence, motion } from "motion/react";

const WalletModal = ({ isModalOpen, closeModal }: WalletModalProps) => {

    const { wallets, select } = useWallet();

    const [expanded, setExpanded] = useState(false);

    const [listedWallets, collapsedWallets] = useMemo(() => {
        const installed: Wallet[] = [];
        const notInstalled: Wallet[] = [];

        for (const wallet of wallets) {
            if (wallet.readyState === WalletReadyState.Installed) {
                installed.push(wallet);
            } else {
                notInstalled.push(wallet);
            }
        }

        return installed.length ? [installed, notInstalled] : [notInstalled, []];
    }, [wallets]);

    const handleWalletClick = useCallback(
        (walletName: WalletName) => {
            select(walletName);
            closeModal();
        },
        [select, closeModal]
    );

    const handleClose = useCallback(() => {
        closeModal();
        setExpanded(false);
    }, [closeModal])

    const handleCollapseClick = useCallback(() => setExpanded(!expanded), [expanded]);

    return (
        <Modal isOpen={isModalOpen} onClose={handleClose}>
            {listedWallets.length ? (
                <>
                    <h6 className="text-center w-fit mx-auto my-6">Connect a wallet<br />to continue</h6>
                    <ul className="flex flex-col">
                        {listedWallets.map((wallet) => (
                            <WalletListItem
                                key={wallet.adapter.name}
                                wallet={wallet}
                                tabIndex={expanded ? 0 : -1}
                                handleClick={() => handleWalletClick(wallet.adapter.name)}
                            />
                        ))}
                        <AnimatePresence>
                            {collapsedWallets.length && expanded ? (
                                <motion.div
                                    initial={{
                                        height: 0,
                                        opacity: 0,
                                    }}
                                    animate={{
                                        height: "auto",
                                        opacity: 1,
                                        transition: {
                                            height: { duration: 0.4 },
                                            opacity: {
                                                duration: 0.25,
                                                delay: 0.3,
                                            },
                                        },
                                    }}
                                    exit={{
                                        height: 0,
                                        opacity: 0,
                                        transition: {
                                            height: { duration: 0.4 },
                                            opacity: { duration: 0.1 },
                                        },
                                    }}
                                    className="flex flex-col"
                                >
                                    {collapsedWallets.map((wallet) => (
                                        <WalletListItem
                                            key={wallet.adapter.name}
                                            wallet={wallet}
                                            tabIndex={expanded ? 0 : -1}
                                            handleClick={() => handleWalletClick(wallet.adapter.name)}
                                        />
                                    ))}
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </ul>
                    {collapsedWallets.length ? (
                        <button
                            className="flex flex-row items-center gap-2 ml-auto mt-5 mr-3 mb-3"
                            onClick={handleCollapseClick}
                            tabIndex={0}
                        >
                            <span>{expanded ? 'Less ' : 'More '}options</span>
                            <svg
                                width="13"
                                height="7"
                                viewBox="0 0 13 7"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`${expanded ? 'rotate-180' : ''} fill-foreground`}
                            >
                                <path d="M0.71418 1.626L5.83323 6.26188C5.91574 6.33657 6.0181 6.39652 6.13327 6.43762C6.24844 6.47872 6.37371 6.5 6.50048 6.5C6.62725 6.5 6.75252 6.47872 6.8677 6.43762C6.98287 6.39652 7.08523 6.33657 7.16774 6.26188L12.2868 1.626C12.7753 1.1835 12.3703 0.5 11.6195 0.5H1.37997C0.629216 0.5 0.224175 1.1835 0.71418 1.626Z" />
                            </svg>
                        </button>
                    ) : null}
                </>
            ) : (
                <>
                    <h1 className="wallet-adapter-modal-title">
                        You'll need a wallet on Solana to continue
                    </h1>
                    <div className="wallet-adapter-modal-middle">
                        <WalletSVG />
                    </div>
                    {collapsedWallets.length ? (
                        <>
                            <button
                                className="wallet-adapter-modal-list-more"
                                onClick={handleCollapseClick}
                                tabIndex={0}
                            >
                                <span>{expanded ? 'Hide ' : 'Already have a wallet? View '}options</span>
                                <svg
                                    width="13"
                                    height="7"
                                    viewBox="0 0 13 7"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`${expanded ? 'wallet-adapter-modal-list-more-icon-rotate' : ''
                                        }`}
                                >
                                    <path d="M0.71418 1.626L5.83323 6.26188C5.91574 6.33657 6.0181 6.39652 6.13327 6.43762C6.24844 6.47872 6.37371 6.5 6.50048 6.5C6.62725 6.5 6.75252 6.47872 6.8677 6.43762C6.98287 6.39652 7.08523 6.33657 7.16774 6.26188L12.2868 1.626C12.7753 1.1835 12.3703 0.5 11.6195 0.5H1.37997C0.629216 0.5 0.224175 1.1835 0.71418 1.626Z" />
                                </svg>
                            </button>
                            <AnimatePresence>
                                {expanded &&
                                    <motion.div
                                        initial={{
                                            height: 0,
                                            opacity: 0,
                                        }}
                                        animate={{
                                            height: "auto",
                                            opacity: 1,
                                            transition: {
                                                height: { duration: 0.4 },
                                                opacity: {
                                                    duration: 0.25,
                                                    delay: 0.3,
                                                },
                                            },
                                        }}
                                        exit={{
                                            height: 0,
                                            opacity: 0,
                                            transition: {
                                                height: { duration: 0.4 },
                                                opacity: { duration: 0.1 },
                                            },
                                        }}
                                        className="flex flex-col"
                                    >
                                        {collapsedWallets.map((wallet) => (
                                            <WalletListItem
                                                key={wallet.adapter.name}
                                                wallet={wallet}
                                                tabIndex={expanded ? 0 : -1}
                                                handleClick={() => handleWalletClick(wallet.adapter.name)}
                                            />
                                        ))}
                                    </motion.div>
                                }
                            </AnimatePresence>
                        </>
                    ) : null}
                </>
            )}
        </Modal>
    )
}

export { WalletModal }