import { AgentInfo } from "@/components/agents/agent.types"
import { KinKongDescription } from "./descriptions/kinkong"
import { SwarmVenturesDescription } from "./descriptions/swarmventures"
import { TerminalVelocityDescription } from "./descriptions/terminalvelocity"
import { SyntheticSoulsDescription } from "./descriptions/syntheticsouls"
import { LudosAIDescription } from "./descriptions/ludosai"

export const AgentData: AgentInfo[] = [
    {
        id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        image: '/agents/kinkong.jpg',
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
        role: 'Lorem ipsum'
    },
    {
        id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
        image: '/agents/swarm-ventures.jpg',
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
        role: 'Lorem ipsum'
    },
    {
        id: '988b16b4-6beb-4cc5-9a14-50f48ee47a22',
        image: '/agents/terminal-velocity.jpg',
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
        role: 'Lorem ipsum'
    },
    {
        id: '03616e66-a21e-425b-a93b-16d6396e883f',
        image: '/agents/synthetic-souls.jpg',
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
        image: '/agents/ludosai.jpg',
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
        role: 'Gaming Companion'
    },
]
