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
        <div className={`w-[630px] h-[420px] bg-black/40 backdrop-blur-sm rounded-xl border border-yellow-400/20 
                        p-8 flex flex-col items-center justify-between relative overflow-hidden ${className}`}>
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-transparent" />
            
            {/* Title */}
            <div className="text-lg font-medium text-yellow-400/80 mb-8">
                $UBC Top Gainer Swarm
            </div>

            {/* Logo */}
            <div className="relative mt-4">
                <div className="absolute inset-0 bg-yellow-400/20 blur-xl transform scale-110" />
                <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-yellow-400/50 
                              bg-gradient-to-b from-yellow-400/20 to-transparent backdrop-blur-sm">
                    <Image
                        src={image}
                        alt={name}
                        width={144}
                        height={144}
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Name */}
            <div className="text-2xl font-bold text-yellow-400 text-center mt-6">
                {name}
            </div>

            {/* Multiple */}
            <div className="flex flex-col items-center gap-2">
                <div className="text-7xl font-bold text-white text-center">
                    {multiple}x
                </div>
                <div className="text-gray-400 text-lg font-medium">
                    24 hour performance
                </div>
            </div>

            {/* Bottom section */}
            <div className="w-full flex justify-between items-center mt-4">
                {/* UBC Logo - now larger and in bottom left */}
                <div className="flex items-center gap-2">
                    <Image
                        src="/White on transparent.png"
                        alt="UBC Logo"
                        width={32}
                        height={32}
                        className="opacity-70"
                    />
                    <span className="text-[#7dd3fc] text-lg font-medium">UBC</span>
                </div>

                {/* Price */}
                <div className="text-xl font-medium text-yellow-400/80">
                    ${priceInUSD}
                </div>
            </div>

            {/* Tech pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] 
                          bg-[size:4px_4px] mix-blend-overlay pointer-events-none" />
        </div>
    );
};
