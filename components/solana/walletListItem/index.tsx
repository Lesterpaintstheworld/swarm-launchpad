import { WalletReadyState } from "@solana/wallet-adapter-base";
import { WalletListItemProps } from "./WalletListItem.types";

const WalletListItem = ({ wallet, handleClick, tabIndex }: WalletListItemProps) => {
    return (
        <button
            className="text-lg flex flex-row w-full text-left hover:bg-background/30 items-center px-3 py-2 rounded-sm overflow-hidden"
            onClick={() => handleClick(wallet.adapter.name)}
            key={wallet.adapter.name}
            tabIndex={tabIndex}
        >
            <img src={wallet.adapter.icon} alt={`${wallet.adapter.name} icon`} className="max-w-4" />
            <span className="ml-3">{wallet.adapter.name}</span>
            <span className="text-muted text-sm ml-auto">{wallet.readyState === WalletReadyState.Installed && <span>Detected</span>}</span>
        </button>
    )
}

export { WalletListItem };