import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import SwRegister from '@/components/swRegister';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Mindful Tube',
  description: 'Watch YouTube videos distraction-free and get back to work.',
  manifest: '/manifest.json',
  themeColor: '#f97316',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mindful Tube',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} container mx-auto h-screen antialiased`}>
        <SwRegister />
        {children}
      </body>
    </html>
  );
}
