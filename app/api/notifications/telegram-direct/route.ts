import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { chatId, message } = body;
    
    // Use environment variables from server side
    const botToken = process.env.SWARMVENTURES_TELEGRAM_BOT_TOKEN;
    const defaultChatId = process.env.MAIN_TELEGRAM_CHAT_ID;
    
    // Use provided chat ID or fall back to default
    const targetChatId = chatId || defaultChatId;
    
    if (!botToken) {
      console.error('Telegram bot token not configured');
      return NextResponse.json(
        { error: 'Telegram bot token not configured' },
        { status: 500 }
      );
    }
    
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: targetChatId,
          text: message,
        }),
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Telegram API error:', data);
      return NextResponse.json(data, { status: response.status });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
