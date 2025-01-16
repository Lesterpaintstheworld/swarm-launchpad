import { Token } from "../tokens/tokens.types";

interface MarketListing {
    id: string;
    swarm_id: string;
    number_of_shares: number;
    price_per_share: number;
    seller: string;
    token: Token;
}

export type { MarketListing}