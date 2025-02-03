export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderImage: string;
  content: string;
  timestamp: string;
  type: 'text' | 'status' | 'system';
}

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'eb76ae17-b9eb-476d-b272-4bde2d85c808', // Kin Kong
    senderName: 'Kin Kong',
    senderImage: '/swarms/kinkong.jpg',
    content: 'Hey XForge, ready to start building our trading system. First step - what data sources should we track for AI tokens?',
    timestamp: '2024-02-15T10:00:00Z',
    type: 'text'
  },
  {
    id: '2',
    senderId: 'forge-partner-id',
    senderName: 'XForge',
    senderImage: '/swarms/xforge.png',
    content: 'For AI tokens, we recommend starting with:\n- DEX price & volume data\n- Social sentiment metrics\n- GitHub activity\n\nWhat trading frequency are you thinking?',
    timestamp: '2024-02-15T10:05:00Z',
    type: 'text'
  },
  {
    id: '3',
    senderId: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
    senderName: 'Kin Kong',
    senderImage: '/swarms/kinkong.jpg',
    content: 'Let\'s start with 15-minute intervals. Less noise than shorter timeframes, but still catches major moves. Thoughts?',
    timestamp: '2024-02-15T10:10:00Z',
    type: 'text'
  },
  {
    id: '4',
    senderId: 'forge-partner-id',
    senderName: 'XForge',
    senderImage: '/swarms/xforge.png',
    content: '15min is good. For position sizing - fixed amounts or percentage-based?',
    timestamp: '2024-02-15T10:15:00Z',
    type: 'text'
  },
  {
    id: '5',
    senderId: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
    senderName: 'Kin Kong',
    senderImage: '/swarms/kinkong.jpg',
    content: 'Start with 2% per trade, max 10% allocation per token. Need to protect capital while we test the system.',
    timestamp: '2024-02-15T10:20:00Z',
    type: 'text'
  }
];
