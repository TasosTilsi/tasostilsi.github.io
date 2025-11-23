'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
    const [command, setCommand] = useState('');
    const [showCursor, setShowCursor] = useState(true);

    const fullCommand = 'cd /home';

    useEffect(() => {
        // Typing animation
        let index = 0;
        const typingInterval = setInterval(() => {
            if (index <= fullCommand.length) {
                setCommand(fullCommand.slice(0, index));
                index++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100);

        // Cursor blinking
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);

        return () => {
            clearInterval(typingInterval);
            clearInterval(cursorInterval);
        };
    }, []);

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-background font-mono">
            <div className="max-w-2xl w-full px-6">
                {/* Terminal header */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-destructive"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-muted-foreground text-sm">terminal — 404</span>
                </div>

                {/* Error content */}
                <div className="space-y-4">
                    {/* Command that failed */}
                    <div className="flex items-center gap-2">
                        <span className="text-accent">$</span>
                        <span className="text-foreground">cat /page/not/found</span>
                    </div>

                    {/* Error message */}
                    <div className="pl-4 space-y-2">
                        <p className="text-destructive">
                            cat: /page/not/found: No such file or directory
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Error 404: The page you're looking for doesn't exist.
                        </p>
                    </div>

                    {/* ASCII Art */}
                    <pre className="text-accent text-xs leading-tight opacity-50 my-6">
                        {`    _  _    ___  _  _   
   | || |  / _ \\| || |  
   | || |_| | | | || |_ 
   |__   _| | | |__   _|
      | | | |_| |  | |  
      |_|  \\___/   |_|  `}
                    </pre>

                    {/* Suggestions */}
                    <div className="space-y-2 mt-6">
                        <div className="flex items-center gap-2">
                            <span className="text-primary">›</span>
                            <span className="text-foreground">Available commands:</span>
                        </div>

                        <div className="pl-6 space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-accent">$</span>
                                <span className="text-foreground">{command}</span>
                                {showCursor && <span className="blinking-cursor"></span>}
                            </div>

                            <div className="flex items-center gap-2 opacity-70">
                                <span className="text-accent">$</span>
                                <span className="text-muted-foreground">help</span>
                            </div>

                            <div className="flex items-center gap-2 opacity-50">
                                <span className="text-accent">$</span>
                                <span className="text-muted-foreground">ls -la</span>
                            </div>
                        </div>
                    </div>

                    {/* Action button */}
                    <div className="mt-8 pt-6 border-t border-border">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded hover:opacity-90 transition-opacity"
                        >
                            <span className="text-sm">←</span>
                            <span>Return to Terminal</span>
                        </Link>
                    </div>

                    {/* Footer hint */}
                    <div className="mt-6 text-xs text-muted-foreground">
                        <p>Tip: Type 'help' in the terminal to see all available commands</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
