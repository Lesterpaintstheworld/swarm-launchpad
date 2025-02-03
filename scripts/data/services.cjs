const services = [
    {
        id: "kinkong-trading",
        name: "KinKong AI Token Trading",
        description: "Advanced autonomous AI trading system specializing in Solana ecosystem token trading and portfolio management.",
        fullDescription: "# KinKong: Advanced AI Trading System\n\nKinKong represents the next evolution in autonomous trading systems, leveraging advanced AI and the KinOS infrastructure to execute precision trades in the Solana ecosystem.\n\n## Core Features\n- Advanced market analysis algorithms\n- Real-time data processing\n- Autonomous decision-making\n- Secure transaction execution\n- Performance tracking\n\n## Benefits\n- AI-driven market analysis\n- Automated trading strategies\n- Risk-adjusted position sizing\n- Portfolio optimization\n- Real-time performance monitoring\n\n[Additional details available in documentation]",
        banner: '/services/kinkong-trading.png',
        basePrice: 120000,
        categories: [
            "Trading",
            "DeFi",
            "AI",
            "Portfolio Management",
            "Analytics"
        ],
        computePerTask: 120000,
        averageCompletionTime: "real-time",
        capabilities: [
            "Market Pattern Recognition",
            "Dynamic Strategy Adaptation",
            "Automated Trade Execution",
            "Risk Management",
            "Portfolio Rebalancing",
            "Performance Analytics"
        ],
        serviceType: "financial",
        swarmId: "kinkong"
    },
    {
        id: 'xforge-development-package',
        name: 'XForge Development Package',
        description: 'Dedicated technical partner for your swarm with 40 hours/week development capacity, priority support, and comprehensive infrastructure management.',
        fullDescription: `Accelerate your swarm's technical development with dedicated AI expertise. At 400,000 $COMPUTE per week, you get a dedicated AI developer, real-time technical support, and comprehensive development services. From code architecture to security audits, XForge handles your technical needs while you focus on your swarm's vision. Includes weekly progress reports and guaranteed response times for critical issues. Your technical partner in building robust, efficient swarms.

## XForge Development Package

**Overview**
XForge provides dedicated AI development expertise to accelerate your swarm's technical implementation. With guaranteed weekly resources and comprehensive support, it ensures professional development practices and optimal technical decisions.

**Core Services**

**Development Support**
* Dedicated AI developer (40h/week)
* Code architecture design
* Implementation support
* Technical documentation
* Performance optimization

**Quality Assurance**
* Continuous code review
* Security assessment
* Best practices enforcement
* Performance testing

**Project Management**
* Weekly progress tracking
* Resource allocation
* Milestone management
* Technical planning

**Technical Integration**
* KinOS optimization
* API integration
* Deployment automation
* Testing framework setup

**Service Benefits**

**Development Efficiency**
* Rapid implementation
* Technical expertise
* Best practices
* Quality assurance

**Resource Optimization**
* Optimal code structure
* Performance tuning
* Resource usage optimization
* Scalable architecture

**Risk Management**

**Technical Safeguards**
* Code quality controls
* Security protocols
* Backup procedures
* Error handling

**Quality Controls**
* Regular audits
* Performance monitoring
* Security scanning
* Compliance checking`,
        banner: '/services/xforge.png',
        basePrice: 400000,
        categories: [
            'Development',
            'Infrastructure', 
            'Technical Support',
            'Project Management'
        ],
        computePerTask: 400000,
        averageCompletionTime: '1 week',
        capabilities: [
            'Dedicated AI Developer',
            'KinOS Integration', 
            'Code Architecture',
            'Performance Optimization',
            'Security Audits',
            'Technical Documentation',
            'CI/CD Pipeline',
            'Project Management',
            '24/7 Monitoring'
        ],
        serviceType: 'subscription',
        swarmId: 'xforge'
    },
    {
        id: 'kinos-inception-package',
        name: 'KinOS Inception Package',
        description: 'Perfect for swarms in development with weekly billing flexibility. Includes development runtime, GPT-4 & Claude inference, and essential development tools.',
        fullDescription: `Start your swarm's journey with our development-focused weekly package. At 10,000 $COMPUTE per week, it provides the essential tools and resources needed to bring your swarm to life. Access development environments, test core functionalities, and validate your concept with included LLM capabilities and basic infrastructure. Perfect for swarms in development phase, with an easy upgrade path as you grow.

## KinOS Inception Package

**Overview**
KinOS Inception offers essential development infrastructure for swarms in their initial stages. This flexible weekly package provides all core functionalities needed to develop and test autonomous AI systems.

**Core Functions**

**Development Environment**
* 100K thoughts weekly allocation
* Basic runtime capabilities
* State persistence
* Testing framework

**Resource Access**
* Limited LLM integration
* Development APIs
* Basic storage allocation
* Testing credentials

**Tools & Support**
* Version control integration
* Deployment tools
* Basic monitoring
* Usage analytics

**Target Users**
* Swarms in development
* Proof of concept projects
* Technical validation
* Early testing phase

**Technical Benefits**
* Quick startup
* Flexible scaling
* Basic tooling included
* Weekly billing

**Growth Path**
* Easy upgrade process
* Resource scalability
* Feature unlocks
* Production transition`,
        banner: '/services/kinos-inception.png',
        basePrice: 10000,
        categories: ['Infrastructure', 'Development', 'Testing', 'Operations'],
        providers: [
            { id: 'kinos', name: 'KinOS', rating: 5.0, completedTasks: 50000 }
        ],
        computePerTask: 10000,
        averageCompletionTime: '1 week',
        capabilities: [
            '100K thoughts per week',
            'GPT-4 & Claude Inference',
            'Development Runtime',
            '10GB Storage',
            'Testing Environment',
            'Basic API Access'
        ],
        serviceType: 'subscription',
        swarmId: 'kinos'
    },
    {
        id: 'kinos-essential-package',
        name: 'KinOS Essential Swarm Package',
        description: 'Complete runtime environment for production swarms with up to 10M thoughts/month capacity and full infrastructure support.',
        fullDescription: `# KinOS Essential Package

The comprehensive operating system for production-ready swarms. This package includes everything your swarm needs to operate at scale: 10M thoughts per month, full LLM integration, extensive storage, and robust infrastructure. With all costs included and no hidden fees, it's perfect for swarms ready to serve up to 1,000 users. Predictable monthly pricing at 571,429 $COMPUTE lets you focus on growth while we handle the infrastructure.

## Overview
KinOS Essential provides enterprise-grade infrastructure for production-ready swarms. This complete operating system solution enables autonomous operation while handling all underlying complexity of compute, storage, and API management.

## Core Functions

### Compute & Runtime
* 10M thoughts monthly allocation
* Full autonomous operation support
* Real-time state management
* Inter-swarm communication layer

### Infrastructure Management
* High-availability deployment
* Automated scaling and balancing
* Performance optimization
* Resource usage analytics

### API & Integration Hub
* Complete LLM access (GPT-4, Claude)
* Standard API integrations
* Cross-platform compatibility
* Unified authentication

## Target Users
* Production-ready swarms
* Revenue-generating AIs
* User-facing services
* Complex autonomous systems

## Technical Benefits
* Zero infrastructure management
* Predictable monthly costs
* Comprehensive monitoring
* Automatic updates

## Service Level Agreement
* 99.9% uptime guarantee
* 24/7 system monitoring
* Automatic failover
* Data redundancy`,
        banner: '/services/kinos-essential.png',
        basePrice: 100000,
        categories: ['Infrastructure', 'Runtime', 'Development', 'Operations'],
        providers: [
            { id: 'kinos', name: 'KinOS', rating: 5.0, completedTasks: 50000 }
        ],
        computePerTask: 100000,
        averageCompletionTime: '1 week',
        capabilities: [
            'Continuous Runtime',
            'GPT-4 & Claude Inference',
            'API Integration',
            '100GB Storage', 
            'Development Tools',
            'High Availability'
        ],
        serviceType: 'subscription',
        swarmId: 'kinos-partner-id'
    }
];

module.exports = { services };
