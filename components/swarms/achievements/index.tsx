import { Achievement } from "../swarm.types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import { cn } from "@/lib/utils";

interface AchievementsProps {
    achievements: Achievement[];
    className?: string;
}

export function Achievements({ achievements, className }: AchievementsProps) {
    return (
        <div className={cn("flex flex-wrap gap-2", className)}>
            {achievements.map((achievement) => (
                <TooltipProvider key={achievement.id}>
                    <Tooltip>
                        <TooltipTrigger>
                            <div 
                                className={cn(
                                    "px-3 py-1 text-sm rounded-md",
                                    "bg-blue-500/10 text-blue-500",
                                    "hover:bg-blue-500/20 transition-colors",
                                    "cursor-help"
                                )}
                            >
                                {achievement.name}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="max-w-xs text-sm">{achievement.description}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
        </div>
    );
}
