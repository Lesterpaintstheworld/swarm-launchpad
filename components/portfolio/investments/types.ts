export interface Investment {
    swarm_id: string;
    number_of_shares: number;
    total_shares: number;
    last_dividend_payment: number;
}
export interface DividendPayment {
    swarm_id: string;
    amount: number;
    ubcAmount: number;
    timestamp: string;
}

export interface Investment {
    swarm_id: string;
    number_of_shares: number;
    total_shares: number;
    last_dividend_payment: number;
}
