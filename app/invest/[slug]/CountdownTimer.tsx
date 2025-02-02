'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
    launchDate: string | Date;
}

export function CountdownTimer({ launchDate }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(launchDate).getTime() - Date.now();
            
            if (difference <= 0) {
                setTimeLeft(null);
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [launchDate]);

    if (!timeLeft) return null;

    return (
        <div className="p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-6 text-center">Launch Countdown</h3>
            <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                    <div className="text-2xl font-bold">{timeLeft.days}</div>
                    <div className="text-sm text-muted-foreground">Days</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold">{timeLeft.hours}</div>
                    <div className="text-sm text-muted-foreground">Hours</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                    <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                    <div className="text-sm text-muted-foreground">Seconds</div>
                </div>
            </div>
        </div>
    );
}
