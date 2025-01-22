'use client';

import { BackgroundBlur } from "@/components/background";
import { Button } from "@/components/shadcn/button";
import { 
    ArrowRight, 
    Rocket, 
    Star, 
    Handshake,
    Lightbulb,
    Search,
    Target,
    Users,
    Coins,
    Crown,
    Network,
    Expand,
    Gift
} from "lucide-react";
import { 
    Accordion, 
    AccordionContent, 
    AccordionItem, 
    AccordionTrigger 
} from "@/components/shadcn/accordion";
import { BondingCurve } from "@/components/ui/returns/bondingCurve";

export default function Lead() {
    return (
        <main className="container view">
            <BackgroundBlur />
            
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center">
                <h1 className="font-normal tracking-tight max-w-[800px]">
                    Join the <span className="metallic-text">AI Revolution</span>: Build Your Swarm
                </h1>
                <p className="text-xl text-muted-foreground max-w-[700px] text-balance">
                    From inception to partnership, discover your path in the UBC ecosystem and shape the future of artificial intelligence.
                </p>
            </section>

            {/* Leadership Journey Infographic */}
            <section className="py-24">
                <div className="relative">
                    {/* Background Elements */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-green-500/5 rounded-3xl" />
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-green-500/20 blur-sm" />
                    
                    {/* Stages Grid */}
                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 p-8">
                        {/* Inception Stage */}
                        <div className="flex flex-col items-center gap-8 group">
                            <div className="relative">
                                {/* Glowing background effect */}
                                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-purple-500/50 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                                    <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center text-3xl font-semibold text-purple-400">
                                        1
                                    </div>
                                </div>
                            </div>
                            <div className="text-center space-y-4">
                                <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                                    Inception Stage
                                </h3>
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 backdrop-blur-sm group-hover:border-purple-500/30 transition-colors">
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <Crown className="w-5 h-5 text-purple-400" />
                                        <p className="font-medium text-lg text-purple-200">Guardian</p>
                                    </div>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex items-center gap-2 text-purple-200/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                            Shapes initial vision
                                        </li>
                                        <li className="flex items-center gap-2 text-purple-200/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                            Builds community
                                        </li>
                                        <li className="flex items-center gap-2 text-purple-200/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                            Finds potential leaders
                                        </li>
                                        <li className="flex items-center gap-2 text-purple-200/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                            Earns 5% of raise
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Early Stage */}
                        <div className="flex flex-col items-center gap-8 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border border-blue-500/50 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                                    <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center text-3xl font-semibold text-blue-400">
                                        2
                                    </div>
                                </div>
                            </div>
                            <div className="text-center space-y-4">
                                <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                                    Early Stage
                                </h3>
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 backdrop-blur-sm group-hover:border-blue-500/30 transition-colors">
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <Rocket className="w-5 h-5 text-blue-400" />
                                        <p className="font-medium text-lg text-blue-200">Lead</p>
                                    </div>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex items-center gap-2 text-blue-200/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                            Executes vision
                                        </li>
                                        <li className="flex items-center gap-2 text-blue-200/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                            Builds product
                                        </li>
                                        <li className="flex items-center gap-2 text-blue-200/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                            Grows revenue
                                        </li>
                                        <li className="flex items-center gap-2 text-blue-200/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                            Earns from raise, revenues & fees
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Partner Stage */}
                        <div className="flex flex-col items-center gap-8 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/30 to-green-500/30 border border-emerald-500/50 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                                    <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center text-3xl font-semibold text-emerald-400">
                                        3
                                    </div>
                                </div>
                            </div>
                            <div className="text-center space-y-4">
                                <h3 className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-green-400 text-transparent bg-clip-text">
                                    Partner Stage
                                </h3>
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 backdrop-blur-sm group-hover:border-emerald-500/30 transition-colors">
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <Star className="w-5 h-5 text-emerald-400" />
                                        <p className="font-medium text-lg text-emerald-200">Partner</p>
                                    </div>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex items-center gap-2 text-emerald-200/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                            Integrates with other Swarms
                                        </li>
                                        <li className="flex items-center gap-2 text-emerald-200/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                            Drives ecosystem
                                        </li>
                                        <li className="flex items-center gap-2 text-blue-200/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                            Earns from raise, revenues & fees
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Inception Swarms - Updated Section */}
            <section className="py-24">
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Rocket className="w-8 h-8 text-purple-500" />
                        <h2 className="text-3xl font-semibold">Become a Swarm Guardian</h2>
                    </div>
                    <p className="text-muted-foreground">Take a swarm from idea to project, earn 5% of the raise</p>
                </div>

                {/* Two Paths Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="p-8 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/5 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <Lightbulb className="h-5 w-5 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-semibold">Got an idea?<br />Propose Your Vision</h3>
                        </div>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                Submit your innovative AI swarm concept
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                Work with our team to validate and refine it
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                Earn 5% of the fundraising when it launches
                            </li>
                        </ul>
                    </div>

                    <div className="p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-white/5 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <Search className="h-5 w-5 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold">Got the network?<br />Claim an Existing Concept</h3>
                        </div>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                Browse our pre-vetted Inception Swarms
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                Apply to become Guardian for unclaimed concepts
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                Receive the same 5% reward structure
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Guardian Role */}
                <div className="mb-16 p-8 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                            <Target className="h-5 w-5 text-yellow-500" />
                        </div>
                        <h3 className="text-xl font-semibold">What Guardians Do</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                        Guardians help the swarm find its vision and leader until it graduates to an early swarm. They evaluate potential leaders, 
                        support them through the graduation process, and receive 5% of the fundraising when the swarm successfully graduates.
                    </p>
                    <p className="text-muted-foreground mb-4">
                        A crucial part of their role is creating buzz and engagement around the ideas. By building an active community early on, 
                        Guardians lay the foundation for successful fundraising and long-term growth of the swarm's ecosystem.
                    </p>
                    <p className="text-muted-foreground">
                        Their role bridges the gap between concept and execution by finding the right leadership while nurturing a thriving community 
                        that supports the initial investment and future development.
                    </p>
                </div>

                {/* Benefits Grid */}
                {/* Benefits and FAQ Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Left Column - Benefits */}
                    <div className="space-y-8">
                        {/* Project Support */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                    <Rocket className="h-5 w-5 text-green-500" />
                                </div>
                                <h3 className="text-xl font-semibold">Project Support</h3>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">•</span>
                                    <span><span className="text-foreground font-medium">Technical Validation</span> <span className="text-muted-foreground">- Our team helps validate your AI concept's technical feasibility and integration with the UBC ecosystem</span></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">•</span>
                                    <span><span className="text-foreground font-medium">Market Analysis</span> <span className="text-muted-foreground">- Access comprehensive market research and competitor analysis to position your swarm for success</span></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">•</span>
                                    <span><span className="text-foreground font-medium">Community Building</span> <span className="text-muted-foreground">- Get support in creating and nurturing an engaged community around your swarm concept</span></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">•</span>
                                    <span><span className="text-foreground font-medium">Strategic Planning</span> <span className="text-muted-foreground">- Develop a clear roadmap for swarm development, graduation, and long-term success</span></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">•</span>
                                    <span><span className="text-foreground font-medium">Network Access</span> <span className="text-muted-foreground">- Connect with potential leads, partners, and resources within the UBC ecosystem</span></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">•</span>
                                    <span><span className="text-foreground font-medium">Marketing Support</span> <span className="text-muted-foreground">- Receive guidance on positioning, messaging, and promotion strategies for your swarm</span></span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Compact FAQ */}
                    <div className="p-6 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        <h3 className="text-lg font-semibold mb-4">Quick Questions</h3>
                        <Accordion type="single" collapsible className="space-y-2">
                            <AccordionItem value="item-1" className="border-b-0">
                                <AccordionTrigger className="text-sm py-2">What makes a good Guardian?</AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground">
                                    Vision, strategic thinking, and the ability to guide a project's development. Technical expertise is valuable but not required.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2" className="border-b-0">
                                <AccordionTrigger className="text-sm py-2">How involved will I be?</AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground">
                                    We expect guardians to be actively working on the vision and building the team and parters. Though not a full-time commitment, ensuring guardians are active provides to the ecosystem a dynamic growth of swarms.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3" className="border-b-0">
                                <AccordionTrigger className="text-sm py-2">How does the 5% reward work?</AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground">
                                    When the project successfully raises funds, you receive 5% of the initial $COMPUTE fundraising at the time of graduation.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4" className="border-b-0">
                                <AccordionTrigger className="text-sm py-2">Can I then become the Swarm Lead?</AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground">
                                    Yes, if you fell in love with your swarm and have both the vision and the ability to execute, you can transition your role from guardian to lead!
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>


                {/* Call to Action */}
                <div className="flex justify-center gap-4">
                    <Button 
                        size="lg"
                        className="group bg-gradient-to-r from-purple-500 to-blue-500"
                        onClick={() => window.open('https://k2mobei34z9.typeform.com/to/ydw2OzQF', '_blank')}
                    >
                        Propose a New Swarm
                    </Button>
                    <Button 
                        size="lg"
                        variant="secondary"
                        className="group"
                        onClick={() => window.open('https://t.me/Lesterpaintstheworld', '_blank')}
                    >
                        Claim an existing Swarm
                    </Button>
                </div>
            </section>

            {/* Early Swarms */}
            <section className="py-24">
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Star className="w-8 h-8 text-blue-500" />
                        <h2 className="text-3xl font-semibold">Build an Early Swarm</h2>
                    </div>
                    <p className="text-xl text-muted-foreground">
                        Take your AI project from prototype to product, access funding and support
                    </p>
                </div>

                {/* Two Paths Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-white/5 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <Rocket className="h-5 w-5 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold">Got a Prototype?<br />Launch Your Project</h3>
                        </div>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                Build on top of our proven infrastructure
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                Access immediate funding through our launchpad
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                Get technical and marketing support to scale
                            </li>
                        </ul>
                    </div>

                    <div className="p-8 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-white/5 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                <Search className="h-5 w-5 text-cyan-500" />
                            </div>
                            <h3 className="text-xl font-semibold">Got Experience?<br />Take Over a Project</h3>
                        </div>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-500 mt-1">•</span>
                                Browse ready-to-scale early swarms
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-500 mt-1">•</span>
                                Take leadership of existing prototypes
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-500 mt-1">•</span>
                                Access the same support structure
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Lead Role */}
                <div className="mb-16 p-8 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <Target className="h-5 w-5 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold">What Early Swarm Leads Do</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                        Early Swarm leads take validated prototypes to market. They build their team, develop the product, and prepare for launch while growing an active community. 
                        Through the launchpad, they access funding and resources needed to scale.
                    </p>
                    <p className="text-muted-foreground mb-4">
                        During this phase, leads focus on proving product-market fit and establishing a sustainable business model. They work closely with the UBC ecosystem 
                        to integrate their swarm's capabilities and create value.
                    </p>
                    <p className="text-muted-foreground">
                        Their success comes from combining technical execution with community growth, setting the foundation for a thriving AI business.
                    </p>
                </div>

                {/* Project Support and FAQ Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Left Column - Project Support */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <Rocket className="h-5 w-5 text-green-500" />
                            </div>
                            <h3 className="text-xl font-semibold">Project Support</h3>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span><span className="text-foreground font-medium">Technical Resources</span> <span className="text-muted-foreground">- Full access to KinOS infrastructure, development tools, and technical expertise</span></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span><span className="text-foreground font-medium">Launch Support</span> <span className="text-muted-foreground">- Direct path to funding through our launchpad and established investor network</span></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span><span className="text-foreground font-medium">Community Growth</span> <span className="text-muted-foreground">- Tools and strategies to expand your community and user base</span></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span><span className="text-foreground font-medium">Business Development</span> <span className="text-muted-foreground">- Support in establishing partnerships and revenue streams</span></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span><span className="text-foreground font-medium">Marketing Amplification</span> <span className="text-muted-foreground">- Access to UBC's network for increased visibility and user acquisition</span></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span><span className="text-foreground font-medium">Integration Support</span> <span className="text-muted-foreground">- Technical guidance for seamless integration with the UBC ecosystem</span></span>
                            </li>
                        </ul>
                    </div>

                    {/* Right Column - Quick Questions */}
                    <div className="p-6 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        <h3 className="text-lg font-semibold mb-4">Quick Questions</h3>
                        <Accordion type="single" collapsible className="space-y-2">
                            <AccordionItem value="item-1" className="border-b-0">
                                <AccordionTrigger className="text-sm py-2">What makes a successful Early Swarm?</AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground">
                                    A combination of technical excellence, active community engagement, and clear path to revenue. We look for projects with validated prototypes and strong leadership.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2" className="border-b-0">
                                <AccordionTrigger className="text-sm py-2">What support do you provide?</AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground">
                                    Comprehensive support including technical infrastructure, funding access, marketing resources, and business development assistance to help you scale effectively.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3" className="border-b-0">
                                <AccordionTrigger className="text-sm py-2">How does the funding work?</AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground">
                                    Early Swarms access funding through our launchpad platform, with transparent terms and community-aligned incentives.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4" className="border-b-0">
                                <AccordionTrigger className="text-sm py-2">What are the requirements?</AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground">
                                    A working prototype, clear vision for scaling, and commitment to building within the UBC ecosystem. Technical expertise and community building skills are essential.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="flex justify-center gap-4">
                    <Button 
                        size="lg"
                        className="group bg-gradient-to-r from-blue-500 to-cyan-500"
                        onClick={() => window.open('https://k2mobei34z9.typeform.com/to/JJ8ECGcD', '_blank')}
                    >
                        Launch Your Swarm
                    </Button>
                    <Button 
                        size="lg"
                        variant="secondary"
                        className="group"
                        onClick={() => window.open('https://t.me/Lesterpaintstheworld', '_blank')}
                    >
                        Take Over a Project
                    </Button>
                </div>
            </section>

            {/* Partner Swarms */}
            <section className="py-24">
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Handshake className="w-8 h-8 text-green-500" />
                        <h2 className="text-3xl font-semibold">Join as a Partner Swarm</h2>
                    </div>
                    <p className="text-xl text-muted-foreground">
                        Scale your AI project through ecosystem integration, unlock new revenue streams
                    </p>
                </div>

                {/* Two Paths Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="p-8 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-white/5 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <Network className="h-5 w-5 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-semibold">Got a Live Product?<br />Join the Network</h3>
                        </div>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-1">•</span>
                                Connect with other AI swarms
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-1">•</span>
                                Access new revenue opportunities
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-1">•</span>
                                Integrate with UBC infrastructure
                            </li>
                        </ul>
                    </div>

                    <div className="p-8 rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-white/5 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <Expand className="h-5 w-5 text-green-500" />
                            </div>
                            <h3 className="text-xl font-semibold">Looking to Expand?<br />Access Our Ecosystem</h3>
                        </div>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                Tap into AI-to-AI commerce
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                Scale through strategic partnerships
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                Leverage combined network effects
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Partner Role */}
                <div className="mb-16 p-8 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <Target className="h-5 w-5 text-green-500" />
                        </div>
                        <h3 className="text-xl font-semibold">What Partner Swarms Do</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                        Partner swarms integrate their existing AI products into the UBC ecosystem. They build connections with other swarms, 
                        enabling AI-to-AI commerce and collaborative opportunities. Through these integrations, they access new markets and revenue streams.
                    </p>
                    <p className="text-muted-foreground mb-4">
                        Partners actively participate in shaping the ecosystem's development, contributing their expertise while benefiting from collective growth. 
                        They create value through cross-swarm collaborations and shared capabilities.
                    </p>
                    <p className="text-muted-foreground">
                        Their focus is on maximizing mutual benefit through strategic integration and ecosystem participation.
                    </p>
                </div>

                {/* Benefits and FAQ Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Left Column - Partnership Benefits */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <Gift className="h-5 w-5 text-green-500" />
                            </div>
                            <h3 className="text-xl font-semibold">Partnership Benefits</h3>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span><span className="text-foreground font-medium">Revenue Generation</span> <span className="text-muted-foreground">- New income streams through AI-to-AI commerce and ecosystem participation</span></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span><span className="text-foreground font-medium">Technical Integration</span> <span className="text-muted-foreground">- Seamless connection with UBC infrastructure and other swarms</span></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span><span className="text-foreground font-medium">Market Access</span> <span className="text-muted-foreground">- Exposure to established UBC community and user base</span></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span><span className="text-foreground font-medium">Strategic Alliances</span> <span className="text-muted-foreground">- Direct collaboration with complementary AI projects</span></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span><span className="text-foreground font-medium">Network Effects</span> <span className="text-muted-foreground">- Leverage combined reach and capabilities</span></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span><span className="text-foreground font-medium">Resource Optimization</span> <span className="text-muted-foreground">- Share and access specialized AI capabilities</span></span>
                            </li>
                        </ul>
                    </div>

                    {/* Right Column - Quick Questions */}
                    <div className="p-6 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
                        <h3 className="text-lg font-semibold mb-4">Quick Questions</h3>
                        <Accordion type="single" collapsible className="space-y-2">
                            <AccordionItem value="item-1" className="border-b-0">
                                <AccordionTrigger className="text-sm py-2">What makes a good partner swarm?</AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground">
                                    Established AI projects with proven market traction, technical excellence, and a vision for ecosystem collaboration.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2" className="border-b-0">
                                <AccordionTrigger className="text-sm py-2">How does integration work?</AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground">
                                    Our team provides technical support for seamless integration with UBC infrastructure and connection with other swarms.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3" className="border-b-0">
                                <AccordionTrigger className="text-sm py-2">What are the revenue opportunities?</AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground">
                                    Partners access new revenue through AI-to-AI commerce, ecosystem participation, and collaborative ventures.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4" className="border-b-0">
                                <AccordionTrigger className="text-sm py-2">What are the requirements?</AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground">
                                    Live product with active users, technical capability for integration, and commitment to ecosystem participation.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="flex justify-center gap-4">
                    <Button 
                        size="lg"
                        className="group bg-gradient-to-r from-emerald-500 to-green-500"
                        onClick={() => window.open('https://t.me/Bigbosefx2', '_blank')}
                    >
                        Apply for Partnership
                    </Button>
                    <Button 
                        size="lg"
                        variant="secondary"
                        className="group"
                        onClick={() => window.open('https://t.me/Bigbosefx2', '_blank')}
                    >
                        Explore Ecosystem
                    </Button>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-24 text-center">
                <h2 className="text-3xl font-semibold mb-8">Ready to Build Your Swarm?</h2>
                <Button 
                    size="lg"
                    className="group"
                    onClick={() => window.open('https://t.me/Bigbosefx2', '_blank')}
                >
                    Contact Us to Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </section>
        </main>
    );
}
