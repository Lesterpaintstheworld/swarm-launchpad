'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Slider } from "@/components/shadcn/slider";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function DistributionCharts() {
    const [autonomy, setAutonomy] = useState(50);
    const [weeklyRevenue, setWeeklyRevenue] = useState(1000000); // Default 1M $UBC
    const [userShare, setUserShare] = useState(1); // Default 1%
    const [animatingData, setAnimatingData] = useState(getDistribution(50));

    // Helper function to format numbers with K/M suffixes
    function formatNumber(num: number) {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`;
        }
        return num.toFixed(0);
    }

    // Calculate distribution based on autonomy level
    function getDistribution(autonomyLevel: number) {
        // Calculate shares based on autonomy level (0-100%)
        const autonomyRatio = autonomyLevel / 100;
    
        // As autonomy increases:
        // - UBC Burns stays at 50%
        // - Swarm Team portion decreases from 50% to 0%
        // - Shareholders portion increases from 0% to 50%
        const swarmTeamShare = 50 * (1 - autonomyRatio);  // Decreases with autonomy
        const shareholderShare = 50 * autonomyRatio;      // Increases with autonomy

        return [
            { name: '$UBC Burns', value: 50, color: '#ef4444' },     // Red
            { name: 'Swarm Team', value: swarmTeamShare, color: '#3b82f6' },    // Blue
            { name: 'Shareholders', value: shareholderShare, color: '#22c55e' }  // Green
        ];
    }

    // Animate data changes
    useEffect(() => {
        const targetData = getDistribution(autonomy);
        const animation = setInterval(() => {
            setAnimatingData(current => {
                const newData = current.map((item, i) => {
                    const target = targetData[i] || { value: 0 };
                    const diff = target.value - item.value;
                    const step = diff * 0.1; // Smooth transition speed
                    return {
                        ...item,
                        value: Math.abs(diff) < 0.1 ? target.value : item.value + step
                    };
                });

                // Add new segments if needed
                while (newData.length < targetData.length) {
                    newData.push({ ...targetData[newData.length], value: 0 });
                }

                return newData;
            });
        }, 16); // 60fps

        return () => clearInterval(animation);
    }, [autonomy]);

    return (
        <div className="grid md:grid-cols-2 gap-8 bg-background/40 p-6 rounded-lg max-w-4xl mx-auto">
            {/* Left side - Chart */}
            <div>
                <motion.p 
                    className="font-medium text-foreground mb-2 text-center"
                    key={autonomy}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {autonomy}% Autonomy
                </motion.p>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={animatingData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {animatingData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                    <AnimatePresence mode="wait">
                        {animatingData.map((item, index) => (
                            <motion.div 
                                key={item.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex items-center gap-2"
                            >
                                <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-muted-foreground">
                                    {Math.round(item.value)}% {item.name}
                                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right side - Controls */}
            <div className="space-y-6 flex flex-col justify-center">
                {/* Autonomy Slider */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">Autonomy</span>
                        <span className="text-muted-foreground">{autonomy}%</span>
                    </div>
                    <Slider
                        defaultValue={[50]}
                        max={100}
                        step={1}
                        onValueChange={(value: number[]) => setAutonomy(value[0])}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* Weekly Revenue Slider */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">Weekly Revenue</span>
                        <span className="text-muted-foreground">{formatNumber(weeklyRevenue)} $UBC</span>
                    </div>
                    <Slider
                        defaultValue={[1000000]}
                        max={10000000}
                        step={100000}
                        onValueChange={(value: number[]) => setWeeklyRevenue(value[0])}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0</span>
                        <span>5M</span>
                        <span>10M</span>
                    </div>
                </div>

                {/* Your Share Slider */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">Your Share</span>
                        <span className="text-muted-foreground">{userShare}%</span>
                    </div>
                    <Slider
                        defaultValue={[1]}
                        max={10}
                        step={0.1}
                        onValueChange={(value: number[]) => setUserShare(value[0])}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>5%</span>
                        <span>10%</span>
                    </div>
                </div>

                {/* Revenue Displays */}
                <div className="space-y-3">
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Weekly $UBC Burns</span>
                            <span className="text-lg font-bold text-orange-500">
                                {formatNumber(weeklyRevenue * 0.5)} $UBC
                            </span>
                        </div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Weekly Shareholder Revenue</span>
                            <span className="text-lg font-bold text-orange-500">
                                {formatNumber(weeklyRevenue * (autonomy / 100) * 0.5)} $UBC
                            </span>
                        </div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Your Weekly Revenue</span>
                            <span className="text-lg font-bold text-orange-500">
                                {formatNumber(weeklyRevenue * (autonomy / 100) * 0.5 * (userShare / 100))} $UBC
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
