'use client';

import { useEffect, useState } from 'react';

function getTimeLeft(targetDate: Date) {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
}

export function Countdown() {
    // January 22, 2025, 6:00 PM EST
    const targetDate = new Date('2025-01-22T23:00:00.000Z'); // 6PM EST in UTC
    const [mounted, setMounted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

    // Handle mounting separately
    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle timer updates in a separate effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeLeft(targetDate));
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    // Only show countdown after component mounts on client
    if (!mounted) {
        return null;
    }

    return (
        <div className="flex flex-col items-center gap-4 mt-8">
            <div className="text-xl text-muted-foreground">Launch in</div>
            <div className="flex gap-6">
                <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold text-white">{timeLeft.days}</div>
                    <div className="text-sm text-muted-foreground mt-1">Days</div>
                </div>
                <div className="text-4xl font-bold text-white self-start">:</div>
                <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold text-white">{timeLeft.hours.toString().padStart(2, '0')}</div>
                    <div className="text-sm text-muted-foreground mt-1">Hours</div>
                </div>
                <div className="text-4xl font-bold text-white self-start">:</div>
                <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold text-white">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                    <div className="text-sm text-muted-foreground mt-1">Minutes</div>
                </div>
                <div className="text-4xl font-bold text-white self-start">:</div>
                <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold text-white">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                    <div className="text-sm text-muted-foreground mt-1">Seconds</div>
                </div>
            </div>
        </div>
    );
}
