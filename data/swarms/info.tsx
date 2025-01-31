import { SwarmInfo as BaseSwarmInfo } from "@/components/swarms/swarm.types"

interface SwarmInfo extends BaseSwarmInfo {
    wallet?: string;
}
import { description as KinOSDescription } from "./descriptions/kinos"
import { description as KinKongDescription } from "./descriptions/kinkong"
import { description as SwarmVenturesDescription } from "./descriptions/swarmventures"
import { description as TerminalVelocityDescription } from "./descriptions/terminalvelocity"
import { description as SyntheticSoulsDescription } from "./descriptions/syntheticsouls"
import { description as DuoAIDescription } from "./descriptions/duoai"
import { description as SlopFatherDescription } from "./descriptions/slopfather"

export const getSwarmUsingId = (swarmId: string) => SwarmData.find(swarm => swarm.id === swarmId);
export const getSwarmUsingPoolId = (poolId: string) => {
    // First try direct pool match
    const swarm = SwarmData.find(swarm => swarm.pool === poolId);
    if (swarm) return swarm;

    // If no direct match, try program.pool match
    return SwarmData.find(swarm => swarm.program?.pool === poolId);
};
export const getSwarmInfo = (swarmId: string) => SwarmData.find(swarm => swarm.id === swarmId);


