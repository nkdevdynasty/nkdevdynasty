export default function UnifiedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4">
        <h1 className="text-xl font-bold">Saraswati Vidya Mandir</h1>
      </header>
      <main className="flex-1 p-4">{children}</main>
      <footer className="bg-muted text-center p-4">
        &copy; 2024 Saraswati Vidya Mandir. All rights reserved.
      </footer>
    </div>
  );
}
