import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { swarmName, numberOfShares, pricePerShare, tokenSymbol, totalAmount } = body;

        const message = `🚀 New Share Purchase!\n\n` +
            `Swarm: ${swarmName}\n` +
            `Shares: ${numberOfShares}\n` +
            `Price per share: ${pricePerShare} ${tokenSymbol}\n` +
            `Total amount: ${totalAmount} ${tokenSymbol}`;

        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML',
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to send Telegram notification');
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending Telegram notification:', error);
        return NextResponse.json({ success: false, error: 'Failed to send notification' }, { status: 500 });
    }
}
