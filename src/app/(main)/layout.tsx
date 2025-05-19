
// Removed Header and Footer imports and components

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-mono">
      <main className="flex-grow p-4 overflow-auto">{children}</main>
    </div>
  );
}

    