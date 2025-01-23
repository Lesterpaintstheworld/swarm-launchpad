import { previews } from '@/data/swarms/previews';
import Image from 'next/image';

export default function SwarmGainersPage() {
    const gainers = [
        { name: 'DigitalKin', value: 85, image: '/swarms/digitalkin.png' },
        { name: 'Kin Kong', value: 72, image: '/swarms/kinkong.jpg' },
        { name: 'SwarmsVenture', value: 65, image: '/swarms/swarm-ventures.jpg' },
        { name: 'Synthetic Souls', value: 58, image: '/swarms/synthetic-souls.jpg' },
        { name: 'DuoAI', value: 52, image: '/swarms/duoai.jpg' },
        { name: 'StudioKin', value: 45, image: '/swarms/screenplay.jpg' },
        { name: 'Robinhood Agent', value: 38, image: '/swarms/robinhood.jpg' },
        { name: 'TherapyKin', value: 32, image: '/swarms/mental-health.jpg' },
        { name: 'PublishKin', value: 28, image: '/swarms/book.png' },
        { name: 'PlayWise', value: 25, image: '/swarms/education.png' }
    ];

    return (
        <div className="min-h-screen bg-black p-8 flex flex-col items-center">
            <h1 className="text-center mb-8 max-w-2xl">
                <span className="text-2xl font-bold text-white">Top Gainer Swarms on </span>
                <span className="text-2xl font-bold text-yellow-400">$UBC</span>
                <span className="text-2xl font-bold text-white"> - Last 24 Hours</span>
            </h1>
            
            <div className="flex items-end gap-4 h-[400px]">
                {gainers.map((gainer) => (
                    <div key={gainer.name} className="flex flex-col items-center">
                        {/* Percentage */}
                        <div className="text-yellow-400 font-bold mb-2">
                            {gainer.value}%
                        </div>
                        
                        {/* Bar with tech pattern */}
                        <div className="relative w-16">
                            <div 
                                className="absolute inset-0 bg-gradient-to-t from-yellow-600/50 to-yellow-400/50 
                                          animate-pulse rounded-t-sm"
                                style={{ height: `${gainer.value * 3}px` }}
                            />
                            <div 
                                className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-20 
                                          mix-blend-overlay rounded-t-sm"
                                style={{ height: `${gainer.value * 3}px` }}
                            />
                            <div 
                                className="relative w-full bg-gradient-to-t from-yellow-600 to-yellow-400 
                                          rounded-t-sm backdrop-blur-sm"
                                style={{ height: `${gainer.value * 3}px` }}
                            >
                                {/* Lightning effect */}
                                <div className="absolute inset-0 bg-yellow-400/20 rounded-t-sm">
                                    <div className="h-full w-full animate-pulse bg-gradient-to-t from-transparent to-yellow-400/30" />
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
                            <div className="text-yellow-400 text-sm font-medium mt-2 text-center max-w-[80px] leading-tight">
                                {gainer.name}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
