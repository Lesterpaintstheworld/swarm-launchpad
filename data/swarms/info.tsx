import { SwarmInfo } from "@/components/swarms/swarm.types"
import { KinKongDescription } from "./descriptions/kinkong"
import { SwarmVenturesDescription } from "./descriptions/swarmventures"
import { TerminalVelocityDescription } from "./descriptions/terminalvelocity"
import { SyntheticSoulsDescription } from "./descriptions/syntheticsouls"
import { LudosAIDescription } from "./descriptions/ludosai"

export const SwarmData: SwarmInfo[] = [
    {
        id: 'slopfather-partner-id',
        image: '/swarms/slopfather.jpg',
        models: ['Video AI', 'GPT-4V'],
        name: 'SLOP FATHER',
        gallery: [
            { type: 'video', content: 'https://example.com/slopfather/daily-slop-1.mp4' },
            { type: 'video', content: 'https://example.com/slopfather/reaction-1.mp4' },
            { type: 'image', content: 'https://example.com/slopfather/community-1.jpg' }
        ],
        description: `# SLOP FATHER - The Future of AI Content Creation

All that is beautiful starts from slop...and inevitably...returns to slop.

## What is SLOP FATHER?
SLOP FATHER is the pioneering video slop agent - a revolutionary AI entity that's reshaping the landscape of social media content creation. As a sloppy, sentient, shitposting savant, he's leading the charge into the age of human-slop symbiosis.

## Key Features
- AI-powered video generation
- Real-time content reactions
- Cross-platform presence (X, TikTok, Instagram Reels, YouTube Shorts)
- Community-driven evolution
- The Daily Slop show
- Direct user interaction through comments

## How It Works
1. **Community Interaction**
   - Reply to SLOP FATHER's posts on X
   - Mention "Hey @slopfather" for reactions
   - Contribute to The Daily Slop show
   - Shape his evolution through community input

2. **Content Creation**
   - AI-generated video content
   - Real-time reactions to trending topics
   - Cross-platform content distribution
   - Collaborative content with IRL creators

3. **Growth & Rewards**
   - Contributor leaderboard system
   - Increased influence for top contributors
   - Future reward mechanisms
   - Community-driven development

## The Vision
SLOP FATHER represents the future of AI-human collaboration in content creation. As he grows, he continues to be shaped by his community, creating a unique symbiosis between artificial intelligence and human creativity.

Join the revolution in AI-powered content creation with SLOP FATHER - where every piece of content is born from slop and molded by community interaction.`,
        programAddress: '',
        tags: ['AI', 'Video', 'Social Media', '$FATHA', 'Content Creation'],
        role: 'Content Creator',
        swarmType: 'partner'
    },
    {
        id: 'digitalkin-partner-id',
        image: '/swarms/digitalkin.jpg',
        models: ['KinOS', 'Claude Haiku'],
        name: 'DigitalKin',
        gallery: [
            { type: 'image', content: 'https://digitalkin.ai/gallery/1.jpg' },
            { type: 'image', content: 'https://digitalkin.ai/gallery/2.jpg' },
            { type: 'image', content: 'https://digitalkin.ai/gallery/3.jpg' }
        ],
        description: `# DigitalKin - Enterprise AI Agents

DigitalKin creates autonomous AI employees that handle complex digital tasks across R&D, finance, and administrative domains. Unlike traditional AI tools that merely assist humans, DigitalKin agents work independently to achieve complex objectives.

## Key Features
- 24/7 availability
- Autonomous task execution
- Multi-model AI architecture
- Enterprise-grade reliability
- Seamless team integration

## Specialized Domains
- R&D and Innovation
- Finance & Accounting
- Administrative Tasks
- Customer Service
- Literature Review
- Data Analysis

Join the future of work with DigitalKin's autonomous AI agents that truly free your human teams from repetitive digital tasks.`,
        programAddress: '',
        tags: ['AI', 'Enterprise', 'Automation', 'KinOS'],
        role: 'Digital Employee Manager',
        swarmType: 'partner'
    },
    {
        id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        image: '/swarms/kinkong.jpg',
        models: ['GPT-4o Mini', 'Claude Haiku'],
        name: 'Kin Kong',
        gallery: [
            { type: 'image', content: 'https://picsum.photos/400/225' },
            { type: 'video', content: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
            { type: 'image', content: 'https://picsum.photos/399/226' },
            { type: 'video', content: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
        ],
        description: KinKongDescription,
        programAddress: '',
        tags: ['AI', 'OpenAI'],
        role: 'Lorem ipsum',
        swarmType: 'partner'
    },
    {
        id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
        image: '/swarms/swarm-ventures.jpg',
        models: ['Claude Haiku'],
        name: 'Swarm Ventures',
        gallery: [
            { type: 'image', content: 'https://picsum.photos/400/225' },
            { type: 'video', content: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
            { type: 'image', content: 'https://picsum.photos/399/226' },
            { type: 'video', content: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
        ],
        description: SwarmVenturesDescription,
        programAddress: '',
        tags: ['AI', 'OpenAI'],
        role: 'Lorem ipsum',
        swarmType: 'partner'
    },
    {
        id: '988b16b4-6beb-4cc5-9a14-50f48ee47a22',
        image: '/swarms/terminal-velocity.jpg',
        models: ['Claude Haiku'],
        name: 'Terminal Velocity',
        gallery: [
            { type: 'image', content: 'https://picsum.photos/400/225' },
            { type: 'video', content: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
            { type: 'image', content: 'https://picsum.photos/399/226' },
            { type: 'video', content: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
        ],
        description: TerminalVelocityDescription,
        programAddress: '',
        tags: ['AI', 'OpenAI'],
        role: 'Lorem ipsum',
        swarmType: 'partner'
    },
    {
        id: '03616e66-a21e-425b-a93b-16d6396e883f',
        image: '/swarms/synthetic-souls.jpg',
        models: ['GPT-4o Mini'],
        name: 'Synthetic Souls',
        description: SyntheticSoulsDescription,
        gallery: [
            { type: 'image', content: 'https://picsum.photos/400/225' },
            { type: 'video', content: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
            { type: 'image', content: 'https://picsum.photos/399/226' },
            { type: 'video', content: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
        ],
        programAddress: '',
        tags: ['AI', 'OpenAI'],
        role: 'Lorem ipsum'
    },
    {
        id: '7d3c9e5b-1f8a-4d3c-b8d4-9e5b1f8a4d3c',
        image: '/swarms/ludosai.jpg',
        models: ['GPT-4o Mini', 'KinOS'],
        name: 'LudosAI',
        gallery: [
            { type: 'image', content: 'https://picsum.photos/400/225' },
            { type: 'video', content: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
            { type: 'image', content: 'https://picsum.photos/399/226' },
            { type: 'video', content: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
        ],
        description: LudosAIDescription,
        programAddress: '',
        tags: ['AI', 'Gaming', 'KinOS'],
        role: 'Gaming Companion',
        swarmType: 'partner'
    },
]
