import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import SwRegister from '@/components/swRegister';
import { ThemeProvider } from '@/lib/themeContext';
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before paint to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem('theme');const p=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.classList.toggle('dark',(t??p)==='dark')}catch{}`,
          }}
        />
      </head>
      <body className={`${inter.variable} h-screen antialiased bg-[#eaecf4] dark:bg-[#0c0d12]`}>
        <SwRegister />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
