import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lumière — Ad Decisioning Platform',
  description: 'AI-powered ad decision engine. Scale winners. Kill losers. Stop guessing.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${inter.variable} ${fraunces.variable}`}>
      <body className="h-full" style={{ background: 'var(--bg)', fontFamily: 'var(--font)' }}>
        {children}
      </body>
    </html>
  );
}