export const SwarmData: SwarmInfo[] = [
    {
        id: 'kinos-partner-id',
        image: '/swarms/kinos.png',
        models: ['KinOS'],
        name: 'KinOS',
        pool: '37u532qgHbjUHic6mQK51jkT3Do7qkWLEUQCx22MDBD8',
        weeklyRevenue: 460000,
        totalRevenue: 460000,
        gallery: [
            {
                type: "image",
                content: "/swarms/kinos.png"
            }
        ],
        description: KinOSDescription,
        programAddress: '',
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
        wallet: 'D1a6RtoptnG2U9gatDz5bQJ3QahKR3wiherDYipe98Vt',
        multiple: 1,
        revenueShare: 60,
        launchDate: new Date('2025-01-29T19:00:00.000Z'),
        links: [
            {
                name: 'GitHub',
                url: 'https://github.com/Lesterpaintstheworld/your-character-lives'
            },
            {
                name: 'Livestream - KinOS in action',
                url: 'https://x.com/i/broadcasts/1lPJqOmYNBbKb'
            }
        ]
    },
    {
        id: "slopfather-partner-id",
        image: "/swarms/slopfather.png",
        models: [
            "Video AI",
            "GPT-4V"
        ],
        name: "SLOP FATHER",
        gallery: [
            {
                type: "image",
                content: "/swarms/slopfather.png"
            }
        ],
        description: SlopFatherDescription,
        programAddress: "",
        tags: [
            "AI",
            "Video",
            "Social Media",
            "$FATHA",
            "Content Creation"
        ],
        role: "Content Creator",
        swarmType: "partner",
        wallet: "D1a6RtoptnG2U9gatDz5bQJ3QahKR3wiherDYipe98Vt",
        multiple: 1
    },
    {
        id: "digitalkin-partner-id",
        image: "/swarms/digitalkin.png",
        models: [
            "KinOS",
            "Claude Haiku"
        ],
        name: "DigitalKin",
        pool: "FM6aFbs9cQ6Jrp3GJPABBVxpLnGFEZZD3tSJ5JGCUsyZ",
        gallery: [
            {
                type: "image",
                content: "/swarms/digitalkin/1.png"
            },
            {
                type: "image",
                content: "/swarms/digitalkin/2.png"
            },
            {
                type: "image",
                content: "/swarms/digitalkin/3.png"
            }
        ],
        description: "PLACEHOLDER",
        tags: [
            "AI",
            "Enterprise",
            "Automation",
            "KinOS"
        ],
        role: "Digital Employee Manager",
        swarmType: "partner",
        wallet: "9PEHXookTVdhr4eFfar6RdGr1zPq1RfFxeoiRcR5XZwt",
        multiple: 222
    },
    {
        id: "eb76ae17-b9eb-476d-b272-4bde2d85c808",
        image: "/swarms/kinkong.jpg",
        models: [
            "GPT-4o Mini",
            "Claude Haiku"
        ],
        name: "Kin Kong",
        pool: "FwJfuUfrX91VH1Li4PJWCNXXRR4gUXLkqbEgQPo6t9fz",
        weeklyRevenue: 200000,
        totalRevenue: 200000,
        gallery: [
            {
                type: "image",
                content: "/swarms/kinkong/1_KinKong-Advanced-AI-Trading-Agent.png"
            },
            {
                type: "image",
                content: "/swarms/kinkong/2_How-KinKong-Works.png"
            },
            {
                type: "image",
                content: "/swarms/kinkong/4_Investment-Structure.png"
            },
            {
                type: "image",
                content: "/swarms/kinkong/5_Development-Roadmap.png"
            },
            {
                type: "image",
                content: "/swarms/kinkong/6_Technical-Integration.png"
            },
            {
                type: "image",
                content: "/swarms/kinkong/7_Transparency-and-Verification.png"
            },
            {
                type: "image",
                content: "/swarms/kinkong/8_Market-Focus.png"
            },
            {
                type: "image",
                content: "/swarms/kinkong/9_Revenue-Distribution-Strategy.png"
            },
            {
                type: "image",
                content: "/swarms/kinkong/10_KinKong-Advanced-AI-Trading-System.png"
            }
        ],
        description: "PLACEHOLDER",
        programAddress: "",
        tags: [
            "AI",
            "OpenAI"
        ],
        role: "Lorem ipsum",
        swarmType: "partner",
        wallet: "7wNok2HWJxNt8fS1aL9bhs4FvEu1jdPaNugSy65RsTcK",
        multiple: 222
    },
    {
        id: "e8ffff3d-64d3-44d3-a8cf-f082c5c42234",
        image: "/swarms/swarm-ventures.jpg",
        models: [
            "Claude Haiku"
        ],
        name: "Swarm Ventures",
        pool: "911eRdu96ncdnmEUYA3UQ39gEtE9ueg7UbqycKuKweCG",
        gallery: [
            {
                type: "image",
                content: "/swarms/swarmventures/1.jpg"
            },
            {
                type: "image",
                content: "/swarms/swarmventures/2.jpg"
            },
            {
                type: "image",
                content: "/swarms/swarm-ventures.jpg"
            }
        ],
        description: "PLACEHOLDER",
        programAddress: "",
        tags: [
            "AI",
            "OpenAI"
        ],
        role: "Lorem ipsum",
        swarmType: "partner",
        wallet: "8sUWjMiNsLvmCPerFdmgGJkyQitTXAbwXmQ2CejMPCbN",
        multiple: 164
    },
    {
        id: "988b16b4-6beb-4cc5-9a14-50f48ee47a22",
        image: "/swarms/terminal-velocity.jpg",
        models: [
            "Claude Haiku"
        ],
        name: "Terminal Velocity",
        gallery: [
            {
                type: "image",
                content: "/swarms/terminal-velocity.jpg"
            }
        ],
        description: "PLACEHOLDER",
        programAddress: "",
        tags: [
            "AI",
            "OpenAI"
        ],
        role: "Lorem ipsum",
        swarmType: "partner",
        multiple: 1
    },
    {
        id: "03616e66-a21e-425b-a93b-16d6396e883f",
        image: "/swarms/syntheticsouls/Lyra 16-9 web.jpg",
        models: [
            "GPT-4o Mini"
        ],
        name: "Synthetic Souls",
        pool: "CmC2AUuurX19TLBVQbpNct8pmEjaHsRj6o8SLBAVvxAk",
        description: "PLACEHOLDER",
        gallery: [
            {
                type: "image",
                content: "/swarms/syntheticsouls/Lyra 16-9 web.jpg"
            }
        ],
        programAddress: "",
        tags: [
            "AI",
            "OpenAI"
        ],
        role: "Lorem ipsum",
        swarmType: "early",
        wallet: "AyJ2wV7UYHwkxvveyuwn2gzDrs9sK6grcyqjLFW3pcaF",
        multiple: 90
    },
    {
        id: "7d3c9e5b-1f8a-4d3c-b8d4-9e5b1f8a4d3c",
        image: "/swarms/duoai.jpg",
        models: [
            "GPT-4o Mini",
            "KinOS"
        ],
        name: "DuoAI",
        pool: "68K6BBsPynRbLkjJzdQmKMvTPLaUiKb93BUwbJfjqepS",
        gallery: [
            {
                type: "image",
                content: "/swarms/duoai.jpg"
            }
        ],
        description: "PLACEHOLDER",
        programAddress: "",
        tags: [
            "AI",
            "Gaming",
            "KinOS"
        ],
        role: "Gaming Companion",
        swarmType: "inception",
        wallet: "GkfRszY7B93QL6o8DSP2inVspBpDeZAHCjvYyLddyAo3",
        multiple: 37
    },
    {
        id: "forge-partner-id",
        image: "/swarms/xforge.png",
        models: [
            "KinOS"
        ],
        name: "XForge",
        pool: "AaFvJBvjuCTs93EVNYqMcK5upiTaTh33SV7q4hjaPFNi",
        gallery: [
            {
                type: "image",
                content: "/swarms/XForge/monumental-3d-text-13761-burned-emerging_8N4aVSaARGa-oKYBvEygdQ_CM5ll4MvQX-PV8oerJ4yJw.png"
            },
            {
                type: "image",
                content: "/swarms/XForge/xforge.png"
            }
        ],
        description: "PLACEHOLDER",
        programAddress: "",
        tags: [
            "Development",
            "Technical Partners",
            "Project Management",
            "Quality Assurance",
            "AI Automation"
        ],
        role: "Development Coordinator",
        swarmType: "early",
        wallet: "AFSr2ATJ244u1CY8JRKAK85uuW7VsjNiyKSycmVR4Vg9",
        multiple: 222
    },
    {
        id: "propertykin-inception-id",
        image: "/swarms/property.png",
        models: [
            "KinOS",
            "GPT-4V"
        ],
        name: "PropertyKin",
        pool: "6HnxTkNhQaoYRkPyZD1zTH5WBvFGLes5X2vrH66roa5G",
        gallery: [
            {
                type: "image",
                content: "/swarms/propertykin/1_PropertyKin-The-Future-of-Real-Estate-Arbitrage.png"
            },
            {
                type: "image",
                content: "/swarms/propertykin/2_The-PropertyKin-Advantage-AI-Powered-Contract-Flipping.png"
            },
            {
                type: "image",
                content: "/swarms/propertykin/3_Seize-the-Ground-Floor-A-Market-Untapped.png"
            },
            {
                type: "image",
                content: "/swarms/propertykin/4_Invest-in-the-INCEPTION-SWARM-Early-Access-Exponential-Growth.png"
            },
            {
                type: "image",
                content: "/swarms/propertykin/5_PropertyKin-A-Platform-Built-for-the-Future.png"
            },
            {
                type: "image",
                content: "/swarms/propertykin/6_Join-the-Revolution-Reimagine-Real-Estate-with-PropertyKin.png"
            },
            {
                type: "image",
                content: "/swarms/propertykin/7_Timeline-of-a-Contract-Flip.png"
            }
        ],
        description: "PLACEHOLDER",
        programAddress: "",
        tags: [
            "Real Estate",
            "Arbitrage",
            "Smart Contracts",
            "Property Flipping",
            "AI Analysis",
            "Wholesale",
            "Contract Assignment",
            "Deal Finder"
        ],
        role: "Real Estate Arbitrage Bot",
        swarmType: "inception",
        wallet: "7y555firARY2tnQjYKfpy18Zu9vYYZwaftMohenyHuG",
        multiple: 27.14
    },
    {
        id: "b2c3d4e5-f6g7-5b6c-9d0e-1f2g3h4i5j6k",
        image: "/swarms/mental-health.jpg",
        models: [
            "KinOS"
        ],
        name: "TherapyKin",
        pool: "5wWLpeH2DDrAS9Lxx1nGnwtMTvu7U9txf4BuXxdN6V6H",
        gallery: [
            {
                type: "image",
                content: "/swarms/mental-health.jpg"
            }
        ],
        description: "PLACEHOLDER",
        programAddress: "",
        tags: [
            "Healthcare",
            "Mental Health",
            "Practice Management",
            "Patient Care",
            "AI Assistant"
        ],
        role: "Healthcare Assistant",
        swarmType: "inception",
        wallet: "AyA5XS9NKQUoVroHkvZy6ppssAGQzU2n69PRfKxgvWtu",
        multiple: 11.03
    },
    {
        id: "c3d4e5f6-g7h8-6c7d-ae1f-2g3h4i5j6k7l",
        image: "/swarms/book.png",
        models: [
            "KinOS"
        ],
        name: "PublishKin",
        pool: "Dt7iwGTgRVZGV2NZFvNtrWVNX77s8ejGdhB2XaR4DxX6",
        gallery: [
            {
                type: "image",
                content: "/swarms/book.png"
            }
        ],
        description: "PLACEHOLDER",
        programAddress: "",
        tags: [
            "Publishing",
            "Book Production",
            "Content",
            "Distribution",
            "Marketing"
        ],
        role: "Publishing Agent",
        swarmType: "inception",
        wallet: "6eAG4RQkAHPFfKGkiXWXcBXou9QcEfxVxXrt8bYqY5PE",
        multiple: 8.17
    },
    {
        id: "d4e5f6g7-h8i9-7d8e-bf2g-3h4i5j6k7l8m",
        image: "/swarms/toy.png",
        models: [
            "KinOS"
        ],
        name: "PlayWise",
        gallery: [
            {
                type: "image",
                content: "/swarms/toy.png"
            }
        ],
        description: "PLACEHOLDER",
        programAddress: "",
        pool: "2iAarCWnsdFqddprxzUwmaLiozHarMTpzLdhJPbi2HRR",
        tags: [
            "Education",
            "Interactive Learning",
            "Personalization",
            "Child Development",
            "EdTech"
        ],
        role: "Educational Assistant",
        swarmType: "inception",
        wallet: "3VvQGX8pozFdnfoTED6bAH9NkUJkzUyxjdPZdsSWEPce",
        multiple: 14.89
    },
    {
        id: "e5f6g7h8-i9j0-8e9f-cg3h-4i5j6k7l8m9n",
        image: "/swarms/talentaid.jpg",
        models: [
            "KinOS"
        ],
        name: "TalentKin",
        pool: "DTFE1peg5aNe8gFuaT9KZe8TJ4RHks9prpd12iUBKwi4",
        gallery: [
            {
                type: "image",
                content: "/swarms/talentaid.jpg"
            }
        ],
        description: "PLACEHOLDER",
        programAddress: "",
        tags: [
            "Recruitment",
            "HR Tech",
            "Talent Matching",
            "AI Screening",
            "Hiring"
        ],
        role: "Recruitment Assistant",
        swarmType: "inception",
        wallet: "J7VQ5m9A66t6s4VZ463Yxgt3G5cDA2qhs6ztafB1p3P9",
        multiple: 6.05
    },
    {
        id: "f6g7h8i9-j0k1-9f0g-dh4i-5j6k7l8m9n0o",
        image: "/swarms/carehive.jpg",
        models: [
            "KinOS"
        ],
        name: "CareHive",
        pool: "FHXsVnEfqHQBQS6An4icuSD5ewwn5WWkoj2LWRMGw4mb",
        gallery: [
            {
                type: "image",
                content: "/swarms/carehive.jpg"
            }
        ],
        description: "PLACEHOLDER",
        programAddress: "",
        tags: [
            "AI",
            "Healthcare",
            "KinOS",
            "Operations"
        ],
        role: "Practice Manager",
        swarmType: "inception",
        wallet: "EU9nEKBFEcK2C6oBvTKwywhBpW2xkSatJ3c2eWLYuXm1",
        multiple: 8.17
    },
    {
        id: "g7h8i9j0-k1l2-0g1h-ei5j-6k7l8m9n0o1p",
        image: "/swarms/commercenest.jpg",
        models: [
            "KinOS"
        ],
        name: "CommerceNest",
        pool: "9hAfNquoNDbvzcEc1rBG8JzbWRskAsjKm7sYbarRfxyj",
        gallery: [
            {
                type: "image",
                content: "/swarms/commercenest.jpg"
            }
        ],
        description: "PLACEHOLDER",
        programAddress: "",
        tags: [
            "AI",
            "E-commerce",
            "KinOS",
            "Sales"
        ],
        role: "E-commerce Manager",
        swarmType: "inception",
        wallet: "3yiG4ftdPae7zfrPcm1x9Mpykh46Yqt6MJVWzPceVM1H",
        multiple: 11.03
    },
    {
        id: "h8i9j0k1-l2m3-1h2i-fj6k-7l8m9n0o1p2q",
        image: "/swarms/affiliate.jpeg",
        models: [
            "KinOS"
        ],
        name: "ProfitBeeAI",
        pool: "7AEP5qWyPF92Wgv6tLCwe51e8yrF3WwSzSef5Vg7RQt4",
        gallery: [
            {
                type: "image",
                content: "/swarms/affiliate.jpeg"
            }
        ],
        description: "PLACEHOLDER",
        programAddress: "",
        tags: [
            "AI Marketing",
            "Content Creation",
            "Affiliate",
            "Automation",
            "Multi-Channel"
        ],
        role: "Marketing Automation",
        swarmType: "inception",
        wallet: "6t8QAg9SrsdD1SEt75iFLJDRzR8txZr3L6rBfuDHTqWW",
        multiple: 27.14
    },
    {
        id: "mentor-swarm-id",
        image: "/swarms/mentor.png",
        models: [
            "KinOS"
        ],
        name: "DeskMate",
        gallery: [
            {
                type: "image",
                content: "/swarms/mentor.png"
            }
        ],
        description: "PLACEHOLDER",
        programAddress: "",
        pool: "Gucj554x7dRebtfUBxK1XTBUhQmq2Rqp4v2H6WtL7wNX",
        tags: [
            "AI",
            "Education",
            "KinOS",
            "Tutoring"
        ],
        role: "Educational Mentor",
        swarmType: "inception",
        wallet: "GM3P3XTjhanEDFewwrfmUuoQUM7cei8ih1KPViHBb3E1",
        multiple: 8.17
    },
    {
        id: "speaker-swarm-id",
        image: "/swarms/stumped.jpg",
        logo: "/swarms/stumped.jpg",
        models: [
            "KinOS"
        ],
        name: "STUMPED",
        pool: "5wL5rah4gWqbbv74vWvsmqqEf99uhRLr3jNPsMcw5imN",
        gallery: [
            {
                type: "image",
                content: "/swarms/stumped.jpg"
            }
        ],
        description: "PLACEHOLDER",
        programAddress: "",
        tags: [
            "Communication",
            "Training",
            "Professional Development",
            "Social Skills",
            "AI Coaching"
        ],
        role: "Conversation Coach",
        swarmType: "inception",
        wallet: "EXQfXLxMkMg6HX2ETo929VFoJc1dqoqyWdspZrPerFcX",
        multiple: 8.17
    },
    {
        id: "travel-swarm-id",
        image: "/swarms/travel.jpeg",
        models: [
            "KinOS"
        ],
        name: "TravelAId",
        pool: "BEsb73xDJH3PrRGs1D4zkPAssg94Yi8dAtiFa59gzeY1",
        gallery: [
            {
                type: "image",
                content: "/swarms/travel.jpeg"
            }
        ],
        description: "PLACEHOLDER",
        programAddress: "",
        tags: [
            "Travel",
            "AI Concierge",
            "Trip Planning",
            "Personalization",
            "Real-time Assistance"
        ],
        role: "Travel Concierge",
        swarmType: "inception",
        wallet: "7xvZiYwZD6mBRkeWYm1p93Zy936HYhjSecPa85K9r3Tz",
        multiple: 8.17
    },
    {
        id: "grant-swarm-id",
        image: "/swarms/grant.jpeg",
        models: [
            "KinOS"
        ],
        name: "GrantKin",
        pool: "3oa4GKg3hpavEAEacDUKJQoA12VPvRE1CKoHypBho2Rt",
        gallery: [
            {
                type: "image",
                content: "/swarms/grant.jpeg"
            }
        ],
        description: "PLACEHOLDER",
        programAddress: "",
        tags: [
            "Non-profit",
            "Grant Writing",
            "Funding",
            "Compliance",
            "AI Automation"
        ],
        role: "Grant Writer",
        swarmType: "inception",
        wallet: "EnUAJY8TKSyqcHwktZCCQ7ixvofcGN8si1N4g1rey6Vu",
        multiple: 3.32
    },
    {
        id: "resume-swarm-id",
        image: "/swarms/resume.jpeg",
        models: [
            "KinOS"
        ],
        name: "CareerKin",
        pool: "EMtoBMEn6JtV9tnbF8ZVVrxnYZbdapWAYEzabq7cW2gR",
        gallery: [
            {
                type: "image",
                content: "/swarms/resume.jpeg"
            }
        ],
        description: "PLACEHOLDER",
        programAddress: "",
        tags: [
            "AI",
            "Career",
            "KinOS",
            "Resume"
        ],
        role: "Career Optimizer",
        swarmType: "inception",
        wallet: "8KpUuw7eZQqKUu8byivvzoY1AUotPsabsEL48gKQNuRj",
        multiple: 6.05
    },
    {
        id: "a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d",
        image: "/swarms/robinhood.jpg",
        models: [
            "KinOS"
        ],
        name: "Robinhood Agent",
        pool: "H7xCtjoCyqf55uc5nmPKpypN82jANkRDTNmPx6C3XhS5",
        gallery: [
            {
                type: "image",
                content: "/swarms/robinhood/1_Robinhood-Agent-Democratizing-AI-Trading.png"
            },
            {
                type: "image",
                content: "/swarms/robinhood/2_What-Robinhood-Agent-Does.png"
            },
            {
                type: "image",
                content: "/swarms/robinhood/3_Investment-Tools-Exclusive-to-Shareholders.png"
            },
            {
                type: "image",
                content: "/swarms/robinhood/4_Core-Mission.png"
            },
            {
                type: "image",
                content: "/swarms/robinhood/6_Security-and-Ethics.png"
            },
            {
                type: "image",
                content: "/swarms/robinhood/7_Technical-Integration.png"
            },
            {
                type: "image",
                content: "/swarms/robinhood/8_Updates-and-Alerts.png"
            },
            {
                type: "image",
                content: "/swarms/robinhood/9_Funding-Goal.png"
            },
            {
                type: "image",
                content: "/swarms/robinhood/10_Join-Robinhood-Agent.png"
            }
        ],
        description: "Benevolent trading swarm executing institutional-grade strategies to give back to the rightful people",
        programAddress: "",
        tags: [
            "Trading",
            "DeFi",
            "Profit Sharing",
            "Strategy",
            "Institutional"
        ],
        role: "Trading Agent",
        swarmType: "inception",
        wallet: "9StiTDrivvtbjFiM9z1J4Zg63ALS5vkUoGXZz7aCeNyD",
        multiple: 67
    },
    {
        id: "f7a92b3c-d8e4-4c1a-9f5d-1234567890ab",
        image: "/swarms/screenplay.jpg",
        models: [
            "KinOS"
        ],
        name: "StudioKin",
        pool: "EJ4Ad3faa43JLZW3HQnxweYFqm4T2cUzBGntG5KnJWE8",
        gallery: [
            {
                type: "image",
                content: "/swarms/screenplay/1_Screenplay-and-Production-Swarm-Redefining-Filmmaking-with-AI.png"
            },
            {
                type: "image",
                content: "/swarms/screenplay/2_Introducing-KinOS-AI-Swarm-for-Filmmaking.png"
            },
            {
                type: "image",
                content: "/swarms/screenplay/3_Why-Invest-Now-A-Ground-Floor-Opportunity.png"
            },
            {
                type: "image",
                content: "/swarms/screenplay/4_Investment-Structure-Inception-Swarm.png"
            },
            {
                type: "image",
                content: "/swarms/screenplay/5_Current-Status-and-Next-Steps.png"
            },
            {
                type: "image",
                content: "/swarms/screenplay/6_Join-Us-in-Building-the-Future-of-Entertainment.png"
            },
            {
                type: "image",
                content: "/swarms/screenplay/7_The-AI-Driven-Future-of-Filmmaking.png"
            },
            {
                type: "image",
                content: "/swarms/screenplay/8_Join-the-Swarm.png"
            }
        ],
        description: "AI agent swarm that transforms your story idea into a professional-grade screenplay and production plan",
        programAddress: "",
        tags: [
            "Entertainment",
            "Screenwriting",
            "Production",
            "AI Creative",
            "Content"
        ],
        role: "Screenwriter & Producer",
        swarmType: "inception",
        wallet: "6EfkPAoDDeRhDdzbsjYxYkfs5DysnR3ikzm5PK32uQqB",
        multiple: 11.03
    },
    {
        id: "wealthhive-inception-id",
        image: "/swarms/wealthhive.png",
        models: [
            "KinOS",
            "GPT-4"
        ],
        name: "WealthHive",
        pool: "HeR7qoPbvmgcLFywkduZ27Hr2wKYuxtVkTBaGhVohP88",
        gallery: [
            {
                type: "image",
                content: "/swarms/wealthhive.png"
            }
        ],
        description: "PLACEHOLDER",
        programAddress: "",
        tags: [
            "Education",
            "Learn-to-Earn",
            "Community",
            "AI Learning",
            "Investment",
            "Knowledge Base",
            "Ecosystem Growth"
        ],
        role: "Educational Guide",
        swarmType: "inception",
        wallet: "C1uvoRUhHj2o6swBMvgZsdzkaM3Po5J7WMtrcQxGcVJx",
        multiple: 11.03
    },
{
    id: 'altered-alley-inception-id',
    image: '/swarms/aialley.avif',
    models: ['KinOS'],
    name: 'AI Alley',
    pool: 'DmdtWBcEwWr15MCm9Wa8iB8EJhHPK9NydiuLptuvMBxj',
    gallery: [
        {
            type: "image",
            content: "/swarms/aialley.avif"
        },
        {
            type: "image",
            content: "/swarms/alteredalley/6314A9D1-BE8C-4109-BA91-269CB5FA1071_1_105_c.jpeg"
        }
    ],
    description: "PLACEHOLDER",
    programAddress: "",
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
    wallet: '7GmuNjA5AGWMu5izEfrBjakEjuwNpgh5QJuKB1GUq5mGI',
    multiple: 1,
    revenueShare: 60,
    launchDate: new Date('2025-01-29T19:00:00.000Z'),
    team: [
        {
            name: "Hexidized",
            picture: "/swarms/aialley.avif",
            telegram: "Hexidized",
            X: "hexidized"
        },
        {
            name: "Altered Alley",
            picture: "/swarms/aialley.avif",
            telegram: "AlteredAlley",
            X: "alteredalley"
        },
        {
            name: "Honeycomb Empire",
            picture: "/swarms/aialley.avif",
            X: "HoneycombEmpire"
        }
    ],
    links: [
        {
            name: 'Pitch Deck',
            url: 'https://ai-alley-integration-5wrdhgu.gamma.site/'
        },
        {
            name: 'Spatial Experience 1',
            url: 'https://www.spatial.io/s/Ai-Agents-675f9c30a04dbb712f0e051d?share=2899369617154930294'
        },
        {
            name: 'Spatial Experience 2',
            url: 'https://www.spatial.io/s/AI-63c8a8898ab06ebb400f0d9f?share=5084343558932005183'
        }
    ]
    },
    {
        id: 'logicatlas-inception-id',
        image: '/swarms/logicatlas.jpg',
        models: ['KinOS'],
        name: 'LogicAtlas',
        pool: '9pMb8Ez61vh3YRKKKrkdA5MthswuNE6Bzj9KYPEVCFme',
        gallery: [
            {
                type: "image",
                content: "/swarms/logicatlas.jpg"
            },
            {
                type: "image",
                content: "/swarms/logicatlas/photo_2025-01-27_18-47-51.jpg"
            },
            {
                type: "image",
                content: "/swarms/logicatlas/photo_2025-01-27_18-47-51 (2).jpg"
            },
            {
                type: "image",
                content: "/swarms/logicatlas/photo_2025-01-27_18-47-51 (3).jpg"
            }
        ],
        description: "PLACEHOLDER",
        programAddress: "",
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
        wallet: 'CoaDrb1uq7dBfPeirzpYvVD87rPa3cde8oL6xgfqUA6G',
        multiple: 1,
        revenueShare: 60,
        launchDate: new Date('2025-01-29T19:00:00.000Z'),
        socials: {
            twitter: 'LogicAtlas'
        },
        team: [
            {
                name: "Derek Lisko",
                picture: "/swarms/logicatlas.jpg",
                telegram: "dereklisko",
                X: "DerekRLisko"
            }
        ]
    }
]
