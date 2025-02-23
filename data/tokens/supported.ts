import { Token } from "@/components/tokens/tokens.types";

export const supportedTokens: Token[] = [
    {
        label: "$COMPUTE",
        mint: 'B1N1HcMm4RysYz4smsXwmk2UnS8NziqKCM6Ho8i62vXo',
        resolution: 1_000_000,
        decimals: 6
    },
    {
        label: "UBC",
        icon: '/brand-assets/logo.jpg',
        mint: '9psiRdn9cXYVps4F1kFuoNjd2EtmqNJXrCPmRppJpump',
        resolution: 1_000_000,
        decimals: 6
    },
    {
        label: "SOL",
        icon: '/tokens/sol.svg',
        mint: '11111111111111111111111111111111',
        dexMintRef: 'So11111111111111111111111111111111111111112',
        resolution: 1_000_000_000,
        decimals: 9
    },
    {
        label: "USDC",
        icon: '/tokens/usdc.svg',
        mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        resolution: 1_000_000,
        decimals: 6
    },
    {
        label: "USDT",
        icon: '/tokens/usdt.svg',
        mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        resolution: 1_000_000,
        decimals: 6
    },
]