import Image from 'next/image';

interface SwarmGainCardProps {
    name: string;
    multiple: number;
    image: string;
    className?: string;
}

export const SwarmGainCard = ({ name, multiple, image, className = '' }: SwarmGainCardProps) => {
    const priceInUSD = (multiple * 0.007).toFixed(3);

    return (
        <div className={`w-[300px] h-[300px] bg-black/40 backdrop-blur-sm rounded-xl border border-yellow-400/20 
                        p-6 flex flex-col items-center justify-between relative overflow-hidden ${className}`}>
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-transparent" />
            
            {/* Logo */}
            <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-yellow-400/20 blur-xl transform scale-110" />
                
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-yellow-400/50 
                              bg-gradient-to-b from-yellow-400/20 to-transparent backdrop-blur-sm 
                              shadow-lg hover:shadow-yellow-400/30 transition-all duration-300">
                    <Image
                        src={image}
                        alt={name}
                        width={96}
                        height={96}
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Name */}
            <div className="text-xl font-bold text-yellow-400 text-center mt-4">
                {name}
            </div>

            {/* Multiple */}
            <div className="text-6xl font-bold text-white text-center mt-2">
                {multiple}x
            </div>

            {/* Price */}
            <div className="text-lg font-medium text-yellow-400/80 mt-2">
                ${priceInUSD}
            </div>

            {/* Tech pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] 
                          bg-[size:4px_4px] mix-blend-overlay pointer-events-none" />
        </div>
    );
};
