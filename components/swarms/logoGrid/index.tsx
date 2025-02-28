import { SwarmPreviewData } from '@/components/swarms/swarm.types';
import Image from 'next/image';

interface SwarmLogoGridProps {
    swarms: SwarmPreviewData[];
    className?: string;
}

export const SwarmLogoGrid = ({ swarms, className }: SwarmLogoGridProps) => {
    // Filter out STUMPED and create sorted array
    const sortedSwarms = swarms.filter(swarm => swarm.name !== 'STUMPED');

    return (
        <div className={`w-[1000px] h-[1000px] bg-black p-8 ${className}`}>
            <div className="grid grid-cols-5 gap-8 place-items-center">
                {sortedSwarms.map((swarm) => (
                    <div
                        key={swarm.id}
                        className="group relative flex flex-col items-center gap-3"
                    >
                        <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-xl transform scale-110" />
                            
                            <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-yellow-400/50 bg-gradient-to-b from-yellow-400/20 to-transparent backdrop-blur-sm shadow-lg hover:shadow-yellow-400/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 transform perspective-1000 hover:rotate-2">
                                <Image
                                    src={swarm.image}
                                    alt={swarm.name}
                                    width={120}
                                    height={120}
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <span className="text-sm text-yellow-400 font-medium text-center px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-yellow-400/20">
                            {swarm.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
