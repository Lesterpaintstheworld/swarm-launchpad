import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

interface RedistributionData {
    wallet: string;
    token: 'COMPUTE' | 'UBC';
    amount: number;
    date: string;
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { wallet, token, amount, date } = data as RedistributionData;

        const response = await fetch(
            `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Redistributions`,
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
                                date
                            }
                        }
                    ]
                })
            }
        );

        if (!response.ok) {
            throw new Error('Failed to create redistribution record');
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error creating redistribution record:', error);
        return NextResponse.json(
            { error: 'Failed to create redistribution record' },
            { status: 500 }
        );
    }
}
