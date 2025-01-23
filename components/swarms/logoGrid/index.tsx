import { SwarmPreviewData } from '@/components/swarms/swarm.types';
import Image from 'next/image';

interface SwarmLogoGridProps {
    swarms: SwarmPreviewData[];
    className?: string;
}

export const SwarmLogoGrid = ({ swarms, className }: SwarmLogoGridProps) => {
    // Sort swarms by multiple (if we add that field later)
    const sortedSwarms = [...swarms];

    return (
        <div className={`relative w-[1000px] h-[1000px] bg-black ${className}`}>
            {sortedSwarms.map((swarm, index) => {
                // Calculate position in a circle
                const totalSwarms = sortedSwarms.length;
                const angle = (index * 2 * Math.PI) / totalSwarms - Math.PI / 2; // Start from top
                const radius = 400; // Increased radius for larger circle
                const centerX = 500; // Center of 1000px width
                const centerY = 500; // Center of 1000px height
                
                // Calculate x,y coordinates on the circle
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);

                return (
                    <div
                        key={swarm.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110"
                        style={{
                            left: x,
                            top: y,
                        }}
                    >
                        <div className="relative group">
                            <div className="w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-yellow-400 bg-white shadow-lg shadow-yellow-400/20">
                                <Image
                                    src={swarm.image}
                                    alt={swarm.name}
                                    width={60}
                                    height={60}
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                <span className="text-xs text-yellow-400">{swarm.name}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
            {/* Optional center logo or text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="text-yellow-400 text-xl font-bold">Swarms</div>
            </div>
        </div>
    );
};
