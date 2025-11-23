"use client";

import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import {
    ACHIEVEMENTS,
    LOCAL_STORAGE_ACHIEVEMENTS_KEY,
    type AchievementId
} from '@/components/cli/constants';

export function useAchievements() {
    const [unlockedAchievements, setUnlockedAchievements] = useState<AchievementId[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_ACHIEVEMENTS_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setUnlockedAchievements(parsed);
                }
            } catch (e) {
                console.error("Failed to parse achievements from localStorage", e);
            }
        }
    }, []);

    const unlockAchievement = (id: AchievementId) => {
        if (!unlockedAchievements.includes(id)) {
            const newUnlocked = [...unlockedAchievements, id];
            setUnlockedAchievements(newUnlocked);
            localStorage.setItem(LOCAL_STORAGE_ACHIEVEMENTS_KEY, JSON.stringify(newUnlocked));

            const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === id);

            if (achievement) {
                toast({
                    title: "🏆 Achievement Unlocked!",
                    description: `${achievement.title}: ${achievement.description}`,
                    variant: "default", // You might want a custom variant for achievements if available
                    className: "border-accent text-accent bg-background", // Custom styling to match CLI theme
                });
            }
        }
    };

    return { unlockedAchievements, unlockAchievement, ACHIEVEMENTS };
}
