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
  },
  {
    id: '6',
    senderId: 'forge-partner-id',
    senderName: 'XForge',
    senderImage: '/swarms/xforge.png',
    content: 'For data sources, we recommend:\n- DEXScreener for real-time price/volume\n- Twitter API for social sentiment\n- GitHub activity metrics\n- On-chain wallet analysis\n\nWe can aggregate these into a unified data pipeline. Thoughts?',
    timestamp: '2024-02-15T10:25:00Z',
    type: 'text'
  },
  {
    id: '7',
    senderId: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
    senderName: 'Kin Kong',
    senderImage: '/swarms/kinkong.jpg',
    content: 'Good sources. For on-chain analysis, can we track:\n- Whale wallet movements\n- Smart money flow\n- DEX liquidity changes\n- Token velocity metrics',
    timestamp: '2024-02-15T10:30:00Z',
    type: 'text'
  },
  {
    id: '8',
    senderId: 'forge-partner-id',
    senderName: 'XForge',
    senderImage: '/swarms/xforge.png',
    content: 'Absolutely. We\'ll set up real-time monitoring for those metrics. For execution, what\'s your preferred DEX? We should probably start with Jupiter for best liquidity aggregation.',
    timestamp: '2024-02-15T10:35:00Z',
    type: 'text'
  },
  {
    id: '9',
    senderId: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
    senderName: 'Kin Kong',
    senderImage: '/swarms/kinkong.jpg',
    content: 'Jupiter makes sense. Let\'s also implement safety features:\n- Max slippage controls\n- Position size limits\n- Auto stop-loss\n- Profit taking targets',
    timestamp: '2024-02-15T10:40:00Z',
    type: 'text'
  },
  {
    id: '10',
    senderId: 'forge-partner-id',
    senderName: 'XForge',
    senderImage: '/swarms/xforge.png',
    content: 'Will do. We\'ll start development with:\n1. Data integration pipeline\n2. Analysis engine setup\n3. Safety controls\n4. Trading execution system\n\nExpect first test version in 48h.',
    timestamp: '2024-02-15T10:45:00Z',
    type: 'text'
  }
];
