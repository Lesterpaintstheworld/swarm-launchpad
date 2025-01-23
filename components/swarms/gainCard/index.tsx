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
        <div className={`w-[900px] h-[600px] bg-black/40 backdrop-blur-sm rounded-xl border border-yellow-400/20 
                        p-12 flex flex-col items-center justify-between relative overflow-hidden ${className}`}>
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-transparent" />
            
            {/* Logo */}
            <div className="relative">
                <div className="absolute inset-0 bg-yellow-400/20 blur-xl transform scale-110" />
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-yellow-400/50 
                              bg-gradient-to-b from-yellow-400/20 to-transparent backdrop-blur-sm">
                    <Image
                        src={image}
                        alt={name}
                        width={192}
                        height={192}
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Name */}
            <div className="text-3xl font-bold text-yellow-400 text-center mt-8">
                {name}
            </div>

            {/* Multiple */}
            <div className="flex flex-col items-center gap-2">
                <div className="text-8xl font-bold text-white text-center">
                    {multiple}x
                </div>
                <div className="text-gray-500 text-sm">
                    24 hour performance
                </div>
            </div>

            {/* Price */}
            <div className="flex flex-col items-center gap-4">
                <div className="text-2xl font-medium text-yellow-400/80">
                    ${priceInUSD}
                </div>
                
                {/* Small UBC logo */}
                <div className="flex items-center gap-2">
                    <Image
                        src="/White on transparent.png"
                        alt="UBC Logo"
                        width={20}
                        height={20}
                        className="opacity-50"
                    />
                    <span className="text-white/50 text-sm">UBC</span>
                </div>
            </div>

            {/* Tech pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] 
                          bg-[size:4px_4px] mix-blend-overlay pointer-events-none" />
        </div>
    );
};
