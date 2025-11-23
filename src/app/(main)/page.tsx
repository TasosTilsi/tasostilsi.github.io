'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { TerminalLoader } from '@/components/cli/TerminalLoader';

// Dynamically import TerminalInterface with no SSR
const TerminalInterface = dynamic(
  () => import('@/components/cli/TerminalInterface'), {
  ssr: false,
  loading: () => {
    return <TerminalLoader />;
  }
}
);

export default function HomePage() {
  return (
    <main className="h-full w-full bg-background"> {/* Changed min-h-screen to h-full */}
      <Suspense fallback={<TerminalLoader />}><TerminalInterface /></Suspense>
    </main>
  );
}


