import { Token } from '@/components/tokens/tokens.types';
import { useQuery } from '@tanstack/react-query';

interface UseDexScreenerPriceProps {
	tokenMint?: string;
	token?: Token;
}

export function useDexScreenerPrice({ tokenMint, token }: UseDexScreenerPriceProps) {

	return useQuery({
		queryKey: ['dex-screener-price', tokenMint || token?.mint],
		queryFn: async () => {
			const response = await fetch(`https://api.dexscreener.com/token-pairs/v1/solana/${tokenMint || token?.label === 'SOL' ? token?.dexMintRef : token?.mint}`);
			const data = await response.json();
			return data;
		},
		refetchInterval: 1000 * 60 * 5, // 5 minutes
	});
};
