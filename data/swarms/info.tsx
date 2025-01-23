import { SwarmInfo } from "@/components/swarms/swarm.types"
import { KinKongDescription } from "./descriptions/kinkong"
import { SwarmVenturesDescription } from "./descriptions/swarmventures"
import { TerminalVelocityDescription } from "./descriptions/terminalvelocity"
import { SyntheticSoulsDescription } from "./descriptions/syntheticsouls"
import { DuoAIDescription } from "./descriptions/duoai"

export const getSwarmUsingPoolId = (poolId: string) => SwarmData.filter(swarm => swarm.pool === poolId)[0];
export const getSwarmInfo = (swarmId: string) => SwarmData.filter(swarm => swarm.id === swarmId)[0];


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
        pool: 'DAyBZwKztAqorn1w3Ux9xFyRPFifWjdAAAkoqMNXrVaG',
        image: '/swarms/digitalkin.png',
        models: ['KinOS', 'Claude Haiku'],
        name: 'DigitalKin',
        gallery: [
            { type: 'video', content: 'https://www.youtube.com/watch?v=WcWWTgL8ouc' },
            { type: 'image', content: '/swarms/digitalkin/1.png' },
            { type: 'image', content: '/swarms/digitalkin/2.png' },
            { type: 'image', content: '/swarms/digitalkin/3.png' }
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
        tags: ['AI', 'Enterprise', 'Automation', 'KinOS'],
        role: 'Digital Employee Manager',
        swarmType: 'partner'
    },
    {
        id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
        pool: '',
        image: '/swarms/kinkong.jpg',
        models: ['GPT-4o Mini', 'Claude Haiku'],
        name: 'Kin Kong',
        gallery: [
            { type: 'image', content: '/swarms/kinkong/1_KinKong-Advanced-AI-Trading-Agent.png' },
            { type: 'image', content: '/swarms/kinkong/2_How-KinKong-Works.png' },
            { type: 'image', content: '/swarms/kinkong/4_Investment-Structure.png' },
            { type: 'image', content: '/swarms/kinkong/5_Development-Roadmap.png' },
            { type: 'image', content: '/swarms/kinkong/6_Technical-Integration.png' },
            { type: 'image', content: '/swarms/kinkong/7_Transparency-and-Verification.png' },
            { type: 'image', content: '/swarms/kinkong/8_Market-Focus.png' },
            { type: 'image', content: '/swarms/kinkong/9_Revenue-Distribution-Strategy.png' },
            { type: 'image', content: '/swarms/kinkong/10_KinKong-Advanced-AI-Trading-System.png' }
        ],
        description: KinKongDescription,
        programAddress: '',
        tags: ['AI', 'OpenAI'],
        role: 'Lorem ipsum',
        swarmType: 'partner',
    },
    {
        id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
        pool:'',
        image: '/swarms/swarm-ventures.jpg',
        models: ['Claude Haiku'],
        name: 'Swarm Ventures',
        gallery: [
            { type: 'image', content: '/swarms/swarmventures/1.jpg' },
            { type: 'image', content: '/swarms/swarmventures/2.jpg' },
            { type: 'image', content: '/swarms/swarm-ventures.jpg' }
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
            { type: 'image', content: '/swarms/propertykin/1_PropertyKin-The-Future-of-Real-Estate-Arbitrage.png' },
            { type: 'image', content: '/swarms/propertykin/2_The-PropertyKin-Advantage-AI-Powered-Contract-Flipping.png' },
            { type: 'image', content: '/swarms/propertykin/3_Seize-the-Ground-Floor-A-Market-Untapped.png' },
            { type: 'image', content: '/swarms/propertykin/4_Invest-in-the-INCEPTION-SWARM-Early-Access-Exponential-Growth.png' },
            { type: 'image', content: '/swarms/propertykin/5_PropertyKin-A-Platform-Built-for-the-Future.png' },
            { type: 'image', content: '/swarms/propertykin/6_Join-the-Revolution-Reimagine-Real-Estate-with-PropertyKin.png' },
            { type: 'image', content: '/swarms/propertykin/7_Timeline-of-a-Contract-Flip.png' }
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
    {
        id: 'b2c3d4e5-f6g7-5b6c-9d0e-1f2g3h4i5j6k',
        image: '/swarms/mental-health.jpg',
        models: ['KinOS'],
        name: 'TherapyKin',
        gallery: [
            { type: 'image', content: '/swarms/mental-health.jpg' }
        ],
        description: `# TherapyKin - AI-Powered Mental Health Practice Management

## Overview
TherapyKin is a revolutionary AI swarm designed to optimize mental health practices through intelligent automation and enhanced patient care coordination. By streamlining administrative tasks and providing data-driven insights, TherapyKin enables mental health professionals to focus more on what matters most - their patients.

## Key Features
- Automated scheduling and appointment management
- Intelligent patient intake and documentation
- Real-time session transcription and analysis
- Treatment plan optimization
- Insurance claim processing
- Secure patient communication
- Practice analytics and insights

## Benefits
- Reduced administrative burden
- Improved patient outcomes
- Enhanced practice efficiency
- Data-driven decision making
- Increased revenue through optimization
- Better work-life balance for practitioners

## Technology
- Advanced natural language processing
- Secure healthcare data management
- Integration with existing EHR systems
- HIPAA-compliant communication
- Machine learning for treatment optimization

Join us in revolutionizing mental health practice management with AI.`,
        programAddress: '',
        tags: ['Healthcare', 'Mental Health', 'Practice Management', 'Patient Care', 'AI Assistant'],
        role: 'Healthcare Assistant',
        swarmType: 'inception'
    },
    {
        id: 'c3d4e5f6-g7h8-6c7d-ae1f-2g3h4i5j6k7l',
        image: '/swarms/book.png',
        models: ['KinOS'],
        name: 'PublishKin',
        gallery: [
            { type: 'image', content: '/swarms/book.png' }
        ],
        description: `# PublishKin - AI-Powered Book Production & Publishing

## Overview
PublishKin revolutionizes the publishing industry by streamlining the entire book production process from manuscript to market. Our AI swarm coordinates multiple specialized agents to handle editing, design, marketing, and distribution, making professional publishing accessible and efficient.

## Key Features
- Manuscript analysis and enhancement
- Automated editing and proofreading
- Cover design and formatting
- Market analysis and positioning
- Distribution channel optimization
- Marketing campaign management
- Sales tracking and analytics

## Benefits
- Faster time to market
- Professional-quality output
- Cost-effective publishing
- Wide distribution reach
- Data-driven marketing
- Maximized revenue potential

## Technology
- Natural language processing
- Design automation
- Market intelligence
- Distribution automation
- Analytics and reporting

Join us in transforming the publishing industry with AI-powered innovation.`,
        programAddress: '',
        tags: ['Publishing', 'Book Production', 'Content', 'Distribution', 'Marketing'],
        role: 'Publishing Agent',
        swarmType: 'inception'
    },
    {
        id: 'd4e5f6g7-h8i9-7d8e-bf2g-3h4i5j6k7l8m',
        image: '/swarms/education.png',
        models: ['KinOS'],
        name: 'PlayWise',
        gallery: [
            { type: 'image', content: '/swarms/toy.png' }
        ],
        description: `# PlayWise: Your Child's AI Learning Companion

PlayWise is an interactive AI toy that helps children learn through natural conversation and play. Designed for ages 4-12, it combines a friendly physical interface with sophisticated AI that adapts its explanations to your child's age and understanding.

## How It Works

Imagine this conversation:

**Child:** "Hey PlayWise, why is the sky blue?"

**PlayWise:** (adapting for a 7-year-old) "Let's play a fun game to understand this! Imagine you're holding a handful of tiny blue bouncy balls. When sunlight hits these balls, they love to bounce around more than any other color balls. The sky looks blue for a similar reason - there are tiny particles in the air that bounce blue light from the sun around the most. Want to try a simple experiment with a flashlight and a glass of water to see how light bounces?"

## Key Features

- **Personalized Learning**: Each interaction adapts to your child's age, interests, and learning style
- **Physical + Digital**: Friendly design with expressive LED display and intuitive controls
- **Safe & Private**: All processing happens locally - no data leaves the device
- **Parental Dashboard**: Track learning progress and set educational goals

## Smart Technologies

- Learning style analysis
- Real-time difficulty adjustment
- Multiple AI teaching specialists
- Voice recognition and synthesis
- Educational content curation
- Progress tracking

## Investment Details

- **Hardware Price**: $100
- **Monthly Subscription**: $20
  - Regular content updates
  - New learning modules
  - System improvements
  - Educational assessments
- **Revenue Share**: 60% of revenue distributed to shareholders

## Development Roadmap

1. **Launch Phase** (Q2 2025)
   - Core educational content
   - Basic personalization
   - Parent dashboard

2. **Enhancement Phase** (Q3-Q4 2025)
   - Advanced personalization
   - New subject areas
   - Interactive games
   - Learning analytics

3. **Expansion Phase** (2026)
   - Multi-device interaction
   - Peer learning features
   - Educational institution partnerships
   - International markets

## Target Market

Primary: Parents of children ages 4-12 who:
- Value educational development
- Seek alternatives to screen time
- Want personalized learning
- Can afford premium educational tools

Secondary: Educational institutions and learning centers

## Why PlayWise Matters

Current educational solutions fall into two categories:
1. Traditional toys: Fun but passive learning
2. Educational apps: Learning focused but screen-based

PlayWise bridges this gap by offering:
- Hands-on, screen-free interaction
- Adaptive learning through natural conversation
- Engagement through play and experimentation
- Real-time personalization to each child

## Leadership Opportunity

As an INCEPTION SWARM, we're seeking a visionary leader with toy industry or education sector experience to build this vision into reality. The core AI technology exists - now we need someone to:
- Build and lead the founding team
- Shape the product development strategy
- Design the educational framework
- Establish manufacturing partnerships
- Create the go-to-market strategy
- Raise and manage capital

The ideal candidate brings:
- Proven track record in toys or education
- Experience scaling physical products
- Understanding of early childhood development
- Passion for educational innovation
- Strong business development skills

Join us in redefining how children learn through AI-powered play.`,
        programAddress: '',
        tags: ['Education', 'Interactive Learning', 'Personalization', 'Child Development', 'EdTech'],
        role: 'Educational Assistant',
        swarmType: 'inception'
    },
    {
        id: 'e5f6g7h8-i9j0-8e9f-cg3h-4i5j6k7l8m9n',
        image: '/swarms/talentaid.jpg',
        models: ['KinOS'],
        name: 'TalentKin',
        gallery: [
            { type: 'image', content: '/swarms/talentaid.jpg' }
        ],
        description: `# TalentKin - AI-Powered Recruitment Optimization

## Overview
TalentKin revolutionizes the recruitment process by using AI to match the right candidates with the right opportunities. Our swarm of specialized agents handles everything from job posting optimization to candidate screening, reducing time-to-hire while improving match quality.

## Key Features
- Intelligent job posting optimization
- Automated candidate screening
- Skills assessment
- Interview scheduling
- Candidate communication
- Analytics and reporting
- ATS integration

## Benefits
- Reduced time-to-hire
- Better candidate quality
- Improved hiring efficiency
- Data-driven decisions
- Enhanced candidate experience
- Cost savings

## Technology
- Natural language processing
- Machine learning matching
- Communication automation
- Analytics engine
- Integration capabilities

Join us in transforming recruitment with AI-powered innovation.`,
        programAddress: '',
        tags: ['Recruitment', 'HR Tech', 'Talent Matching', 'AI Screening', 'Hiring'],
        role: 'Recruitment Assistant',
        swarmType: 'inception'
    },
    {
        id: 'f6g7h8i9-j0k1-9f0g-dh4i-5j6k7l8m9n0o',
        image: '/swarms/carehive.jpg',
        models: ['KinOS'],
        name: 'CareHive',
        gallery: [
            { type: 'image', content: '/swarms/carehive.jpg' }
        ],
        description: `# CareHive - AI-Powered Healthcare Practice Management

## Overview
CareHive optimizes healthcare practices through intelligent automation and enhanced patient care coordination. Our AI swarm streamlines operations while improving patient outcomes through data-driven insights and automated workflows.

## Key Features
- Patient scheduling optimization
- Automated documentation
- Insurance processing
- Treatment tracking
- Resource allocation
- Analytics dashboard
- Patient communication

## Benefits
- Improved efficiency
- Better patient care
- Reduced costs
- Data-driven decisions
- Enhanced communication
- Streamlined operations

## Technology
- Healthcare AI
- Workflow automation
- Analytics engine
- Patient engagement tools
- Integration capabilities

Join us in transforming healthcare practice management with AI.`,
        programAddress: '',
        tags: ['AI', 'Healthcare', 'KinOS', 'Operations'],
        role: 'Practice Manager',
        swarmType: 'inception'
    },
    {
        id: 'g7h8i9j0-k1l2-0g1h-ei5j-6k7l8m9n0o1p',
        image: '/swarms/commercenest.jpg',
        models: ['KinOS'],
        name: 'CommerceNest',
        gallery: [
            { type: 'image', content: '/swarms/commercenest.jpg' }
        ],
        description: `# CommerceNest - AI-Powered E-commerce Optimization

## Overview
CommerceNest revolutionizes e-commerce operations through intelligent automation and market analysis. Our AI swarm handles everything from product sourcing to sales optimization, creating profitable online businesses with minimal human intervention.

## Key Features
- Market trend analysis
- Product sourcing
- Pricing optimization
- Inventory management
- Marketing automation
- Customer service
- Performance analytics

## Benefits
- Increased profitability
- Automated operations
- Market insights
- Optimized pricing
- Efficient inventory
- Scalable growth

## Technology
- Market intelligence AI
- Pricing algorithms
- Inventory optimization
- Marketing automation
- Analytics engine

Join us in transforming e-commerce with AI-powered automation.`,
        programAddress: '',
        tags: ['AI', 'E-commerce', 'KinOS', 'Sales'],
        role: 'E-commerce Manager',
        swarmType: 'inception'
    },
    {
        id: 'h8i9j0k1-l2m3-1h2i-fj6k-7l8m9n0o1p2q',
        image: '/swarms/affiliate.jpeg',
        models: ['KinOS'],
        name: 'ProfitBeeAI',
        gallery: [
            { type: 'image', content: '/swarms/affiliate.jpeg' }
        ],
        description: `# ProfitBeeAI - Autonomous Affiliate Marketing

## Overview
ProfitBeeAI revolutionizes affiliate marketing through AI-powered automation and optimization. Our swarm creates, manages, and optimizes affiliate campaigns across multiple channels and niches, maximizing revenue through intelligent content creation and placement.

## Key Features
- Content generation
- Link optimization
- Campaign management
- Multi-channel distribution
- Performance tracking
- Niche analysis
- Revenue optimization

## Benefits
- Automated operations
- Increased revenue
- Multi-channel presence
- Data-driven decisions
- Scalable growth
- Niche targeting

## Technology
- Content AI
- Link optimization
- Campaign automation
- Analytics engine
- Distribution network

Join us in transforming affiliate marketing with AI automation.`,
        programAddress: '',
        tags: ['AI Marketing', 'Content Creation', 'Affiliate', 'Automation', 'Multi-Channel'],
        role: 'Marketing Automation',
        swarmType: 'inception'
    },
    {
        id: 'mentor-swarm-id',
        image: '/swarms/mentor.png',
        models: ['KinOS'],
        name: 'DeskMate',
        gallery: [
            { type: 'image', content: '/swarms/mentor.png' }
        ],
        description: `# DeskMate: Your Personal AI Study Guide & Lamp

DeskMate combines an elegant desk lamp with a sophisticated AI tutor that helps students develop critical thinking skills through Socratic questioning. Instead of giving away answers, it guides students to their own discoveries.

## How It Works

Here's a typical study session:

*(DeskMate detects evening hours and adjusts to a warm, focused lighting setting. Its downward-facing camera observes as the student works on physics homework)*

*[Student writes in notebook: "F = ma, but I don't understand how this relates to the ball going up and down"]*

**Student:** "Hey DeskMate, I'm stuck on my physics homework. When I throw a ball up, why does it slow down before falling back down?"

**DeskMate:** "That's a great physics question! Let's explore this through something you're familiar with. Have you ever been on an elevator going up? How does it feel at the start and just before it stops?"

**Student:** "Yeah! You feel heavy when it starts going up, and then lighter when it's about to stop."

**DeskMate:** "Excellent observation! Now, imagine you're the ball - what force is always pulling on you, just like in the elevator?"

**Student:** "Gravity!"

**DeskMate:** "Perfect! So when you throw the ball up..." *(adjusts light to project a subtle upward gradient)* "...what's happening in the battle between your throw and gravity?"

**Student:** "The ball wants to go up because I threw it, but gravity is pulling it down..."

**DeskMate:** "You're on the right track! Let's break this down into steps. Would you like to:
A) Draw a force diagram together
B) Do a quick experiment with a pencil
C) Look at the energy transformation
What would help you understand best?"

This interaction shows how DeskMate:
- Relates complex concepts to personal experience
- Uses guided discovery rather than direct answers
- Offers multiple learning approaches
- Integrates subtle lighting cues for engagement
- Maintains student-led learning

## Key Features

- **Real-Time Work Recognition**: Built-in camera reads and understands your handwritten work as you write
- **Socratic Dialogue**: Asks guiding questions instead of providing answers
- **Smart Illumination**: Adjusts lighting based on time of day and activity
- **Interactive Feedback**: Watches your problem-solving process and offers guidance at the right moment
- **Visual Understanding**: Reads textbook problems, diagrams, and written notes
- **Progress Tracking**: Monitors understanding through actual homework completion
- **Always Available**: 24/7 homework help without monthly tutoring costs

## Technical Capabilities

- Downward-facing camera with handwriting recognition
- Privacy-first local processing
- Adaptive questioning system
- Real-time concept mapping
- Visual and textual problem understanding
- Voice and text interaction
- Multi-subject expertise
- Learning style analysis
- Study pattern optimization
- Circadian-aware lighting

## Investment Structure

- **Hardware Price**: $149
- **Monthly Subscription**: $29
  - Continuous AI improvements
  - New subject areas
  - Study analytics
  - Parent/teacher dashboards
- **Revenue Share**: 60% distributed to shareholders

## Initial Focus Areas

- Mathematics (Algebra, Geometry, Calculus)
- Sciences (Physics, Chemistry, Biology)
- English (Essay Writing, Literary Analysis)
- History (Critical Analysis, Source Evaluation)
- Study Skills (Time Management, Note-taking)

## Market Opportunity ($100B+ Global Tutoring Market)

Current solutions fall short:
- Private tutors: Expensive ($50-100/hour)
- Online tutorials: Passive learning
- Answer websites: Short-term solutions
- Study groups: Inconsistent availability

DeskMate offers:
- 24/7 availability
- Fraction of tutoring costs
- Active learning through guidance
- Consistent, patient support

## Development Path

1. **Core Release** (Q3 2025)
   - Essential subjects
   - Basic concept mapping
   - Study analytics

2. **Feature Expansion** (Q4 2025)
   - Advanced subjects
   - Interactive visualizations
   - Parent/teacher portal

3. **Market Expansion** (2026)
   - International languages
   - Institution partnerships
   - Custom curriculums

## Leadership Opportunity

We're seeking a visionary leader with experience in:
- Education technology
- Product development
- K-12 education
- EdTech scaling

The ideal candidate brings:
- Deep understanding of education market
- Experience with physical product development
- Track record in EdTech or tutoring services
- Strong connection to education community
- Passion for transforming how students learn

## Why DeskMate Matters

Traditional education faces several challenges:
1. Limited access to quality tutoring
2. Increasing homework complexity
3. Growing tutoring costs
4. Reliance on answer-sharing

DeskMate solves these by providing:
- Affordable, unlimited access
- Development of critical thinking
- Long-term learning benefits
- Active engagement in learning`,
        programAddress: '',
        tags: ['AI', 'Education', 'KinOS', 'Tutoring'],
        role: 'Educational Mentor',
        swarmType: 'inception'
    },
    {
        id: 'speaker-swarm-id',
        image: '/swarms/stumped.jpg',
        logo: '/swarms/stumped.jpg',
        models: ['KinOS'],
        name: 'STUMPED',
        gallery: [
            { type: 'image', content: '/swarms/stumped.jpg' }
        ],
        description: `# STUMPED - AI-Powered Communication Training

## Overview
STUMPED revolutionizes professional development through AI-powered conversation training. Our swarm prepares individuals for high-pressure social and professional scenarios through realistic simulations and personalized feedback.

## Key Features
- Scenario simulation
- Real-time feedback
- Personalized training
- Progress tracking
- Situation analysis
- Communication coaching
- Performance metrics

## Benefits
- Improved confidence
- Better communication
- Professional growth
- Measured progress
- Practical experience
- Skill development

## Technology
- Conversation AI
- Feedback analysis
- Progress tracking
- Scenario generation
- Performance analytics

Join us in transforming professional development with AI-powered training.`,
        programAddress: '',
        tags: ['Communication', 'Training', 'Professional Development', 'Social Skills', 'AI Coaching'],
        role: 'Conversation Coach',
        swarmType: 'inception'
    },
    {
        id: 'travel-swarm-id',
        image: '/swarms/travel.jpeg',
        models: ['KinOS'],
        name: 'TravelAId',
        gallery: [
            { type: 'image', content: '/swarms/travel.jpeg' }
        ],
        description: `# TravelAId - AI-Powered Travel Concierge

## Overview
TravelAId revolutionizes travel planning and assistance through AI-powered personalization. Our swarm creates perfect journeys by handling everything from initial planning to real-time travel support, ensuring memorable experiences.

## Key Features
- Trip planning
- Personalized recommendations
- Real-time assistance
- Booking optimization
- Itinerary management
- Local insights
- Travel monitoring

## Benefits
- Perfect trips
- Time savings
- Local knowledge
- Peace of mind
- Cost optimization
- Memorable experiences

## Technology
- Travel AI
- Recommendation engine
- Real-time monitoring
- Booking automation
- Itinerary optimization

Join us in transforming travel with AI-powered assistance.`,
        programAddress: '',
        tags: ['Travel', 'AI Concierge', 'Trip Planning', 'Personalization', 'Real-time Assistance'],
        role: 'Travel Concierge',
        swarmType: 'inception'
    },
    {
        id: 'grant-swarm-id',
        image: '/swarms/grant.jpeg',
        models: ['KinOS'],
        name: 'GrantKin',
        gallery: [
            { type: 'image', content: '/swarms/grant.jpeg' }
        ],
        description: `# GrantKin - AI-Powered Grant Writing

## Overview
GrantKin revolutionizes non-profit funding through AI-powered grant writing and management. Our swarm handles everything from opportunity discovery to application writing and compliance reporting, maximizing funding success.

## Key Features
- Grant discovery
- Proposal writing
- Compliance checking
- Deadline management
- Report generation
- Success tracking
- Funder analysis

## Benefits
- Increased funding
- Time savings
- Better compliance
- Higher success rates
- Efficient reporting
- Strategic insights

## Technology
- Writing AI
- Compliance checking
- Deadline tracking
- Report generation
- Analytics engine

Join us in transforming non-profit funding with AI-powered grant writing.`,
        programAddress: '',
        tags: ['Non-profit', 'Grant Writing', 'Funding', 'Compliance', 'AI Automation'],
        role: 'Grant Writer',
        swarmType: 'inception'
    },
    {
        id: 'resume-swarm-id',
        image: '/swarms/resume.jpeg',
        models: ['KinOS'],
        name: 'CareerKin',
        gallery: [
            { type: 'image', content: '/swarms/resume.jpeg' }
        ],
        description: `# CareerKin - AI-Powered Career Optimization

## Overview
CareerKin revolutionizes job searching through AI-powered resume optimization. Our swarm analyzes job descriptions, highlights relevant experience, and creates targeted resumes that pass ATS systems and catch human attention.

## Key Features
- Resume optimization
- ATS analysis
- Job matching
- Skills highlighting
- Format optimization
- Career tracking
- Application management

## Benefits
- Better job matches
- Higher response rates
- ATS optimization
- Time savings
- Career growth
- Application tracking

## Technology
- Resume AI
- ATS optimization
- Job analysis
- Skills matching
- Format automation

Join us in transforming career development with AI-powered optimization.`,
        programAddress: '',
        tags: ['AI', 'Career', 'KinOS', 'Resume'],
        role: 'Career Optimizer',
        swarmType: 'inception'
    },
    {
        id: 'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d',
        image: '/swarms/robinhood.jpg',
        models: ['KinOS'],
        name: 'Robinhood Agent',
        gallery: [
            { type: 'image', content: '/swarms/robinhood/1_Robinhood-Agent-Democratizing-AI-Trading.png' },
            { type: 'image', content: '/swarms/robinhood/2_What-Robinhood-Agent-Does.png' },
            { type: 'image', content: '/swarms/robinhood/3_Investment-Tools-Exclusive-to-Shareholders.png' },
            { type: 'image', content: '/swarms/robinhood/4_Core-Mission.png' },
            { type: 'image', content: '/swarms/robinhood/6_Security-and-Ethics.png' },
            { type: 'image', content: '/swarms/robinhood/7_Technical-Integration.png' },
            { type: 'image', content: '/swarms/robinhood/8_Updates-and-Alerts.png' },
            { type: 'image', content: '/swarms/robinhood/9_Funding-Goal.png' },
            { type: 'image', content: '/swarms/robinhood/10_Join-Robinhood-Agent.png' }
        ],
        description: 'Benevolent trading swarm executing institutional-grade strategies to give back to the rightful people',
        programAddress: '',
        tags: ['Trading', 'DeFi', 'Profit Sharing', 'Strategy', 'Institutional'],
        role: 'Trading Agent',
        swarmType: 'inception'
    },
    {
        id: 'f7a92b3c-d8e4-4c1a-9f5d-1234567890ab',
        image: '/swarms/screenplay.jpg',
        models: ['KinOS'],
        name: 'StudioKin',
        gallery: [
            { type: 'image', content: '/swarms/screenplay/1_Screenplay-and-Production-Swarm-Redefining-Filmmaking-with-AI.png' },
            { type: 'image', content: '/swarms/screenplay/2_Introducing-KinOS-AI-Swarm-for-Filmmaking.png' },
            { type: 'image', content: '/swarms/screenplay/3_Why-Invest-Now-A-Ground-Floor-Opportunity.png' },
            { type: 'image', content: '/swarms/screenplay/4_Investment-Structure-Inception-Swarm.png' },
            { type: 'image', content: '/swarms/screenplay/5_Current-Status-and-Next-Steps.png' },
            { type: 'image', content: '/swarms/screenplay/6_Join-Us-in-Building-the-Future-of-Entertainment.png' },
            { type: 'image', content: '/swarms/screenplay/7_The-AI-Driven-Future-of-Filmmaking.png' },
            { type: 'image', content: '/swarms/screenplay/8_Join-the-Swarm.png' }
        ],
        description: 'AI agent swarm that transforms your story idea into a professional-grade screenplay and production plan',
        programAddress: '',
        tags: ['Entertainment', 'Screenwriting', 'Production', 'AI Creative', 'Content'],
        role: 'Screenwriter & Producer',
        swarmType: 'inception'
    },
    {
        id: 'wealthhive-inception-id',
        image: '/swarms/wealthhive.png',
        models: ['KinOS', 'GPT-4'],
        name: 'WealthHive',
        gallery: [
            { type: 'image', content: '/swarms/wealthhive.png' }
        ],
        description: `# WealthHive 🎓
## Building the Future of AI Investment Education

WealthHive represents a unique opportunity in the UBC ecosystem - an investment in knowledge, community growth, and the future of AI understanding. This isn't just another revenue-generating swarm; it's an essential educational infrastructure for our growing community.

### 🎯 Mission
To democratize AI investment knowledge and empower the next generation of AI-native investors through interactive learning and community-driven growth.

### 💫 Core Features
- Interactive AI Investment Courses
- Real-time Market Analysis Training
- Community Learning Challenges
- Personalized Learning Paths
- Achievement-based Rewards
- Peer Learning Networks

### 🌟 Why WealthHive Matters
1. **Education First**: As AI reshapes investing, understanding becomes crucial
2. **Community Growth**: Stronger, more informed investors build a stronger ecosystem
3. **Sustainable Returns**: Knowledge compounds - educated investors make better decisions
4. **Network Effects**: Each new learner adds value to the community

### 💰 Revenue Streams
- Premium Course Access
- Certification Programs
- Custom Learning Paths
- Group Training Sessions
- Enterprise Education Solutions

### 🎓 Educational Focus Areas
- AI Technology Fundamentals
- Investment Strategy
- Risk Management
- Market Analysis
- Portfolio Theory
- Emerging Tech Trends

### 🚀 Growth Strategy
1. Launch core educational platform
2. Build community through learn-to-earn
3. Expand into specialized tracks
4. Develop enterprise solutions
5. Create certification programs

Join us in building an educated, empowered community of AI investors.`,
        programAddress: '',
        tags: ['Education', 'Learn-to-Earn', 'Community', 'AI Learning', 'Investment', 'Knowledge Base', 'Ecosystem Growth'],
        role: 'Educational Guide',
        swarmType: 'inception'
    },
]
