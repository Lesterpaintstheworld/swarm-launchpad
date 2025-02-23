import { useDexScreenerPrice } from './useDexScreenerPrice';
import { supportedTokens } from '@/data/tokens/supported';

export function useUSDTPrice() {
    const token = supportedTokens.find(token => token.label === 'USDT');
    return useDexScreenerPrice({ tokenMint: token?.mint as string });
};
