import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

interface RedistributionData {
    wallet: string;
    token: 'COMPUTE' | 'UBC';
    amount: number;
    date: string;
    swarmId: string;
}

export async function POST(req: Request) {
    try {
        // Log environment variables (redacted for security)
        console.log('Environment check:', {
            hasApiKey: !!AIRTABLE_API_KEY,
            hasBaseId: !!AIRTABLE_BASE_ID
        });

        if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
            console.error('Missing Airtable configuration');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const data = await req.json();
        
        // Add validation logging
        console.log('Received redistribution data:', {
            ...data,
            wallet: data.wallet ? `${data.wallet.slice(0, 6)}...` : undefined
        });

        // Validate required fields
        if (!data.wallet || !data.token || !data.amount || !data.date || !data.swarmId) {
            console.error('Missing required fields:', {
                hasWallet: !!data.wallet,
                hasToken: !!data.token,
                hasAmount: !!data.amount,
                hasDate: !!data.date,
                hasSwarmId: !!data.swarmId
            });
            return NextResponse.json(
                { error: 'Missing required fields', details: 'All fields are required' },
                { status: 400 }
            );
        }

        const { wallet, token, amount, date, swarmId } = data as RedistributionData;

        // Construct Airtable URL
        const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Redistributions`;
        console.log('Airtable URL:', airtableUrl);

        const airtableResponse = await fetch(
            airtableUrl,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    records: [
                        {
                            fields: {
                                wallet,
                                token,
                                amount,
                                date,
                                swarmId
                            }
                        }
                    ]
                })
            }
        );

        if (!airtableResponse.ok) {
            const errorText = await airtableResponse.text();
            console.error('Airtable error:', {
                status: airtableResponse.status,
                statusText: airtableResponse.statusText,
                error: errorText
            });
            throw new Error(`Airtable response not OK: ${errorText}`);
        }

        const result = await airtableResponse.json();
        console.log('Airtable success response:', result);

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error('Detailed error creating redistribution record:', {
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack
            } : error
        });
        return NextResponse.json(
            { error: 'Failed to create redistribution record', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
