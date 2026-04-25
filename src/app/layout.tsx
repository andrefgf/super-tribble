import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lumière — Ad Decisioning Platform',
  description: 'AI-powered ad decision engine. Scale winners. Kill losers. Stop guessing.',
};

// Minimal root layout — no sidebar here.
// The (app) route group adds sidebar for dashboard pages.
// The onboarding group gets a clean full-screen layout.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full" style={{ background: 'var(--bg)' }}>
        {children}
      </body>
    </html>
  );
}
