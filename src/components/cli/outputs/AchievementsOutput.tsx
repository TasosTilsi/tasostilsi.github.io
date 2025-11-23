import React from "react";
import { ACHIEVEMENTS, type AchievementId } from "@/components/cli/constants";

interface AchievementsOutputProps {
    unlockedAchievements: AchievementId[];
}

export const AchievementsOutput: React.FC<AchievementsOutputProps> = ({ unlockedAchievements }) => {
    const total = Object.keys(ACHIEVEMENTS).length;
    const unlockedCount = unlockedAchievements.length;
    const percentage = Math.round((unlockedCount / total) * 100);

    // Get recently unlocked achievements (last 5)
    const recentlyUnlocked = unlockedAchievements
        .slice(-5)
        .reverse()
        .map(id => Object.values(ACHIEVEMENTS).find(a => a.id === id))
        .filter(Boolean);

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div>
                <p className="text-accent font-bold text-lg mb-2">🏆 Recently Unlocked:</p>
                {unlockedCount === 0 && (
                    <p className="text-muted-foreground text-sm">
                        No achievements unlocked yet. Start exploring to unlock achievements!
                    </p>
                )}
            </div>

            {/* Recently Unlocked List */}
            {recentlyUnlocked.length > 0 && (
                <div className="space-y-2">
                    {recentlyUnlocked.map((achievement) => (
                        <div key={achievement!.id} className="flex items-start gap-3">
                            <span className="text-primary min-w-[140px]">
                                ✓ {achievement!.title}
                            </span>
                            <span className="text-muted-foreground">-</span>
                            <span className="text-sm">{achievement!.description}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Progress */}
            <div className="mt-2">
                <p className="text-accent font-semibold mb-2">Progress: {unlockedCount}/{total} unlocked ({percentage}%)</p>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-accent transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            {/* Hint */}
            <div className="mt-2 text-sm text-muted-foreground">
                <p>Type <span className="text-accent">achievements --all</span> to view all achievements</p>
            </div>
        </div>
    );
};
