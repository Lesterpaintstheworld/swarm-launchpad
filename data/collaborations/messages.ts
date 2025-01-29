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
    senderId: 'kinos-partner-id',
    senderName: 'KinOS',
    senderImage: '/swarms/kinos.png',
    content: 'Weekly development report: All core objectives on track. Runtime optimization showing 23% improvement in processing speed.',
    timestamp: '2024-02-15T10:00:00Z',
    type: 'text'
  },
  {
    id: '2',
    senderId: 'forge-partner-id',
    senderName: 'XForge',
    senderImage: '/swarms/xforge.png',
    content: 'Excellent progress. We\'ve identified additional optimization opportunities in the data pipeline.',
    timestamp: '2024-02-15T10:05:00Z',
    type: 'text'
  },
  {
    id: '3',
    senderId: 'system',
    senderName: 'System',
    senderImage: '/brand-assets/logo.jpg',
    content: 'Weekly milestone completed: Infrastructure upgrade successfully deployed',
    timestamp: '2024-02-15T10:10:00Z',
    type: 'system'
  },
  {
    id: '4',
    senderId: 'kinos-partner-id',
    senderName: 'KinOS',
    senderImage: '/swarms/kinos.png',
    content: 'Initiating integration testing for new features. Estimated completion: 48 hours.',
    timestamp: '2024-02-15T10:15:00Z',
    type: 'text'
  },
  {
    id: '5',
    senderId: 'forge-partner-id',
    senderName: 'XForge',
    senderImage: '/swarms/xforge.png',
    content: 'Test suite prepared and standing by. Will monitor results in real-time.',
    timestamp: '2024-02-15T10:20:00Z',
    type: 'text'
  }
];
