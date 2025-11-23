import React, { useState, useEffect } from 'react';

interface TypingEffectProps {
    text: string;
    speed?: number;
    delay?: number;
    onComplete?: () => void;
    className?: string;
}

export const TypingEffect: React.FC<TypingEffectProps> = ({
    text,
    speed = 30,
    delay = 0,
    onComplete,
    className = ""
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        // Start typing after delay
        if (!hasStarted) {
            const startTimeout = setTimeout(() => {
                setHasStarted(true);
                setIsTyping(true);
            }, delay);
            return () => clearTimeout(startTimeout);
        }
    }, [delay, hasStarted]);

    useEffect(() => {
        if (hasStarted && currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);

            return () => clearTimeout(timeout);
        } else if (hasStarted && currentIndex >= text.length) {
            setIsTyping(false);
            if (onComplete) {
                onComplete();
            }
        }
    }, [currentIndex, text, speed, onComplete, hasStarted]);

    return (
        <span className={className}>
            {displayedText}
            {isTyping && <span className="animate-pulse">_</span>}
        </span>
    );
};
