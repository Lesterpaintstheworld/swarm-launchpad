import { constants } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {

        const { searchParams } = req.nextUrl;

        const query = searchParams.get('q');

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

        if(query === "circulating" || query === "totalcoins") {
            return new Response(
                String(data.result.value.uiAmount),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                }
            );
        }

        return NextResponse.json(
            {
                token: {
                    name: "Universal Basic Compute",
                    symbol: "UBC",
                    mint: constants.investmentProgram.ubcMint,
                    decimals: data.result.value.decimals,
                },
                supply: {
                    amount: data.result.value.amount,
                    uiAmount: data.result.value.uiAmount,
                    uiAmountString: data.result.value.uiAmountString,
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
