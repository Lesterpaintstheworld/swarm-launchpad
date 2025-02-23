import { useDexScreenerPrice } from './useDexScreenerPrice';
import { supportedTokens } from '@/data/tokens/supported';

export function useUSDCPrice() {
    const token = supportedTokens.find(token => token.label === 'USDC');
    return useDexScreenerPrice({ tokenMint: token?.mint as string });
};
