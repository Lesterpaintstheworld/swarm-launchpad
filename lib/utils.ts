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

export function IntlNumberFormat(number: number): string {
	return new Intl.NumberFormat('en-US').format(number);
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

export function calculateCostPerShareWithBondingCurve(supply: number, maxSupply: number = 100000) {
    // Normalize x to be between 0 and 1
    const x = supply / maxSupply;
    // Base formula: P(x) = 1 + 999 * (0.4 * x + 0.6 * x^1.8)
    const basePrice = 1 + 999 * (0.4 * x + 0.6 * Math.pow(x, 1.8));
    
    // Apply the cyclical variation
    const cycle = Math.floor(supply / 5000);
    const position = supply % 5000;
    
    let multiplier;
    if (position <= 1250) {
        multiplier = 1 + (0.30 * position / 1250);
    } else if (position <= 2500) {
        multiplier = 1.30 - (0.30 * (position - 1250) / 1250);
    } else if (position <= 3750) {
        multiplier = 1 - (0.30 * (position - 2500) / 1250);
    } else {
        multiplier = 0.70 + (0.30 * (position - 3750) / 1250);
    }
    
    return basePrice * multiplier;
}