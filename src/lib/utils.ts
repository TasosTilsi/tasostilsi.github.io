import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isValidUrl = (url: string | undefined | null): url is string => {
  return typeof url === 'string' && url.trim() !== '' && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:'));
};
