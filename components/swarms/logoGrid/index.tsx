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
        <div className={`w-[1000px] h-[1000px] bg-black p-8 ${className}`}>
            <div className="grid grid-cols-5 gap-8 place-items-center">
                {sortedSwarms.map((swarm) => (
                    <div
                        key={swarm.id}
                        className="group relative"
                    >
                        <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-yellow-400 bg-white shadow-lg shadow-yellow-400/20 transition-transform duration-300 group-hover:scale-110">
                            <Image
                                src={swarm.image}
                                alt={swarm.name}
                                width={120}
                                height={120}
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            <span className="text-sm text-yellow-400 font-medium">{swarm.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
