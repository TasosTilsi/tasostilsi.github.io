"use client";

import React from 'react';
import UniversalModal from './UniversalModal';
import { ACHIEVEMENTS, type AchievementId, type AchievementCategory, type Achievement } from './constants';

interface AchievementsModalProps {
    isOpen: boolean;
    onClose: () => void;
    unlockedAchievements: AchievementId[];
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
    isOpen,
    onClose,
    unlockedAchievements
}) => {
    const total = Object.keys(ACHIEVEMENTS).length;
    const unlockedCount = unlockedAchievements.length;
    const percentage = Math.round((unlockedCount / total) * 100);

    // Group achievements by category
    const achievementsByCategory: Record<AchievementCategory, Achievement[]> = {
        exploration: [],
        discovery: [],
        engagement: [],
        social: []
    };

    Object.values(ACHIEVEMENTS).forEach(achievement => {
        achievementsByCategory[achievement.category].push(achievement);
    });

    const categoryNames: Record<AchievementCategory, string> = {
        exploration: 'EXPLORATION',
        discovery: 'DISCOVERY',
        engagement: 'ENGAGEMENT',
        social: 'SOCIAL & COMMUNITY'
    };

    const getCategoryProgress = (category: AchievementCategory) => {
        const categoryAchievements = achievementsByCategory[category];
        const unlocked = categoryAchievements.filter(a => unlockedAchievements.includes(a.id)).length;
        return `${unlocked}/${categoryAchievements.length}`;
    };

    return (
        <UniversalModal
            isOpen={isOpen}
            onClose={onClose}
            title={`All Achievements (${unlockedCount}/${total})`}
            description={`You've unlocked ${percentage}% of all achievements`}
            iframeUrl=""
            externalUrl=""
        >
            <div className="flex flex-col gap-6 p-6">
                {/* Progress Bar */}
                <div className="flex items-center gap-4">
                    <div className="flex-grow h-4 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-accent transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <span className="text-accent font-mono text-sm">{percentage}%</span>
                </div>

                {/* Achievements by Category */}
                {(Object.keys(achievementsByCategory) as AchievementCategory[]).map(category => {
                    const achievements = achievementsByCategory[category];
                    if (achievements.length === 0) return null;

                    return (
                        <div key={category} className="flex flex-col gap-3">
                            {/* Category Header */}
                            <div className="flex items-center justify-between">
                                <h3 className="text-accent font-bold text-sm">
                                    {categoryNames[category]}
                                </h3>
                                <span className="text-muted-foreground text-xs">
                                    {getCategoryProgress(category)}
                                </span>
                            </div>
                            <div className="border-b border-accent/30"></div>

                            {/* Category Achievements */}
                            <div className="space-y-2">
                                {achievements.map(achievement => {
                                    const isUnlocked = unlockedAchievements.includes(achievement.id);
                                    return (
                                        <div
                                            key={achievement.id}
                                            className={`flex items-start gap-3 p-3 rounded border transition-all ${isUnlocked
                                                    ? 'border-accent/30 bg-accent/5'
                                                    : 'border-muted-foreground/20 opacity-60'
                                                }`}
                                        >
                                            <span className="text-xl flex-shrink-0">
                                                {isUnlocked ? '🏆' : '🔒'}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`font-semibold text-sm ${isUnlocked ? 'text-accent' : 'text-muted-foreground'
                                                    }`}>
                                                    {achievement.title}
                                                </h4>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {isUnlocked ? achievement.description : '???'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </UniversalModal>
    );
};
