'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Slider } from "@/components/shadcn/slider";
import { useState } from 'react';

// Helper function to calculate amount raised by integrating the price curve
function calculateAmountRaised(supply: number) {
    const maxSupply = 100000;
    const x = supply / maxSupply;
    
    // Integral of P(x) = 1 + 999 * (0.4 * x + 0.6 * x^1.8)
    const integral = x + 999 * (0.4 * Math.pow(x, 2)/2 + 0.6 * Math.pow(x, 2.8)/2.8);
    
    return integral * maxSupply;
}

function formatNumber(num: number) {
    if (!num && num !== 0) return '0'; // Handle undefined/null cases
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
    
    // Generate points every 500 shares for a smooth curve
    for (let supply = 0; supply <= maxSupply; supply += 500) {
        // Normalize supply to [0,1] range
        const x = supply / maxSupply;
        
        // Calculate price using P(x) = 1 + 999 * (0.4 * x + 0.6 * x^1.8)
        const basePrice = 1 + 999 * (0.4 * x + 0.6 * Math.pow(x, 1.8));
        
        // Add sinusoidal volatility
        const volatilityFactor = 0.30; // 30% volatility
        const cycleLength = 5000; // Complete cycle every 5k shares
        const volatility = Math.sin((2 * Math.PI * supply) / cycleLength) * volatilityFactor;
        
        // Calculate market price with volatility
        const marketPrice = basePrice * (1 + volatility);
        
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
                                            <div>Amount Raised: {formatNumber(amountRaised)} $COMPUTE</div>
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
                    onValueChange={(value) => setSharesSold(value[0])}
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
