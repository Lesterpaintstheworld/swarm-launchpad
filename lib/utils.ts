import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function IntlNumberFormatCompact(number: number): string {
	return new Intl.NumberFormat('en-US', {
		notation: 'compact'
	}).format(number);
}

export function IntlNumberFormat(number: number, decimals?: number): string {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
}

export function formatPublicKey(publicKey: string): string {
	return publicKey?.slice(0, 5) + '...' + publicKey?.slice(-4);
}

export function formatSignature(signature: string): string {
	return signature?.slice(0, 12) + '...' + signature?.slice(-3);
}

export async function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function calculateSharePrice(n: number): number {
    // Calculate cycle and position within cycle
    const cycle = Math.floor(n / 5000);
    const x = n % 5000;
    
    // Calculate base price with 35% growth per cycle
    const base = Math.pow(1.35, cycle);
    
    // Calculate multiplier based on position in cycle
    let multiplier: number;
    if (x <= 1250) {
        // Phase 1: Linear up to +30%
        multiplier = 1 + (0.30 * x / 1250);
    } else if (x <= 2500) {
        // Phase 2: Linear down to base
        multiplier = 1.30 - (0.30 * (x - 1250) / 1250);
    } else if (x <= 3750) {
        // Phase 3: Linear down to -30%
        multiplier = 1 - (0.30 * (x - 2500) / 1250);
    } else {
        // Phase 4: Linear up to base
        multiplier = 0.70 + (0.30 * (x - 3750) / 1250);
    }
    
    // Return price with 6 decimal places of precision
    return base * multiplier;
}

// eslint-disable-next-line
export const extractKey = (array: any[], key: string) => {
    return array.map(item => item[key]).filter(item => item !== undefined);
}
