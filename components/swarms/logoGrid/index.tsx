import { SwarmPreviewData } from '@/components/swarms/swarm.types';
import Image from 'next/image';

interface SwarmLogoGridProps {
    swarms: SwarmPreviewData[];
    className?: string;
}

export const SwarmLogoGrid = ({ swarms, className }: SwarmLogoGridProps) => {
    // Take top 10 swarms by multiple
    const topSwarms = swarms
        .sort((a, b) => b.multiple - a.multiple)
        .slice(0, 10);

    return (
        <div className={`relative w-[1000px] h-[1000px] bg-black ${className}`}>
            {topSwarms.map((swarm, index) => {
                // Calculate position in a circle
                const angle = (index * 2 * Math.PI) / topSwarms.length;
                const radius = 350; // Distance from center
                const centerX = 500; // Center of 1000px width
                const centerY = 500; // Center of 1000px height
                
                // Calculate x,y coordinates on the circle
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);

                return (
                    <div
                        key={swarm.id}
                        className="absolute"
                        style={{
                            left: x - 40, // Offset by half the logo size
                            top: y - 40,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        <div className="w-[80px] h-[80px] rounded-full overflow-hidden border-2 border-yellow-400 bg-white">
                            <Image
                                src={swarm.image}
                                alt={swarm.name}
                                width={80}
                                height={80}
                                className="object-cover"
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
