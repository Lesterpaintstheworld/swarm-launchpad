interface Token {
    label: string;
    icon?: string;
    mint: string;
    dexMintRef?: string;
    resolution: number;
    decimals: number;
}

export type { Token };