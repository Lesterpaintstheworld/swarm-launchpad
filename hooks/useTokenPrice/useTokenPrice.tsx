import { useComputePrice } from "./useComputePrice";
import { useSolPrice } from "./useSolPrice";
import { useUBCPrice } from "./useUBCPrice";
import { useUSDCPrice } from "./useUSDCPrice";
import { useUSDTPrice } from "./useUSDTPrice";

export function useTokenPrice() {

    const ubc = useUBCPrice();
    const compute = useComputePrice();
    const usdc = useUSDCPrice();
    const usdt = useUSDTPrice();
    const sol = useSolPrice();

    return {
        ubc,
        compute,
        usdc,
        usdt,
        sol,
    }
}