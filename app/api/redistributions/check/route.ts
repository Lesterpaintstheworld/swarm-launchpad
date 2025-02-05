import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export async function GET(request: Request) {
    try {
        if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
            console.error('Missing Airtable configuration');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Get query parameters
        const url = new URL(request.url);
        const wallet = url.searchParams.get('wallet');
        const swarmId = url.searchParams.get('swarmId');
        const date = url.searchParams.get('date');

        if (!wallet || !swarmId || !date) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // Create the filter formula for Airtable
        // This checks if there's any record for this wallet and swarm from the given date
        const filterByFormula = encodeURIComponent(
            `AND(
                {wallet}="${wallet}",
                {swarmId}="${swarmId}",
                IS_AFTER({date}, DATETIME_PARSE("${date}"))
            )`
        );

        const response = await fetch(
            `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Redistributions?filterByFormula=${filterByFormula}`,
            {
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to check redistributions');
        }

        const data = await response.json();
        
        // Return whether any matching records exist
        return NextResponse.json({
            exists: data.records.length > 0
        });

    } catch (error) {
        console.error('Error checking redistributions:', error);
        return NextResponse.json(
            { error: 'Failed to check redistributions' },
            { status: 500 }
        );
    }
}
