import { SwarmPreviewData } from "@/components/swarms/swarm.types";

export const getSwarm = (swarmId: string) => previews.filter(swarm => swarm.id === swarmId)[0];

export const previews: SwarmPreviewData[] = [
    {
        id: 'kinos-partner-id',
        image: '/swarms/kinos.png',
        models: ['KinOS'],
        name: 'KinOS',
        description: 'The foundational infrastructure swarm powering the entire UBC ecosystem. As the core operating system for autonomous AI, KinOS provides essential runtime services, enabling swarms to operate independently and efficiently.',
        tags: [
            'Infrastructure',
            'Operating System',
            'Runtime Services',
            'Compute',
            'Security',
            'Scalability'
        ],
        role: 'Swarm Operating System',
        swarmType: 'early',
        revenueShare: 50
    },
    {
        id: 'digitalkin-partner-id',
        image: '/swarms/digitalkin.png',
        models: ['KinOS'],
        name: 'DigitalKin',
        description: 'Enterprise-grade AI agents that autonomously handle complex digital tasks. Specializing in R&D, finance, and administrative automation with 24/7 availability.',
        tags: ['Enterprise AI', 'Automation', 'R&D', 'Finance', 'Admin', '24/7 Operations', 'KinOS'],
        role: 'Digital Employee Manager',
        swarmType: 'partner',
        revenueShare: 50
    },
    {
        id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        image: '/swarms/kinkong.jpg',
        models: ['KinOS'],
        name: 'Kin Kong',
        description: 'AI-powered trading specialist focused on the AI token sector, offering 75% profit sharing and weekly $UBC distributions.',
        tags: ['AI Trading', 'Token Markets', 'Profit Sharing', 'Weekly Rewards', 'KinOS', 'UBC'],
        role: 'Trading Specialist',
        swarmType: 'early',
        revenueShare: 60
    },
    {
        id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
        image: '/swarms/swarm-ventures.jpg',
        models: ['Claude Haiku'],
        name: 'SwarmsVenture',
        description: 'The guardian of SwarmLaunchpad, combining specialized AI agents to identify, evaluate, and nurture promising AI projects through rigorous vetting and community-aligned value creation.',
        tags: ['Venture Capital', 'Project Curation', 'Due Diligence', 'Portfolio Management', 'Community Value'],
        role: 'Investment Guardian',
        swarmType: 'early',
        revenueShare: 60
    },
    {
        id: '03616e66-a21e-425b-a93b-16d6396e883f',
        image: '/swarms/syntheticsouls.jpg',
        models: ['GPT-4o Mini'],
        name: 'Synthetic Souls',
        description: 'World\'s first autonomous AI band creating original music and content with 100% profit sharing to investors.',
        tags: ['AI Music', 'Content Creation', 'Profit Sharing', 'Entertainment', 'Royalties'],
        role: 'Music Creator',
        swarmType: 'early',
        revenueShare: 75
    },
    {
        id: '7d3c9e5b-1f8a-4d3c-b8d4-9e5b1f8a4d3c',
        image: '/swarms/duoai.jpg',
        models: ['GPT-4o Mini', 'KinOS'],
        name: 'DuoAI',
        description: 'Universal AI gaming companion that adapts to any game and playing style for personalized gameplay experiences.',
        tags: ['Gaming', 'AI Companion', 'Personalization', 'Adaptive Learning', 'KinOS'],
        role: 'Gaming Companion',
        swarmType: 'inception',
        revenueShare: 60
    },
    {
        id: 'f7a92b3c-d8e4-4c1a-9f5d-1234567890ab',
        image: '/swarms/screenplay.jpg',
        models: ['KinOS'],
        name: 'StudioKin',
        description: 'Transform any story idea into a professional screenplay and complete production plan through our AI-powered filmmaking system. From concept to camera-ready, all powered by coordinated AI agents.',
        tags: ['Entertainment', 'Screenwriting', 'Production', 'AI Creative', 'Content'],
        role: 'Screenwriter & Producer',
        swarmType: 'inception',
        revenueShare: 60
    },
    {
        id: 'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d',
        image: '/swarms/robinhood.jpg',
        models: ['KinOS'],
        name: 'Robinhood Agent',
        description: 'Democratizing institutional-grade trading with AI-powered market analysis, whale tracking, and protective features. Empowering everyday investors with professional-level tools and insights.',
        tags: ['Trading', 'DeFi', 'Profit Sharing', 'Strategy', 'Institutional'],
        role: 'Trading Agent',
        swarmType: 'inception',
        revenueShare: 100
    },
    {
        id: 'b2c3d4e5-f6g7-5b6c-9d0e-1f2g3h4i5j6k',
        image: '/swarms/mental-health.jpg',
        models: ['KinOS'],
        name: 'TherapyKin',
        description: 'Coordinated AI swarm optimizing mental health practice operations and patient care',
        tags: ['Healthcare', 'Mental Health', 'Practice Management', 'Patient Care', 'AI Assistant'],
        role: 'Healthcare Assistant',
        swarmType: 'inception',
        revenueShare: 60
    },
    {
        id: 'c3d4e5f6-g7h8-6c7d-ae1f-2g3h4i5j6k7l',
        image: '/swarms/book.png',
        models: ['KinOS'],
        name: 'PublishKin',
        description: 'An AI publishing system that transforms manuscripts into market-ready books, handling everything from editing to production while maintaining creative quality.',
        tags: ['Publishing', 'Book Production', 'Content', 'Distribution', 'Marketing'],
        role: 'Publishing Agent',
        swarmType: 'inception',
        revenueShare: 60
    },
    {
        id: 'd4e5f6g7-h8i9-7d8e-bf2g-3h4i5j6k7l8m',
        image: '/swarms/toy.png',
        models: ['KinOS'],
        name: 'PlayWise',
        description: 'An AI-powered smart toy that helps children learn through conversation and play, adapting its teaching to each child\'s unique way of understanding.',
        tags: ['Education', 'Interactive Learning', 'Personalization', 'Child Development', 'EdTech'],
        role: 'Educational Assistant',
        swarmType: 'inception',
        revenueShare: 60
    },
    {
        id: 'e5f6g7h8-i9j0-8e9f-cg3h-4i5j6k7l8m9n',
        image: '/swarms/talentaid.jpg',
        models: ['KinOS'],
        name: 'TalentKin',
        description: 'AI recruitment swarm reducing time-to-hire while improving candidate quality and fit',
        tags: ['Recruitment', 'HR Tech', 'Talent Matching', 'AI Screening', 'Hiring'],
        role: 'Recruitment Assistant',
        swarmType: 'inception',
        revenueShare: 60
    },
    {
        id: 'f6g7h8i9-j0k1-9f0g-dh4i-5j6k7l8m9n0o',
        image: '/swarms/carehive.jpg',
        models: ['KinOS'],
        name: 'CareHive',
        description: 'Healthcare operations swarm maximizing patient care through efficient practice management',
        tags: ['AI', 'Healthcare', 'KinOS', 'Operations'],
        role: 'Practice Manager',
        swarmType: 'inception',
        revenueShare: 60
    },
    {
        id: 'g7h8i9j0-k1l2-0g1h-ei5j-6k7l8m9n0o1p',
        image: '/swarms/commercenest.jpg',
        models: ['KinOS'],
        name: 'CommerceNest',
        description: 'AI swarm automating product sourcing, market analysis, and sales optimization to build profitable e-commerce operation',
        tags: ['AI', 'E-commerce', 'KinOS', 'Sales'],
        role: 'E-commerce Manager',
        swarmType: 'inception',
        revenueShare: 60
    },
    {
        id: 'h8i9j0k1-l2m3-1h2i-fj6k-7l8m9n0o1p2q',
        image: '/swarms/affiliate.jpeg',
        models: ['KinOS'],
        name: 'ProfitBeeAI',
        description: 'Autonomous AI swarm revolutionizing affiliate marketing through automated content creation, link optimization, and multi-channel campaign management across specialized niches.',
        tags: ['AI Marketing', 'Content Creation', 'Affiliate', 'Automation', 'Multi-Channel'],
        role: 'Marketing Automation',
        swarmType: 'inception',
        revenueShare: 100
    },
    {
        id: 'mentor-swarm-id',
        image: '/swarms/mentor.png',
        models: ['KinOS'],
        name: 'DeskMate',
        description: 'A smart desk lamp that reads your homework and guides you to answers through thoughtful questions, like having a patient tutor available 24/7.',
        tags: ['AI', 'Education', 'KinOS', 'Tutoring'],
        role: 'Educational Mentor',
        swarmType: 'inception',
        revenueShare: 60
    },
    {
        id: 'wealthhive-inception-id',
        image: '/swarms/wealthhive.png',
        models: ['KinOS', 'GPT-4'],
        name: 'WealthHive',
        description: 'Educational AI swarm democratizing AI investment knowledge through interactive learning and community-driven growth.',
        tags: ['Education', 'Learn-to-Earn', 'Community', 'AI Learning', 'Investment'],
        role: 'Educational Guide',
        swarmType: 'inception',
        revenueShare: 60
    },
    {
        id: 'speaker-swarm-id',
        image: '/swarms/stumped.jpg',
        models: ['KinOS'],
        name: 'STUMPED',
        description: 'Never be caught off guard again. AI-powered training for mastering high-pressure conversations and social scenarios.',
        tags: ['Communication', 'Training', 'Professional Development', 'Social Skills', 'AI Coaching'],
        role: 'Conversation Coach',
        swarmType: 'inception',
        revenueShare: 75
    },
    {
        id: 'travel-swarm-id',
        image: '/swarms/travel.jpeg',
        models: ['KinOS'],
        name: 'TravelAId',
        description: 'AI-powered travel concierge orchestrating perfect journeys through intelligent planning, personalized recommendations, and real-time travel assistance.',
        tags: ['Travel', 'AI Concierge', 'Trip Planning', 'Personalization', 'Real-time Assistance'],
        role: 'Travel Concierge',
        swarmType: 'inception',
        revenueShare: 60
    },
    {
        id: 'grant-swarm-id',
        image: '/swarms/grant.jpeg',
        models: ['KinOS'],
        name: 'GrantKin',
        description: 'AI swarm revolutionizing non-profit funding by automating grant discovery, application writing, and compliance reporting through coordinated AI agents.',
        tags: ['Non-profit', 'Grant Writing', 'Funding', 'Compliance', 'AI Automation'],
        role: 'Grant Writer',
        swarmType: 'inception',
        revenueShare: 60
    },
    {
        id: 'resume-swarm-id',
        image: '/swarms/resume.jpeg',
        models: ['KinOS'],
        name: 'CareerKin',
        description: 'AI swarm crafting targeted resumes by analyzing job descriptions, highlighting relevant experience, and optimizing for ATS',
        tags: ['AI', 'Career', 'KinOS', 'Resume'],
        role: 'Career Optimizer',
        swarmType: 'inception',
        revenueShare: 60
    },
    {
        id: 'forge-partner-id',
        image: '/swarms/xforge.png',
        models: ['KinOS'],
        name: 'XForge',
        description: 'Development orchestration swarm bridging UBC with technical partners through AI-enhanced project management and quality assurance.',
        tags: ['Development', 'Technical Partners', 'Project Management', 'Quality Assurance', 'AI Automation'],
        role: 'Development Coordinator',
        swarmType: 'partner',
        revenueShare: 60
    },
    {
        id: 'propertykin-inception-id',
        image: '/swarms/property.png',
        models: ['KinOS', 'GPT-4V'],
        name: 'PropertyKin',
        description: 'AI-powered real estate arbitrage bot scanning multiple listing sources to identify undervalued properties and instantly connect them with verified buyers through smart contract escrow.',
        tags: ['Real Estate', 'Arbitrage', 'Smart Contracts', 'Property Flipping', 'AI Analysis', 'Wholesale'],
        role: 'Real Estate Arbitrage Bot',
        swarmType: 'inception',
        revenueShare: 60
    },
    {
        id: 'logicatlas-inception-id',
        image: '/swarms/logicatlas.jpg',
        models: ['KinOS'],
        name: 'LogicAtlas',
        description: 'AI-powered supply chain orchestration system optimizing manufacturer-distributor relationships through real-time intelligence and automation.',
        tags: [
            'Supply Chain',
            'AI Orchestration',
            'Process Automation',
            'Real-time Analytics',
            'Distribution',
            'Manufacturing'
        ],
        role: 'Supply Chain Orchestrator',
        swarmType: 'early',
        revenueShare: 60
    },
    {
        id: 'altered-alley-inception-id',
        image: '/swarms/aialley.avif',
        models: ['KinOS'],
        name: 'AI Alley',
        description: 'Creating the foundational infrastructure for autonomous AI agents to interact, collaborate, and generate value through immersive digital spaces.',
        tags: [
            'Infrastructure',
            'Digital Spaces',
            'Virtual Economy',
            'AI Agents',
            'Digital Twins',
            'Metaverse'
        ],
        role: 'Infrastructure Provider',
        swarmType: 'early',
        revenueShare: 60
    },
]
