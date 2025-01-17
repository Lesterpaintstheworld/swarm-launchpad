import { SwarmInfo } from "@/components/swarms/swarm.types"
import { KinKongDescription } from "./descriptions/kinkong"
import { SwarmVenturesDescription } from "./descriptions/swarmventures"
import { TerminalVelocityDescription } from "./descriptions/terminalvelocity"
import { SyntheticSoulsDescription } from "./descriptions/syntheticsouls"
import { DuoAIDescription } from "./descriptions/duoai"

export const SwarmData: SwarmInfo[] = [
    {
        id: 'slopfather-partner-id',
        image: '/swarms/slopfather.png',
        models: ['Video AI', 'GPT-4V'],
        name: 'SLOP FATHER',
        gallery: [
            { type: 'image', content: '/swarms/slopfather.png' },
            { type: 'image', content: '/default.png' },
            { type: 'image', content: '/default.png' }
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
        image: '/swarms/digitalkin.png',
        models: ['KinOS', 'Claude Haiku'],
        name: 'DigitalKin',
        gallery: [
            { type: 'image', content: '/swarms/digitalkin.png' },
            { type: 'image', content: '/default.png' },
            { type: 'image', content: '/default.png' }
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
            { type: 'image', content: '/swarms/kinkong.jpg' },
            { type: 'image', content: '/default.png' },
            { type: 'image', content: '/default.png' }
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
            { type: 'image', content: '/swarms/swarm-ventures.jpg' },
            { type: 'image', content: '/default.png' },
            { type: 'image', content: '/default.png' }
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
            { type: 'image', content: '/swarms/terminal-velocity.jpg' },
            { type: 'image', content: '/default.png' },
            { type: 'image', content: '/default.png' }
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
            { type: 'image', content: '/swarms/synthetic-souls.jpg' },
            { type: 'image', content: '/default.png' },
            { type: 'image', content: '/default.png' }
        ],
        programAddress: '',
        tags: ['AI', 'OpenAI'],
        role: 'Lorem ipsum',
        swarmType: 'early'
    },
    {
        id: '7d3c9e5b-1f8a-4d3c-b8d4-9e5b1f8a4d3c',
        image: '/swarms/duoai.jpg',
        models: ['GPT-4o Mini', 'KinOS'],
        name: 'DuoAI',
        gallery: [
            { type: 'image', content: '/swarms/duoai.jpg' },
            { type: 'image', content: '/default.png' },
            { type: 'image', content: '/default.png' }
        ],
        description: DuoAIDescription,
        programAddress: '',
        tags: ['AI', 'Gaming', 'KinOS'],
        role: 'Gaming Compan    ion',
        swarmType: 'partner'
    },
    {
        id: 'propertykin-inception-id',
        image: '/swarms/property.png',
        models: ['KinOS', 'GPT-4V'],
        name: 'PropertyKin',
        gallery: [
            { type: 'image', content: '/swarms/property.png' },
            { type: 'image', content: '/default.png' },
            { type: 'image', content: '/default.png' }
        ],
        description: `# PropertyKin - The Future of Real Estate Arbitrage

## About PropertyKin
The real estate world is brimming with untapped potential—especially when it comes to short-term arbitrage on undervalued properties. PropertyKin is an AI-driven opportunity bot that locates deals on "ugly houses" and instantly connects them with verified buyers. Rather than holding or renovating properties, investors profit purely from the buy/sell of the contract, pocketing the difference with minimal risk.

## 💫 Technology Foundation
We've tackled the hardest challenges—developing an AI system that:
- Scours multiple sources (auction sites, MLS, FSBO) to discover undervalued listings
- Analyzes each deal for potential assignment value, factoring in local comps and market trends
- Matches deals with buyers seeking investment properties, ready to purchase the contract
- Automates contracts via smart contract escrow, allowing users to flip deals quickly without ever owning the actual property

This isn't a mere prototype. Our functioning AI has already identified arbitrage deals and successfully matched buyers, enabling users to profit from contract assignment fees.

## 🎯 Why Invest Now?
This is a ground-floor opportunity in AI-driven real estate arbitrage—focusing solely on contract buy/sell. The market for "wholesale" or contract assignment is massive, yet highly inefficient. By getting in early with PropertyKin, you can help reshape the landscape of short-term property contract trades and capture profits before the rest of the market catches on.

## 💰 Investment Structure & Growth Path
We're establishing this as an INCEPTION SWARM, offering early supporters a chance to get in before our full launch. Key highlights:
- Proven AI core already scanning for lucrative contract flips
- Next-phase development in marketing, user adoption, and operational scaling
- Higher potential returns for early backers, recognizing the inherent risks of a new venture

## ⭐ Current Status & Next Steps
- Operational AI swarm identifying and analyzing high-margin real estate contracts
- Instant buyer matching to lock in profits for contract assignments
- Smart contract escrow ensuring secure, transparent transactions
- Seeking leadership & capital to scale PropertyKin globally
- Early investment window before commercial rollout

The future of real estate isn't about long-term ownership; it's about agile deal-making and streamlined transactions. PropertyKin has proven the concept—now we need visionary partners to grow, refine, and redefine the industry's notion of flipping contracts.

Join the arbitrage revolution with PropertyKin.`,
        programAddress: '',
        tags: ['Real Estate', 'Arbitrage', 'Smart Contracts', 'Property Flipping', 'AI Analysis', 'Wholesale', 'Contract Assignment', 'Deal Finder'],
        role: 'Real Estate Arbitrage Bot',
        swarmType: 'inception'
    },
]
