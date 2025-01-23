import { previews } from '@/data/swarms/previews';
import Image from 'next/image';

export default function SwarmGainersPage() {
    const gainers = [
        { name: 'DigitalKin', value: 25, image: '/swarms/digitalkin.png' },
        { name: 'Kin Kong', value: 22, image: '/swarms/kinkong.jpg' },
        { name: 'SwarmsVenture', value: 19, image: '/swarms/swarm-ventures.jpg' },
        { name: 'Synthetic Souls', value: 17, image: '/swarms/synthetic-souls.jpg' },
        { name: 'DuoAI', value: 15, image: '/swarms/duoai.jpg' },
        { name: 'StudioKin', value: 13, image: '/swarms/screenplay.jpg' },
        { name: 'Robinhood Agent', value: 11, image: '/swarms/robinhood.jpg' },
        { name: 'TherapyKin', value: 9, image: '/swarms/mental-health.jpg' },
        { name: 'PublishKin', value: 7, image: '/swarms/book.png' },
        { name: 'PlayWise', value: 5, image: '/swarms/education.png' }
    ];

    return (
        <div className="min-h-screen bg-black p-8 flex flex-col items-center relative">
            {/* Logo UBC dans le coin */}
            <div className="absolute top-8 right-8 flex items-center gap-3">
                <Image
                    src="/White on transparent.png"
                    alt="UBC Logo"
                    width={60}
                    height={60}
                    className="opacity-50"
                />
                <span className="text-white/50 text-2xl font-bold">UBC</span>
            </div>

            <h1 className="text-center mb-16">
                <span className="text-5xl font-bold text-yellow-400">$UBC</span>
                <span className="text-5xl font-bold text-white"> Top Gainer Swarms - Last 24 Hours</span>
            </h1>
            
            <div className="flex items-end gap-4 h-[400px]">
                {gainers.map((gainer) => (
                    <div key={gainer.name} className="flex flex-col items-center w-24">
                        <div className="relative w-16 flex flex-col items-center">
                            {/* Bar with tech pattern */}
                            <div className="relative w-full">
                                <div 
                                    className="w-full bg-gradient-to-t from-yellow-600 to-yellow-400 
                                              rounded-t-sm backdrop-blur-sm overflow-hidden"
                                    style={{ height: `${gainer.value * 12}px` }}
                                >
                                    {/* Tech pattern overlay */}
                                    <div 
                                        className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] 
                                                  bg-[size:4px_4px] mix-blend-overlay"
                                    />
                                    
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-yellow-400/20">
                                        <div className="h-full w-full animate-pulse bg-gradient-to-t from-transparent to-yellow-400/30" />
                                    </div>

                                    {/* Multiplier on top of the bar */}
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400 font-bold text-xl">
                                        {gainer.value}x
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Icon and Name */}
                        <div className="mt-4 flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400/50 bg-white">
                                <Image
                                    src={gainer.image}
                                    alt={gainer.name}
                                    width={48}
                                    height={48}
                                    className="object-cover"
                                />
                            </div>
                            <div className="text-yellow-400 text-sm font-medium mt-2 text-center leading-tight min-h-[40px]">
                                {gainer.name}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
