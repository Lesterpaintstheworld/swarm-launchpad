import { constants } from '@/lib/constants';
import { useDexScreenerPrice } from './useDexScreenerPrice';

export function useUBCPrice() {
    return useDexScreenerPrice({ tokenMint: constants.investmentProgram.ubcMint });
};
