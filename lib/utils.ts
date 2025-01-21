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