'use client';

import { useEffect, useState, useMemo } from 'react';

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
    // Define both target dates for 2025
    const dates = useMemo(() => ({
        launchpadDate: new Date('2025-01-22T18:00:00.000Z'), // January 22, 2025, 1PM EST (18:00 UTC)
        computeDate: new Date('2025-01-22T23:00:00.000Z')    // January 22, 2025, 6PM EST
    }), []);
    
    const [mounted, setMounted] = useState(false);
    const [launchpadTimeLeft, setLaunchpadTimeLeft] = useState(getTimeLeft(dates.launchpadDate));
    const [computeTimeLeft, setComputeTimeLeft] = useState(getTimeLeft(dates.computeDate));

    // Handle mounting separately
    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle timer updates in a separate effect
    useEffect(() => {
        const timer = setInterval(() => {
            setLaunchpadTimeLeft(getTimeLeft(dates.launchpadDate));
            setComputeTimeLeft(getTimeLeft(dates.computeDate));
        }, 1000);

        return () => clearInterval(timer);
    }, [dates]);

    // Only show countdown after component mounts on client
    if (!mounted) {
        return null;
    }

    const TimeDisplay = ({ timeLeft, label }: { timeLeft: { days: number, hours: number, minutes: number, seconds: number }, label: string | JSX.Element }) => (
        <div className="flex flex-col items-center gap-4 mt-8">
            <div className="text-xl text-muted-foreground">{label}</div>
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

    return (
        <div className="flex flex-col gap-8">
            <TimeDisplay timeLeft={launchpadTimeLeft} label="Launchpad Launch" />
            <TimeDisplay 
                timeLeft={computeTimeLeft} 
                label={<>
                    <span className="metallic-text">$COMPUTE</span> Launch
                </>} 
            />
        </div>
    );
}
