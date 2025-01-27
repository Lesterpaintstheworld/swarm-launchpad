'use client';
import Image from 'next/image';
import { captureElement } from '@/utils/captureElement';

interface SwarmGainCardProps {
    name: string;
    multiple: number;
    image: string;
    className?: string;
    launchMode?: boolean;
}

export const SwarmGainCard = ({ name, multiple, image, className = '', launchMode = false }: SwarmGainCardProps) => {
    const priceInUSD = launchMode ? "0.007" : (multiple * 0.007).toFixed(3);

    const handleCapture = async (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        
        console.log('Starting capture for:', name);
        
        try {
            const element = event.currentTarget;
            
            element.style.transition = 'none';
            element.style.transform = 'none';
            
            const dataUrl = await captureElement(element);
            
            if (dataUrl) {
                console.log('Capture successful, downloading...');
                const link = document.createElement('a');
                link.download = `${name.replace(/\s+/g, '-').toLowerCase()}-card.png`;
                link.href = dataUrl;
                link.click();
            }
            
            setTimeout(() => {
                element.style.transition = '';
                element.style.transform = '';
            }, 100);
            
        } catch (error) {
            console.error('Capture failed:', error);
        }
    };

    return (
        <div 
            className={`export-card w-[500px] h-[500px] bg-[#1a1500] rounded-xl border border-yellow-400/20 p-8 flex flex-col items-center relative overflow-hidden cursor-pointer hover:border-yellow-400/40 transition-colors ${className}`}
            onClick={handleCapture}
            style={{
                display: 'block',
                position: 'relative',
                width: '500px',
                height: '500px'
            }}
        >
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/20 to-transparent" />
            
            {/* Title */}
            <div className="w-full text-center mb-6">
                <div className="text-2xl font-bold text-white border-b border-white/20 pb-2 inline-block">
                    {launchMode ? "$UBC Contender Swarm" : "$UBC Top Gainer Swarm"}
                </div>
            </div>

            {/* Logo container */}
            <div className="flex-1 flex items-center justify-center w-full">
                <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400/20 blur-xl transform scale-110" />
                    <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-yellow-400/50 bg-gradient-to-b from-yellow-400/20 to-transparent backdrop-blur-sm flex items-center justify-center">
                        <div className="relative w-[80%] h-[80%] flex items-center justify-center">
                            <Image
                                src={image}
                                alt={name}
                                width={144}
                                height={144}
                                className="object-contain max-w-full max-h-full"
                                unoptimized
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Name */}
            <div className="text-2xl font-bold text-yellow-400 text-center mb-8">
                {name}
            </div>

            {/* Multiple or Launching Today */}
            <div className="flex flex-col items-center gap-2 mb-auto">
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
            <div className="absolute bottom-8 w-[calc(100%-4rem)] flex justify-between items-center">
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

            {/* Tech pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4px_4px] mix-blend-overlay pointer-events-none" />
        </div>
    );
};
