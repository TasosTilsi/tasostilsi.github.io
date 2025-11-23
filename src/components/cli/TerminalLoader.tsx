import React from 'react';

export const TerminalLoader = () => {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-background">
            <div className="font-mono text-foreground">
                <div className="flex flex-col gap-2">
                    {/* Terminal header */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-destructive"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-muted-foreground text-sm">terminal</span>
                    </div>

                    {/* Loading messages with typing animation */}
                    <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-accent">$</span>
                            <span className="typing-animation">Initializing terminal interface...</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-70">
                            <span className="text-primary">›</span>
                            <span className="typing-animation-delayed-1">Loading portfolio data...</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-50">
                            <span className="text-primary">›</span>
                            <span className="typing-animation-delayed-2">Setting up CLI environment...</span>
                        </div>
                    </div>

                    {/* Animated cursor */}
                    <div className="flex items-center gap-2 mt-4">
                        <span className="text-accent">$</span>
                        <div className="blinking-cursor"></div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-6 w-64">
                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-accent loading-bar"></div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes loadingBar {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }

        .typing-animation {
          overflow: hidden;
          white-space: nowrap;
          animation: typing 1s steps(40, end);
        }

        .typing-animation-delayed-1 {
          overflow: hidden;
          white-space: nowrap;
          animation: typing 1s steps(40, end) 0.3s both;
        }

        .typing-animation-delayed-2 {
          overflow: hidden;
          white-space: nowrap;
          animation: typing 1s steps(40, end) 0.6s both;
        }

        .loading-bar {
          animation: loadingBar 2s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};
