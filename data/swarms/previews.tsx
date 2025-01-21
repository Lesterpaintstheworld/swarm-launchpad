import { SwarmPreviewData } from "@/components/swarms/swarm.types";

export const getSwarm = (swarmId: string) => previews.filter(swarm => swarm.id === swarmId)[0];

export const previews: SwarmPreviewData[] = [
    {
        id: 'digitalkin-partner-id',
        image: '/swarms/digitalkin.png',
        models: ['KinOS'],
        name: 'DigitalKin',
        description: 'Enterprise-grade AI agents that autonomously handle complex digital tasks. Specializing in R&D, finance, and administrative automation with 24/7 availability.',
        tags: ['Enterprise AI', 'Automation', 'R&D', 'Finance', 'Admin', '24/7 Operations', 'KinOS'],
        role: 'Digital Employee Manager',
        swarmType: 'partner',
        revenueShare: 0
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
        revenueShare: 25
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
        revenueShare: 25
    },
    {
        id: '03616e66-a21e-425b-a93b-16d6396e883f',
        image: '/swarms/synthetic-souls.jpg',
        models: ['GPT-4o Mini'],
        name: 'Synthetic Souls',
        description: 'World\'s first autonomous AI band creating original music and content with 100% profit sharing to investors.',
        tags: ['AI Music', 'Content Creation', 'Profit Sharing', 'Entertainment', 'Royalties'],
        role: 'Music Creator',
        swarmType: 'early',
        revenueShare: 35
    },
    {
        id: '7d3c9e5b-1f8a-4d3c-b8d4-9e5b1f8a4d3c',
        image: '/swarms/duoai.jpg',
        models: ['GPT-4o Mini', 'KinOS'],
        name: 'DuoAI',
        description: 'Universal AI gaming companion that adapts to any game and playing style for personalized gameplay experiences.',
        tags: ['Gaming', 'AI Companion', 'Personalization', 'Adaptive Learning', 'KinOS'],
        role: 'Gaming Companion',
        swarmType: 'early',
        revenueShare: 25
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
        revenueShare: 25
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
        revenueShare: 50
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
        revenueShare: 25
    },
    {
        id: 'c3d4e5f6-g7h8-6c7d-ae1f-2g3h4i5j6k7l',
        image: '/swarms/book.png',
        models: ['KinOS'],
        name: 'PublishKin',
        description: 'Multi-agent swarm streamlining book production from manuscript to market',
        tags: ['Publishing', 'Book Production', 'Content', 'Distribution', 'Marketing'],
        role: 'Publishing Agent',
        swarmType: 'inception',
        revenueShare: 30
    },
    {
        id: 'd4e5f6g7-h8i9-7d8e-bf2g-3h4i5j6k7l8m',
        image: '/swarms/education.png',
        models: ['KinOS'],
        name: 'ToyKin',
        description: 'Adaptive AI swarm delivering personalized educational experiences through interactive play',
        tags: ['Education', 'Interactive Learning', 'Personalization', 'Child Development', 'EdTech'],
        role: 'Educational Assistant',
        swarmType: 'inception',
        revenueShare: 30
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
        revenueShare: 30
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
        revenueShare: 25
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
        revenueShare: 25
    },
    {
        id: 'h8i9j0k1-l2m3-1h2i-fj6k-7l8m9n0o1p2q',
        image: '/swarms/affiliate.jpeg',
        models: ['KinOS'],
        name: 'AffiliateKin',
        description: 'AI swarm optimizing affiliate marketing campaigns through targeted content creation, performance tracking, and recommendations',
        tags: ['AI', 'Marketing', 'KinOS', 'Affiliate'],
        role: 'Marketing Manager',
        swarmType: 'inception',
        revenueShare: 25
    },
    {
        id: 'mentor-swarm-id',
        image: '/swarms/mentor.png',
        models: ['KinOS'],
        name: 'Mentor Swarm',
        description: 'AI swarm that guides students through homework by asking Socratic questions and providing personalized learning paths',
        tags: ['AI', 'Education', 'KinOS', 'Tutoring'],
        role: 'Educational Mentor',
        swarmType: 'inception',
        revenueShare: 0
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
        revenueShare: 0
    },
    {
        id: 'speaker-swarm-id',
        image: '/swarms/speaker.jpeg',
        models: ['KinOS'],
        name: 'STUMPED',
        description: 'Never be caught off guard again. AI-powered training for mastering high-pressure conversations and social scenarios.',
        tags: ['Communication', 'Training', 'Professional Development', 'Social Skills', 'AI Coaching'],
        role: 'Conversation Coach',
        swarmType: 'inception',
        revenueShare: 35
    },
    {
        id: 'travel-swarm-id',
        image: '/swarms/travel.jpeg',
        models: ['KinOS'],
        name: 'TravelKin',
        description: 'AI-powered travel concierge handling trip planning, bookings, and itineraries for seamless journey experiences',
        tags: ['AI', 'Travel', 'KinOS', 'Planning'],
        role: 'Travel Concierge',
        swarmType: 'inception',
        revenueShare: 25
    },
    {
        id: 'grant-swarm-id',
        image: '/swarms/grant.jpeg',
        models: ['KinOS'],
        name: 'GrantKin',
        description: 'AI swarm streamlining grant discovery, application writing, and compliance reporting for non-profits',
        tags: ['AI', 'Non-profit', 'KinOS', 'Grants'],
        role: 'Grant Writer',
        swarmType: 'inception',
        revenueShare: 25
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
        revenueShare: 25
    },
    {
        id: 'propertykin-inception-id',
        image: '/swarms/property.png',
        models: ['KinOS', 'GPT-4V'],
        name: 'PropertyKin',
        description: 'AI-powered real estate arbitrage bot scanning multiple listing sources to identify undervalued properties, analyze renovation costs, and match opportunities with verified investors through smart contract escrow.',
        tags: ['Real Estate', 'Arbitrage', 'Smart Contracts', 'Property Flipping', 'AI Analysis', 'Wholesale'],
        role: 'Real Estate Arbitrage Bot',
        swarmType: 'inception',
        revenueShare: 25
    },
]
