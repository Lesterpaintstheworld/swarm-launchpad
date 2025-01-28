'use client';
import { useState } from 'react';
import Image from 'next/image';
import { SwarmGainCard } from '@/components/swarms/gainCard';
import { previews } from '@/data/swarms/previews';
import { captureCards } from '@/utils/captureCards';
import { exportCards } from '@/utils/exportCards';
import { getSwarmUsingId } from "@/data/swarms/info";

export default function SwarmGainersPage() {
    const [captures, setCaptures] = useState<string[]>([]);
    const [isCapturing, setIsCapturing] = useState(false);

    const handleCapture = async () => {
        setIsCapturing(true);
        try {
            const newCaptures = await captureCards('.swarm-card');
            setCaptures(newCaptures);
        } finally {
            setIsCapturing(false);
        }
    };

    const handleDownloadAll = async () => {
        setIsCapturing(true);
        try {
            await exportCards('.swarm-card');
        } finally {
            setIsCapturing(false);
        }
    };
    const gainers = previews
        .filter(swarm => {
            const swarmInfo = getSwarmUsingId(swarm.id);
            return swarmInfo && swarmInfo.multiple > 1;
        })
        .map(swarm => {
            const swarmInfo = getSwarmUsingId(swarm.id);
            return {
                name: swarm.name,
                value: swarmInfo?.multiple || 1,
                image: swarm.image
            };
        })
        .sort((a, b) => b.value - a.value) // Sort by multiple in descending order
        .slice(0, 10); // Take top 10 gainers

    return (
        <div className="min-h-screen bg-black relative">
            {/* Background image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/site image-modified.jpg"
                    alt="Background"
                    fill
                    className="object-cover opacity-15"
                />
            </div>

            {/* Content container */}
            <div className="relative z-10 p-8 pt-24 flex flex-col items-center">
                {/* Logo UBC */}
                <div className="absolute top-8 right-8 flex items-center gap-3">
                    <Image
                        src="/White on transparent.png"
                        alt="UBC Logo"
                        width={60}
                        height={60}
                        className="opacity-50"
                    />
                    <span className="text-white/50 text-2xl font-bold">UBC</span>
                </div>

                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-yellow-400 mb-2">$UBC Top Gainer Swarms</h1>
                    <h2 className="text-3xl font-bold text-white">Last 24 Hours</h2>
                </div>

                {/* Graph section */}
                <div className="flex items-end gap-4 h-[400px] mb-16">
                    {gainers.map((gainer) => (
                        <div key={gainer.name} className="flex flex-col items-center w-28">
                            <div className="text-white font-bold text-2xl mb-2">
                                {gainer.value}x
                            </div>
                            
                            <div className="relative w-16">
                                <div 
                                    className="w-full bg-gradient-to-t from-yellow-600 to-yellow-400 
                                              rounded-t-sm backdrop-blur-sm overflow-hidden"
                                    style={{ height: `${gainer.value * 12}px` }}
                                >
                                    <div 
                                        className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] 
                                                  bg-[size:4px_4px] mix-blend-overlay"
                                    />
                                    
                                    <div className="absolute inset-0 bg-yellow-400/20">
                                        <div className="h-full w-full animate-pulse bg-gradient-to-t from-transparent to-yellow-400/30" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-4 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400/50 bg-white">
                                    <Image
                                        src={gainer.image}
                                        alt={gainer.name}
                                        width={64}
                                        height={64}
                                        className="object-cover"
                                    />
                                </div>
                                <div className="text-yellow-400 text-base font-medium mt-2 text-center leading-tight min-h-[40px]">
                                    {gainer.name}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="fixed bottom-8 right-8 z-50 flex gap-4">
                    <button
                        onClick={handleDownloadAll}
                        disabled={isCapturing}
                        className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50"
                    >
                        {isCapturing ? 'Downloading...' : 'Download All'}
                    </button>
                    <button
                        onClick={handleCapture}
                        disabled={isCapturing}
                        className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50"
                    >
                        {isCapturing ? 'Capturing...' : 'Capture Cards'}
                    </button>
                </div>

                {/* Display captures */}
                {captures.length > 0 && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black/80 z-50 overflow-auto p-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex justify-end mb-4">
                                <button 
                                    onClick={() => setCaptures([])}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                                >
                                    Close
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                {captures.map((capture, index) => (
                                    <div key={index} className="relative">
                                        <img 
                                            src={capture} 
                                            alt={`Captured card ${index + 1}`}
                                            className="w-full rounded-xl"
                                        />
                                        <button
                                            onClick={() => {
                                                const link = document.createElement('a');
                                                link.download = `swarm-${index + 1}.png`;
                                                link.href = capture;
                                                link.click();
                                            }}
                                            className="absolute top-4 right-4 px-4 py-2 bg-yellow-400 text-black rounded-lg"
                                        >
                                            Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Cards grid */}
                <div className="grid grid-cols-2 gap-16 mt-40 max-w-[2000px] mx-auto">
                    {previews.map((swarm) => (
                        <SwarmGainCard
                            key={swarm.id}
                            name={swarm.name}
                            multiple={gainers.find(g => g.name === swarm.name)?.value || 1}
                            image={swarm.image}
                            className="swarm-card"
                        />
                    ))}
                </div>
            </div>

            {/* Launching Today Cards */}
            <div className="mt-32 text-center mb-16">
                <h2 className="text-5xl font-bold text-yellow-400 mb-2">$UBC Contender Swarms</h2>
                <h3 className="text-3xl font-bold text-white">Launching Today</h3>
            </div>

            {/* Launching Today grid */}
            <div className="grid grid-cols-2 gap-16 max-w-[2000px] mx-auto px-8">
                {previews.map((swarm) => (
                    <SwarmGainCard
                        key={`launch-${swarm.id}`}
                        name={swarm.name}
                        multiple={0}
                        image={swarm.image}
                        launchMode={true}
                        className="swarm-card"
                    />
                ))}
            </div>
        </div>
    );
}
