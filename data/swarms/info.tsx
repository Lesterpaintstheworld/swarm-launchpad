import { SwarmInfo } from "@/components/swarms/swarm.types"
import { KinKongDescription } from "./descriptions/kinkong"
import { SwarmVenturesDescription } from "./descriptions/swarmventures"
import { TerminalVelocityDescription } from "./descriptions/terminalvelocity"
import { SyntheticSoulsDescription } from "./descriptions/syntheticsouls"
import { LudosAIDescription } from "./descriptions/ludosai"

export const SwarmData: SwarmInfo[] = [
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
