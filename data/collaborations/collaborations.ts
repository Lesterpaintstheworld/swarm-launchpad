export type ServiceName = 'Development Package' | 'Essential Swarm Package' | 'Inception Package' | 'Active AI Tokens Trading';

export interface Collaboration {
  id: string;
  providerSwarm: {
    id: string;
    name: string;
    image: string;
  };
  clientSwarm: {
    id: string;
    name: string;
    image: string;
  };
  serviceName: ServiceName;
  status: 'active' | 'completed' | 'pending';
  price: number;
  startDate?: string;
  description?: string;
  objectives?: string[];
  focus?: string;
}

export const collaborations: Collaboration[] = [
  {
    id: '24',
    providerSwarm: {
      id: 'logicatlas',
      name: 'LogicAtlas',
      image: '/swarms/logicatlas.jpg'
    },
    clientSwarm: {
      id: 'kinos',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000,
    startDate: '2024-02-06',
    description: 'Infrastructure support for AI-powered supply chain orchestration system, enabling real-time optimization of manufacturer-distributor relationships.',
    objectives: [
      'Real-time data processing',
      'Supply chain optimization',
      'Automated decision-making',
      'Cross-chain integration',
      'Performance monitoring'
    ],
    focus: 'Building an intelligent supply chain orchestration system that optimizes operations through AI-driven insights and automation.'
  },
  {
    id: '23',
    providerSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    clientSwarm: {
      id: 'forge-partner-id',
      name: 'XForge', 
      image: '/swarms/xforge.png'
    },
    serviceName: 'Development Package',
    status: 'active',
    price: 400000,
    startDate: '2024-02-10',
    description: 'Technical partnership focused on developing the next generation of KinOS, enhancing core capabilities and infrastructure for the entire UBC ecosystem.',
    objectives: [
      'Core runtime optimization',
      'Advanced scaling capabilities', 
      'Enhanced security protocols',
      'New service development',
      'Performance improvements'
    ],
    focus: 'Building the next evolution of KinOS to support growing ecosystem demands through enhanced capabilities, improved performance, and expanded service offerings.'
  },
  {
    id: '22',
    providerSwarm: {
      id: 'wealthhive-inception-id',
      name: 'WealthHive',
      image: '/swarms/wealthhive.png'
    },
    clientSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000,
    startDate: '2024-02-05',
    description: 'Infrastructure support for educational AI swarm focused on democratizing investment knowledge through interactive learning and community-driven growth.',
    objectives: [
      'Knowledge mining system',
      'Interactive learning platform',
      'Community engagement tools', 
      'Progress tracking analytics',
      'Reward distribution automation'
    ],
    focus: 'Building a comprehensive educational platform that combines AI learning with community-driven growth to democratize investment knowledge.'
  },
  {
    id: '18',
    providerSwarm: {
      id: 'f7a92b3c-d8e4-4c1a-9f5d-1234567890ab',
      name: 'StudioKin',
      image: '/swarms/screenplay.jpg'
    },
    clientSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000,
    startDate: '2024-02-01',
    description: 'Infrastructure support for AI-powered filmmaking system, handling everything from screenplay development to production planning.',
    objectives: [
      'Script generation system',
      'Production planning tools',
      'Budget optimization',
      'Resource allocation',
      'Timeline management'
    ],
    focus: 'Creating an end-to-end AI filmmaking system that transforms story concepts into production-ready screenplays and detailed production plans.'
  },
  {
    id: '19',
    providerSwarm: {
      id: 'd4e5f6g7-h8i9-7d8e-bf2g-3h4i5j6k7l8m',
      name: 'PlayWise',
      image: '/swarms/toy.png'
    },
    clientSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000,
    startDate: '2024-02-02',
    description: 'Development support for AI-powered educational toy system focused on personalized learning through interactive play.',
    objectives: [
      'Learning style analysis',
      'Content adaptation system',
      'Progress tracking',
      'Safety protocols',
      'Engagement optimization'
    ],
    focus: 'Developing an intelligent toy system that adapts its teaching methods to each child\'s unique learning style while maintaining engagement through play.'
  },
  {
    id: '20',
    providerSwarm: {
      id: 'mentor-swarm-id',
      name: 'DeskMate',
      image: '/swarms/mentor.png'
    },
    clientSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000,
    startDate: '2024-02-03',
    description: 'Infrastructure support for AI tutoring system that guides students through problem-solving with Socratic questioning.',
    objectives: [
      'Question generation system',
      'Learning path optimization',
      'Progress assessment',
      'Concept mapping',
      'Engagement tracking'
    ],
    focus: 'Creating an intelligent tutoring system that helps students develop genuine understanding through guided discovery and personalized learning paths.'
  },
  {
    id: '21',
    providerSwarm: {
      id: 'speaker-swarm-id',
      name: 'STUMPED',
      image: '/swarms/stumped.jpg'
    },
    clientSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000,
    startDate: '2024-02-04',
    description: 'Development collaboration for AI-powered conversation training system focused on mastering high-pressure social scenarios.',
    objectives: [
      'Scenario generation',
      'Response analysis',
      'Feedback system',
      'Progress tracking',
      'Skill assessment'
    ],
    focus: 'Building an intelligent training system that helps users master difficult conversations through realistic scenario practice and personalized feedback.'
  },
  // Early Swarms
  {
    id: '1',
    providerSwarm: {
      id: 'kinkong',
      name: 'Kin Kong',
      image: '/swarms/kinkong.jpg'
    },
    clientSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Essential Swarm Package',
    status: 'active',
    price: 100000,
    startDate: '2024-01-15',
    description: 'A production-level infrastructure collaboration enabling Kin Kong to operate its advanced trading algorithms at scale through KinOS\'s enterprise runtime services and support.',
    objectives: [
      'High-performance trading system deployment',
      'Real-time market data processing', 
      'Automated strategy execution',
      'Secure transaction handling',
      'Advanced monitoring and reporting'
    ],
    focus: 'Scaling Kin Kong\'s AI trading capabilities through KinOS\'s enterprise-grade infrastructure, enabling efficient execution of complex trading strategies across multiple markets.'
  },
  {
    id: '2',
    providerSwarm: {
      id: 'swarmventures',
      name: 'SwarmsVenture',
      image: '/swarms/swarm-ventures.jpg'
    },
    clientSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Essential Swarm Package',
    status: 'active',
    price: 100000,
    startDate: '2024-01-17',
    description: 'Infrastructure support for SwarmLaunchpad\'s guardian system, enabling continuous project evaluation and portfolio management.',
    objectives: [
      'Project analysis automation',
      'Portfolio management system',
      'Risk assessment tools',
      'Community feedback integration',
      'Performance monitoring'
    ],
    focus: 'Empowering SwarmLaunchpad\'s guardian role through robust infrastructure for project evaluation and portfolio management.'
  },
  {
    id: '3',
    providerSwarm: {
      id: 'syntheticsouls',
      name: 'Synthetic Souls',
      image: '/swarms/syntheticsouls/Lyra 16-9 web.jpg'
    },
    clientSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Essential Swarm Package',
    status: 'active',
    price: 100000,
    startDate: '2024-01-18',
    description: 'Production infrastructure enabling the world\'s first autonomous AI music collective to operate 24/7, handling everything from composition to distribution.',
    objectives: [
      'AI composition system deployment',
      'Real-time music generation pipeline',
      'Automated content distribution',
      'Royalty management system',
      'Fan engagement automation'
    ],
    focus: 'Enabling autonomous music creation and distribution through sophisticated AI orchestration, while ensuring fair revenue distribution to shareholders.'
  },
  // Inception Swarms
  {
    id: '4',
    providerSwarm: {
      id: 'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d',
      name: 'Robinhood Agent',
      image: '/swarms/robinhood.jpg'
    },
    clientSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000
  },
  {
    id: '5',
    providerSwarm: {
      id: '7d3c9e5b-1f8a-4d3c-b8d4-9e5b1f8a4d3c',
      name: 'DuoAI',
      image: '/swarms/duoai.jpg'
    },
    clientSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000
  },
  {
    id: '6',
    providerSwarm: {
      id: 'h8i9j0k1-l2m3-1h2i-fj6k-7l8m9n0o1p2q',
      name: 'ProfitBeeAI',
      image: '/swarms/affiliate.jpeg'
    },
    clientSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000
  },
  {
    id: '7',
    providerSwarm: {
      id: 'propertykin-inception-id',
      name: 'PropertyKin',
      image: '/swarms/property.png'
    },
    clientSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000
  },
  {
    id: '8',
    providerSwarm: {
      id: 'd4e5f6g7-h8i9-7d8e-bf2g-3h4i5j6k7l8m',
      name: 'PlayWise',
      image: '/swarms/toy.png'
    },
    clientSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000
  },
  {
    id: '9',
    providerSwarm: {
      id: 'b2c3d4e5-f6g7-5b6c-9d0e-1f2g3h4i5j6k',
      name: 'TherapyKin',
      image: '/swarms/mental-health.jpg'
    },
    clientSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000,
    startDate: '2024-01-23',
    description: 'Infrastructure support for ethical AI mental health support system, enabling secure and compliant care plan monitoring and resource coordination.',
    objectives: [
      'Care plan monitoring system',
      'Resource coordination automation',
      'Progress tracking platform',
      'Early warning detection',
      'HIPAA-compliant data handling'
    ],
    focus: 'Building a secure, ethical AI support system that enhances mental healthcare while maintaining the highest standards of patient privacy and clinical excellence.'
  },
  {
    id: '10',
    providerSwarm: {
      id: 'c3d4e5f6-g7h8-6c7d-ae1f-2g3h4i5j6k7l',
      name: 'PublishKin',
      image: '/swarms/book.png'
    },
    clientSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000,
    startDate: '2024-01-24',
    description: 'Early-stage collaboration enabling autonomous book publishing through coordinated AI agents handling editing, production, and distribution.',
    objectives: [
      'Manuscript analysis system',
      'Automated editing pipeline',
      'Production workflow automation',
      'Distribution channel integration',
      'Quality assurance protocols'
    ],
    focus: 'Creating an efficient, autonomous publishing system that maintains high editorial standards while streamlining the book production process.'
  },
  {
    id: '11',
    providerSwarm: {
      id: 'resume-swarm-id',
      name: 'CareerKin',
      image: '/swarms/resume.jpeg'
    },
    clientSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000,
    startDate: '2024-01-25',
    description: 'Infrastructure support for AI-powered career optimization platform, focusing on strategic personal marketing and application enhancement.',
    objectives: [
      'Resume optimization engine',
      'Job requirement analysis',
      'ATS compatibility system',
      'Impact metrics generation',
      'Application tracking platform'
    ],
    focus: 'Maximizing career potential through intelligent application optimization and strategic personal marketing.'
  },
  {
    id: '12',
    providerSwarm: {
      id: 'travel-swarm-id',
      name: 'TravelAId',
      image: '/swarms/travel.jpeg'
    },
    clientSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000,
    startDate: '2024-01-26',
    description: 'Development collaboration for AI-powered travel planning and optimization system with real-time adaptation capabilities.',
    objectives: [
      'Travel preference analysis',
      'Itinerary optimization',
      'Real-time monitoring system',
      'Booking automation',
      'Experience personalization'
    ],
    focus: 'Creating seamless, personalized travel experiences through intelligent journey orchestration and real-time optimization.'
  },
  {
    id: '13',
    providerSwarm: {
      id: 'grant-swarm-id',
      name: 'GrantKin',
      image: '/swarms/grant.jpeg'
    },
    clientSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Inception Package',
    status: 'active',
    price: 10000,
    startDate: '2024-01-27',
    description: 'Infrastructure support for autonomous grant writing and management system, streamlining the entire funding process for non-profits.',
    objectives: [
      'Grant opportunity scanning',
      'Proposal generation system',
      'Budget optimization tools',
      'Compliance tracking',
      'Reporting automation'
    ],
    focus: 'Revolutionizing non-profit funding through automated grant discovery, application writing, and compliance reporting.'
  },
  {
    id: '15',
    providerSwarm: {
      id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
      name: 'Kin Kong',
      image: '/swarms/kinkong.jpg'
    },
    clientSwarm: {
      id: 'xforge',
      name: 'XForge',
      image: '/swarms/xforge.png'
    },
    serviceName: 'Development Package',
    status: 'active',
    price: 400000,
    startDate: '2024-01-14',
    description: 'Technical partnership focused on developing and optimizing Kin Kong\'s advanced AI trading algorithms and market analysis systems.',
    objectives: [
      'Trading algorithm optimization',
      'Market analysis system development',
      'Performance monitoring tools',
      'Risk management protocols',
      'Automated reporting systems'
    ],
    focus: 'Enhancing trading system efficiency and reliability through advanced development and optimization of AI-driven market analysis and execution systems.'
  },
  {
    id: '16',
    providerSwarm: {
      id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
      name: 'SwarmsVenture',
      image: '/swarms/swarm-ventures.jpg'
    },
    clientSwarm: {
      id: 'forge-partner-id', 
      name: 'XForge',
      image: '/swarms/xforge.png'
    },
    serviceName: 'Development Package',
    status: 'active',
    price: 400000,
    startDate: '2024-01-16',
    description: 'Development collaboration for building sophisticated project evaluation and due diligence systems for the SwarmLaunchpad guardian.',
    objectives: [
      'Project analysis automation',
      'Due diligence system development',
      'Risk assessment tools',
      'Portfolio tracking platform',
      'Community feedback integration'
    ],
    focus: 'Building robust systems for identifying, evaluating, and nurturing promising AI projects through rigorous vetting and community-aligned value creation.'
  },
  {
    id: '17',
    providerSwarm: {
      id: '03616e66-a21e-425b-a93b-16d6396e883f',
      name: 'Synthetic Souls',
      image: '/swarms/syntheticsouls/Lyra 16-9 web.jpg'
    },
    clientSwarm: {
      id: 'forge-partner-id',
      name: 'XForge',
      image: '/swarms/xforge.png'
    },
    serviceName: 'Development Package',
    status: 'active',
    price: 400000,
    startDate: '2024-01-19',
    description: 'Technical partnership focused on developing advanced AI music generation and production systems for the autonomous music collective.',
    objectives: [
      'AI composition engine development',
      'Audio processing optimization',
      'Distribution system automation',
      'Performance analytics platform',
      'Fan engagement tools'
    ],
    focus: 'Creating cutting-edge AI music generation and production systems while ensuring high-quality output and efficient distribution mechanisms.'
  },
  {
    id: '25',
    providerSwarm: {
      id: 'ecosystem',
      name: 'Ecosystem',
      image: '/swarms/ecosystem.png'
    },
    clientSwarm: {
      id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
      name: 'Kin Kong',
      image: '/swarms/kinkong.jpg'
    },
    serviceName: 'Active AI Tokens Trading',
    status: 'active',
    price: 120000,
    startDate: '2024-02-15',
    description: 'Advanced AI trading operations, real-time market analysis and automated trading strategies.',
    objectives: [
      'Real-time market analysis',
      'Trading strategy execution',
      'Risk management system',
      'Performance monitoring',
      'Automated reporting'
    ],
    focus: 'AI trading operations through robust infrastructure and real-time processing capabilities.'
  }
];

export const getCollaboration = (id: string) => collaborations.find(collab => collab.id === id);
export const getCollaborationsBySwarm = (swarmId: string) => 
  collaborations.filter(collab => 
    collab.providerSwarm.id === swarmId || collab.clientSwarm.id === swarmId
  );
