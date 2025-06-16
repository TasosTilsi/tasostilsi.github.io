
"use client";

import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
    EASTER_EGG_IDS, 
    EASTER_EGG_NAMES, 
    TOTAL_EASTER_EGGS, 
    LOCAL_STORAGE_EASTER_EGGS_KEY 
} from '@/components/cli/constants';

export function useEasterEggs() {
  const [foundEasterEggs, setFoundEasterEggs] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedEggs = localStorage.getItem(LOCAL_STORAGE_EASTER_EGGS_KEY);
    if (savedEggs) {
      try {
        const parsedEggs = JSON.parse(savedEggs);
        if (Array.isArray(parsedEggs)) {
          setFoundEasterEggs(parsedEggs);
        }
      } catch (e) {
        console.error("Failed to parse foundEasterEggs from localStorage", e);
      }
    }
  }, []);

  const triggerEasterEgg = (eggId: string) => {
    const eggName = EASTER_EGG_NAMES[eggId];
    if (eggName && !foundEasterEggs.includes(eggId)) {
      const newFoundEggs = [...foundEasterEggs, eggId];
      setFoundEasterEggs(newFoundEggs);
      localStorage.setItem(LOCAL_STORAGE_EASTER_EGGS_KEY, JSON.stringify(newFoundEggs));
      toast({
        title: "Easter Egg Found!",
        description: `${eggName}. You've found ${newFoundEggs.length} of ${TOTAL_EASTER_EGGS} discoverable secrets!`,
        variant: "default",
      });
    }
  };

  return { foundEasterEggs, triggerEasterEgg, EASTER_EGG_IDS, EASTER_EGG_NAMES, TOTAL_EASTER_EGGS };
}
