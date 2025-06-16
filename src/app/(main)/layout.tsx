
// Removed Header and Footer imports and components

// Import global styles
import '../globals.css';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      {/* This div ensures the layout container takes full height and hides its own overflow */}
      <div className="flex flex-col h-screen bg-background text-foreground font-mono overflow-hidden">
        {/* The main content area is now flex-grow to fill available space */}
        {/* We keep overflow-auto here so the content *within* main can scroll if it exceeds the main area's height */}
        <main className="flex-grow overflow-auto">
          {children}
        </main>
      </div>
    </>
  );
}

    