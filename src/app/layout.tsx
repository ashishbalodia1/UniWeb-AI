import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'UniWeb AI - The Future of AI Interaction',
  description:
    'Enterprise-grade all-in-one AI platform. Chat, Voice, Avatar, and Deep Analysis unified.',
  keywords: [
    'AI',
    'artificial intelligence',
    'chat',
    'voice AI',
    'avatar',
    'analysis',
    'enterprise AI',
  ],
  authors: [{ name: 'UniWeb AI Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#0ea5e9',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-neutral-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
