import { constants } from '@/lib/constants';
import { useDexScreenerPrice } from './useDexScreenerPrice';

export function useComputePrice() {
    return useDexScreenerPrice({ tokenMint: constants.investmentProgram.computeMint });
};
