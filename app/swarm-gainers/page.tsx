import { previews } from '@/data/swarms/previews';
import Image from 'next/image';

export default function SwarmGainersPage() {
    // Sample data with percentages
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
        <div className="min-h-screen bg-black p-8">
            <h1 className="text-yellow-400 text-2xl font-bold mb-8">LAST 24 HOURS</h1>
            
            <div className="flex items-end gap-4 h-[400px]">
                {gainers.map((gainer) => (
                    <div key={gainer.name} className="flex flex-col items-center">
                        {/* Percentage */}
                        <div className="text-yellow-400 font-bold mb-2">
                            {gainer.value}%
                        </div>
                        
                        {/* Bar */}
                        <div 
                            className="w-16 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-sm"
                            style={{ height: `${gainer.value * 3}px` }}
                        />
                        
                        {/* Icon */}
                        <div className="mt-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400/50 bg-white">
                                <Image
                                    src={gainer.image}
                                    alt={gainer.name}
                                    width={48}
                                    height={48}
                                    className="object-cover"
                                />
                            </div>
                            <div className="text-yellow-400 text-xs mt-2 text-center">
                                {gainer.name}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
