import { cn } from "@/lib/utils";
import { Achievement } from "@/components/swarms/swarm.types";
import { ExternalLink } from "lucide-react";

interface InfoPanelProps {
    className?: string;
    socials?: {
        website?: string;
        twitter?: string;
        telegram?: string;
        telegramChannel?: string;
        discord?: string;
        dexscreener?: string;
    };
    achievements?: Achievement[];
    weeklyRevenuePerShare?: {
        compute: number;
        ubc: number;
    };
}

export function InfoPanel({ className, socials, achievements, weeklyRevenuePerShare }: InfoPanelProps) {
    return (
        <div className={cn("w-full max-w-xs bg-accent-1 rounded-lg p-6", className)}>
            {/* Weekly Revenue Per Share */}
            {weeklyRevenuePerShare && (
                <div className="space-y-3 mb-6">
                    <h4 className="text-lg font-semibold mb-4">Weekly Revenue per 1000 shares</h4>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-white/60">{weeklyRevenuePerShare.compute.toLocaleString()}</span>
                            <span className="text-sm metallic-text">$COMPUTE</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-white/60">{weeklyRevenuePerShare.ubc.toLocaleString()}</span>
                            <span className="text-sm metallic-text-ubc">$UBC</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Social Links */}
            {socials && (
                <div className="space-y-3 mb-6">
                    <h4 className="text-lg font-semibold mb-4">Links</h4>
                    {socials.website && (
                        <a 
                            href={socials.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <ExternalLink size={16} />
                            Website
                        </a>
                    )}
                    {socials.twitter && (
                        <a 
                            href={socials.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <ExternalLink size={16} />
                            X (Twitter)
                        </a>
                    )}
                    {socials.telegram && (
                        <a 
                            href={socials.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <ExternalLink size={16} />
                            Telegram
                        </a>
                    )}
                    {socials.telegramChannel && (
                        <a 
                            href={socials.telegramChannel}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <ExternalLink size={16} />
                            Telegram Channel
                        </a>
                    )}
                    {socials.discord && (
                        <a 
                            href={socials.discord}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <ExternalLink size={16} />
                            Discord
                        </a>
                    )}
                    {socials.dexscreener && (
                        <a 
                            href={socials.dexscreener}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <ExternalLink size={16} />
                            DexScreener
                        </a>
                    )}
                </div>
            )}

            {/* Achievements */}
            {achievements && achievements.length > 0 && (
                <div>
                    <h4 className="text-lg font-semibold mb-4">Achievements</h4>
                    <div className="flex flex-wrap gap-2">
                        {achievements.map((achievement) => (
                            <div 
                                key={achievement.id}
                                className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-md text-sm"
                            >
                                {achievement.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export type { InfoPanelProps };
