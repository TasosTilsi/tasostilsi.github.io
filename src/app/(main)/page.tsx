'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const loadingFallback = (
  <div className="h-screen w-screen flex items-center justify-center bg-background text-foreground">
    <div className="text-lg">Loading terminal interface...</div>
  </div>
);

// Dynamically import TerminalInterface with no SSR
const TerminalInterface = dynamic(
  () => import('@/components/cli/TerminalInterface'), { 
    ssr: false,
    loading:()=>{
      return loadingFallback;
    } 
  }
);

export default function HomePage() {
  return (
    <main className="h-full w-full bg-background"> {/* Changed min-h-screen to h-full */}
      <Suspense fallback={loadingFallback}><TerminalInterface /></Suspense>
    </main>
  );
}

    
