import { constants } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function GET() {
    try {

        const response = await fetch(process.env.HELIUS_RPC_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'getTokenSupply',
                params: [
                    constants.investmentProgram.ubcMint,
                ],
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error('Error fetching token supply:');
        }

        return NextResponse.json(
            {
                token: {
                    name: "Universal Basic Compute",
                    symbol: "UBC",
                    mint: constants.investmentProgram.ubcMint,
                },
                supply: {
                    ...data.result.value
                }
            },
            { status: 200 }
        );

    } catch (e: any) {
        console.error('Error in /api/token-supply/ubc:', e);
        return NextResponse.json(
            { error: 'Could not get supply data.' },
            { status: 500 }
        );
    }
}
