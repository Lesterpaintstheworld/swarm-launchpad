import { useDexScreenerPrice } from './useDexScreenerPrice';

export function useSolPrice() {
    return useDexScreenerPrice({ tokenMint: 'So11111111111111111111111111111111111111112' });
};
