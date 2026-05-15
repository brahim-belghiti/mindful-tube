'use client';

import { VideoProvider } from '@/lib/videoContext';

export default function FocusLayout({ children }: { children: React.ReactNode }) {
  return <VideoProvider>{children}</VideoProvider>;
}
