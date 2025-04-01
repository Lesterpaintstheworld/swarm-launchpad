import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET(
    request: Request,
    { params }: { params: { wallet: string } }
) {
    try {
        const response = await fetch(
            `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/access?filterByFormula={wallet}="${params.wallet}"`,
            {
                headers: {
                    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                },
                cache: 'no-store'
            }
        );

        
        if (!response.ok) {
            throw new Error('Failed to fetch services');
        }
        
        const data = await response.json();

        const permissions = data?.records[0]?.fields.permissions ?? '';

        return NextResponse.json(permissions.split(','), { status: 200 });

    } catch (error) {
        console.error('Error checking permissons:', error);
        return NextResponse.json(
            { error: 'Failed to check permissions' },
            { status: 500 }
        );
    }
}
