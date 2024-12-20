import type { Metadata } from 'next';
import { Inter } from 'next/font/google'
import './globals.css';


const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'mindfull tube',
  description: 'A YouTube client designed to keep you on track.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} container mx-auto lg:py-16 lg:px-16 w-8/12 h-full antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
