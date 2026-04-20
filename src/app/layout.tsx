import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { BRAND_NAME } from '@/lib/seed';

export const metadata: Metadata = {
  title: `${BRAND_NAME} — Ad Decisioning Platform`,
  description: 'AI-powered ad decision engine. Scale winners. Kill losers. Stop guessing.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex" style={{ background: 'var(--bg)' }}>
        <Sidebar />
        <div className="flex-1 ml-56 min-h-screen flex flex-col">
          <TopBar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
