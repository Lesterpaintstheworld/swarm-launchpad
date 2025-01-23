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
        <div className={`w-[500px] h-[500px] bg-black/40 backdrop-blur-sm rounded-xl border border-yellow-400/20 
                        p-8 flex flex-col items-center relative overflow-hidden ${className}`}>
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-transparent" />
            
            {/* Title */}
            <div className="text-2xl font-bold text-white mb-6 border-b border-white/20 pb-2">
                $UBC Top Gainer Swarm
            </div>

            {/* Logo */}
            <div className="relative mt-4 mb-8">
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
            <div className="text-2xl font-bold text-yellow-400 text-center mb-8">
                {name}
            </div>

            {/* Multiple */}
            <div className="flex flex-col items-center gap-2 mb-auto">
                <div className="text-7xl font-bold text-white text-center">
                    {multiple}x
                </div>
                <div className="text-gray-400 text-base font-medium">
                    24 hour performance
                </div>
            </div>

            {/* Bottom section with UBC Logo and Price */}
            <div className="absolute bottom-8 w-[calc(100%-4rem)] flex justify-between items-center">
                {/* UBC Logo */}
                <div className="flex items-center gap-2">
                    <Image
                        src="/White on transparent.png"
                        alt="UBC Logo"
                        width={32}
                        height={32}
                        className="opacity-75"
                    />
                    <span className="text-[#7dd3fc] text-lg font-medium opacity-75">UBC</span>
                </div>

                {/* Price */}
                <div className="text-xl font-medium text-green-400">
                    ${priceInUSD}
                </div>
            </div>

            {/* Tech pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] 
                          bg-[size:4px_4px] mix-blend-overlay pointer-events-none" />
        </div>
    );
};
