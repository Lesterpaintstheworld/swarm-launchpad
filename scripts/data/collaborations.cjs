const collaborations = [
  {
    id: '24',
    sourceSwarm: {
      id: 'logicatlas-inception-id',
      name: 'LogicAtlas',
      image: '/swarms/logicatlas.jpg'
    },
    targetSwarm: {
      id: 'kinos-partner-id',
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
    sourceSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    targetSwarm: {
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
    id: '15',
    sourceSwarm: {
      id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
      name: 'Kin Kong',
      image: '/swarms/kinkong.jpg'
    },
    targetSwarm: {
      id: 'forge-partner-id',
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
  }
];

module.exports = { collaborations };
