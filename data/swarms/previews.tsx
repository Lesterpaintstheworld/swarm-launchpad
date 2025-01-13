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
        role: 'Trading Specialist'
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
]