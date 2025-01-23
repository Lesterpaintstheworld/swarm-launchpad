'use client';
import Image from 'next/image';

interface CaptureCardProps {
    name: string;
    multiple: number;
    image: string;
    launchMode?: boolean;
}

export const CaptureCard = ({ name, multiple, image, launchMode = false }: CaptureCardProps) => {
    const priceInUSD = launchMode ? "0.007" : (multiple * 0.007).toFixed(3);

    return (
        <div 
            className="w-[500px] h-[500px] bg-[#0D0D0D] rounded-2xl p-8 flex flex-col items-center relative"
            style={{
                background: 'linear-gradient(180deg, rgba(13,13,13,1) 0%, rgba(0,0,0,1) 100%)'
            }}
        >
            {/* Title */}
            <div className="w-full text-center mb-8">
                <div className="text-2xl font-bold text-white border-b border-white/20 pb-2 inline-block">
                    {launchMode ? "$UBC Contender Swarm" : "$UBC Top Gainer Swarm"}
                </div>
            </div>

            {/* Logo container */}
            <div className="flex-1 flex items-center justify-center w-full mb-8">
                <div className="relative">
                    {/* Glow effect */}
                    <div 
                        className="absolute inset-0 rounded-full opacity-75"
                        style={{
                            background: 'radial-gradient(circle, rgba(234,179,8,0.3) 0%, rgba(234,179,8,0) 70%)',
                            transform: 'scale(1.5)',
                            filter: 'blur(20px)'
                        }}
                    />
                    <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-yellow-400/50">
                        <Image
                            src={image}
                            alt={name}
                            width={144}
                            height={144}
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Name */}
            <div className="text-2xl font-bold text-yellow-400 text-center mb-8">
                {name}
            </div>

            {/* Multiple or Launching Today */}
            <div className="flex flex-col items-center gap-2 mb-12">
                {launchMode ? (
                    <div className="text-5xl font-bold text-white text-center">
                        Launching Today
                    </div>
                ) : (
                    <>
                        <div className="text-7xl font-bold text-white text-center">
                            {multiple}x
                        </div>
                        <div className="text-gray-400 text-base font-medium">
                            24 hour performance
                        </div>
                    </>
                )}
            </div>

            {/* Bottom section with UBC Logo and Price */}
            <div className="w-full flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8">
                        <Image
                            src="/White on transparent.png"
                            alt="UBC Logo"
                            width={32}
                            height={32}
                            className="opacity-75"
                        />
                    </div>
                    <span className="text-[#7dd3fc] text-lg font-medium opacity-75">UBC</span>
                </div>

                <div className="text-xl font-medium text-green-400">
                    ${priceInUSD}
                </div>
            </div>

            {/* Grid overlay */}
            <div 
                className="absolute inset-0 mix-blend-overlay pointer-events-none rounded-2xl"
                style={{
                    backgroundImage: `
                        linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '4px 4px'
                }}
            />
        </div>
    );
};
