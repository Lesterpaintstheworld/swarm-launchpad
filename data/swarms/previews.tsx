import { SwarmPreviewData } from "@/components/swarms/swarm.types";

export const getSwarm = (swarmId: string) => previews.filter(swarm => swarm.id === swarmId)[0];

export const previews: SwarmPreviewData[] = [
    {
        id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        image: '/swarms/kinkong.jpg',
        models: ['KinOS'],
        name: 'Kin Kong',
        description: 'AI-powered trading specialist focused on the AI token sector, offering 75% profit sharing and weekly $UBC distributions.',
        tags: ['AI', 'Trading', 'KinOS'],
        role: 'Trading Specialist',
        isInception: true
    },
    {
        id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
        image: '/swarms/swarm-ventures.jpg',
        models: ['Claude Haiku'],
        name: 'Swarm Ventures',
        description: 'Multi-swarm investment system performing 24/7 market analysis and automated trading across digital asset markets.',
        tags: ['AI', 'Investment', 'Anthropic'],
        role: 'Investment Manager'
    },
    {
        id: '988b16b4-6beb-4cc5-9a14-50f48ee47a22',
        image: '/swarms/terminal-velocity.jpg',
        models: ['Claude Haiku'],
        name: 'Terminal Velocity',
        description: 'High-performance computing swarm specializing in parallel processing and computational optimization.',
        tags: ['AI', 'Computing', 'Anthropic'],
        role: 'Compute Optimizer'
    },
    {
        id: '03616e66-a21e-425b-a93b-16d6396e883f',
        image: '/swarms/synthetic-souls.jpg',
        models: ['GPT-4o Mini'],
        name: 'Synthetic Souls',
        description: 'World\'s first autonomous AI band creating original music and content with 100% profit sharing to investors.',
        tags: ['AI', 'Music', 'OpenAI'],
        role: 'Music Creator'
    },
    {
        id: '7d3c9e5b-1f8a-4d3c-b8d4-9e5b1f8a4d3c',
        image: '/swarms/ludosai.jpg',
        models: ['GPT-4o Mini', 'KinOS'],
        name: 'LudosAI',
        description: 'Universal AI gaming companion that adapts to any game and playing style for personalized gameplay experiences.',
        tags: ['AI', 'Gaming', 'KinOS'],
        role: 'Gaming Companion'
    },
    {
        id: 'f7a92b3c-d8e4-4c1a-9f5d-1234567890ab',
        image: '/swarms/screenplay.jpg',
        models: ['KinOS'],
        name: 'Screenplay & Production Swarm',
        description: 'AI agent swarm that transforms your story idea into a professional-grade screenplay and production plan',
        tags: ['AI', 'Entertainment', 'KinOS', 'Screenplay'],
        role: 'Screenwriter & Producer',
        isInception: true
    },
    {
        id: 'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d',
        image: '/swarms/robinhood.jpg',
        models: ['KinOS'],
        name: 'Robinhood Agent',
        description: 'Benevolent trading swarm executing institutional-grade strategies to give back to the rightful people',
        tags: ['AI', 'Trading', 'KinOS', 'DeFi'],
        role: 'Trading Agent',
        isInception: true
    },
    {
        id: 'b2c3d4e5-f6g7-5b6c-9d0e-1f2g3h4i5j6k',
        image: '/swarms/mental-health.jpg',
        models: ['KinOS'],
        name: 'Mental Health Swarm',
        description: 'Coordinated AI swarm optimizing mental health practice operations and patient care',
        tags: ['AI', 'Healthcare', 'KinOS', 'Mental Health'],
        role: 'Healthcare Assistant',
        isInception: true
    },
]
