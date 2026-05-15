'use client';

import { createContext, useContext, useRef, useCallback } from 'react';

interface VideoContextValue {
  registerGetTime: (fn: () => number) => void;
  getCurrentTime: () => number;
}

const VideoContext = createContext<VideoContextValue | null>(null);

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const getTimeFnRef = useRef<(() => number) | null>(null);

  const registerGetTime = useCallback((fn: () => number) => {
    getTimeFnRef.current = fn;
  }, []);

  const getCurrentTime = useCallback(() => {
    return getTimeFnRef.current?.() ?? 0;
  }, []);

  return (
    <VideoContext.Provider value={{ registerGetTime, getCurrentTime }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideoContext() {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error('useVideoContext must be used inside VideoProvider');
  return ctx;
}

export function formatTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}
