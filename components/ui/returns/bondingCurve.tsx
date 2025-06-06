'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Slider } from "@/components/shadcn/slider";
import { useState } from 'react';

function calculatePrice(supply: number, maxSupply: number = 100000) {
    // Normalize x to be between 0 and 1
    const x = supply / maxSupply;
    // Base formula: P(x) = 1 + 999 * (0.4 * x + 0.6 * x^1.8)
    const basePrice = 1 + 999 * (0.4 * x + 0.6 * Math.pow(x, 1.8));
    
    // Apply the cyclical variation
    // const cycle = Math.floor(supply / 5000);
    const position = supply % 5000;
    
    let multiplier;
    if (position <= 1250) {
        multiplier = 1 + (0.30 * position / 1250);
    } else if (position <= 2500) {
        multiplier = 1.30 - (0.30 * (position - 1250) / 1250);
    } else if (position <= 3750) {
        multiplier = 1 - (0.30 * (position - 2500) / 1250);
    } else {
        multiplier = 0.70 + (0.30 * (position - 3750) / 1250);
    }
    
    return basePrice * multiplier;
}

// Helper function to calculate amount raised by integrating the price curve
function calculateAmountRaised(supply: number) {
    let total = 0;
    const stepSize = 100; // Smaller steps for more accurate integration
    
    for (let i = 0; i < supply; i += stepSize) {
        const price = calculatePrice(i);
        total += price * stepSize;
    }
    
    return total;
}

function formatNumber(num: number) {
    if (num === undefined || num === null) return '0'; // Handle undefined/null cases
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(0);
}

function generateBondingCurveData() {
    const data = [];
    const maxSupply = 100000;
    
    for (let supply = 0; supply <= maxSupply; supply += 100) {
        const marketPrice = calculatePrice(supply, maxSupply);
        data.push({
            supply,
            marketPrice: Number(marketPrice.toFixed(2))
        });
    }
    return data;
}

export function BondingCurve() {
    const [sharesSold, setSharesSold] = useState(50000); // Set a default value
    const curveData = generateBondingCurveData();
    
    // Find current values based on shares sold
    const currentDataPoint = curveData.find(point => point.supply >= sharesSold) || curveData[0];
    const currentPrice = currentDataPoint?.marketPrice || 0;

    return (
        <div className="space-y-6">
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={curveData}
                        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                    >
                        <Line 
                            type="monotone" 
                            dataKey="marketPrice" 
                            stroke="#22c55e" 
                            strokeWidth={2}
                            dot={false}
                            name="Market Price"
                        />
                        {/* Current position dot */}
                        <Line
                            data={[{ supply: sharesSold, marketPrice: currentPrice }]}
                            type="monotone"
                            dataKey="marketPrice"
                            stroke="none"
                            dot={{ r: 4, fill: "#ef4444" }}
                        />
                        <XAxis 
                            dataKey="supply" 
                            tickFormatter={(value) => `${(value/1000).toFixed(0)}k`}
                            domain={[0, 100000]}
                            type="number"
                        />
                        <YAxis 
                            tickFormatter={(value) => `${formatNumber(value)} $C`}
                            domain={[0, 1250]}
                            allowDataOverflow={false}
                        />
                        <Tooltip 
                            formatter={(value, name) => {
                                if (name === "marketPrice") {
                                    const marketCap = Number(value) * Number(sharesSold);
                                    const amountRaised = calculateAmountRaised(sharesSold);
                                    return [
                                        <div key="tooltip-content">
                                            <div>Price: {formatNumber(Number(value))} $COMPUTE</div>
                                            <div>Market Cap: {formatNumber(marketCap)} $COMPUTE</div>
                                            <div>Swarm Raised: {formatNumber(amountRaised)} $COMPUTE</div>
                                        </div>,
                                        null
                                    ];
                                }
                                return null;
                            }}
                            contentStyle={{ color: '#22c55e' }}
                            labelFormatter={(label) => <span className="text-[#3b82f6]">Supply: {formatNumber(Number(label))} shares</span>}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Shares Sold Slider */}
            <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                    <span className="font-medium">Shares Sold</span>
                    <span className="text-muted-foreground">{formatNumber(sharesSold)} shares</span>
                </div>
                <Slider
                    defaultValue={[50000]}
                    min={1}
                    max={100000}
                    step={1000}
                    onValueChange={(value: number[]) => setSharesSold(value[0])}
                    className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>50K</span>
                    <span>100K</span>
                </div>
            </div>

            {/* Price, Market Cap, and Amount Raised Display */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Price per Share</span>
                        <span className="text-lg font-bold text-[#22c55e]">
                            {currentPrice.toFixed(2)} $COMPUTE
                        </span>
                    </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Market Cap</span>
                        <span className="text-lg font-bold text-[#22c55e]">
                            {formatNumber(currentPrice * sharesSold)} $COMPUTE
                        </span>
                    </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Amount Raised</span>
                        <span className="text-lg font-bold text-[#22c55e]">
                            {formatNumber(calculateAmountRaised(sharesSold))} $COMPUTE
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
