import Image from 'next/image';
import { SwarmGainCard } from '@/components/swarms/gainCard';

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
        <div className="min-h-screen bg-black relative">
            {/* Background image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/site image-modified.jpg"
                    alt="Background"
                    fill
                    className="object-cover opacity-15"
                />
            </div>

            {/* Content container */}
            <div className="relative z-10 p-8 pt-24 flex flex-col items-center">
                {/* Logo UBC */}
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

                <div className="grid grid-cols-3 gap-8">
                    {gainers.map((gainer) => (
                        <SwarmGainCard
                            key={gainer.name}
                            name={gainer.name}
                            multiple={gainer.value}
                            image={gainer.image}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
