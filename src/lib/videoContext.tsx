'use client';

import { createContext, useContext, useRef, useCallback, useState } from 'react';

export interface PlaylistInfo {
  index: number;  // 0-based
  total: number;
}

interface VideoContextValue {
  registerGetTime: (fn: () => number) => void;
  getCurrentTime: () => number;
  registerSeekTo: (fn: (seconds: number) => void) => void;
  seekTo: (seconds: number) => void;
  registerNextVideo: (fn: () => void) => void;
  nextVideo: () => void;
  registerPrevVideo: (fn: () => void) => void;
  prevVideo: () => void;
  playlist: PlaylistInfo | null;
  setPlaylist: (info: PlaylistInfo | null) => void;
}

const VideoContext = createContext<VideoContextValue | null>(null);

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const getTimeFnRef = useRef<(() => number) | null>(null);
  const seekToFnRef = useRef<((seconds: number) => void) | null>(null);
  const nextVideoFnRef = useRef<(() => void) | null>(null);
  const prevVideoFnRef = useRef<(() => void) | null>(null);
  const [playlist, setPlaylist] = useState<PlaylistInfo | null>(null);

  const registerGetTime = useCallback((fn: () => number) => {
    getTimeFnRef.current = fn;
  }, []);

  const getCurrentTime = useCallback(() => {
    return getTimeFnRef.current?.() ?? 0;
  }, []);

  const registerSeekTo = useCallback((fn: (seconds: number) => void) => {
    seekToFnRef.current = fn;
  }, []);

  const seekTo = useCallback((seconds: number) => {
    seekToFnRef.current?.(seconds);
  }, []);

  const registerNextVideo = useCallback((fn: () => void) => {
    nextVideoFnRef.current = fn;
  }, []);

  const nextVideo = useCallback(() => {
    nextVideoFnRef.current?.();
  }, []);

  const registerPrevVideo = useCallback((fn: () => void) => {
    prevVideoFnRef.current = fn;
  }, []);

  const prevVideo = useCallback(() => {
    prevVideoFnRef.current?.();
  }, []);

  return (
    <VideoContext.Provider value={{ registerGetTime, getCurrentTime, registerSeekTo, seekTo, registerNextVideo, nextVideo, registerPrevVideo, prevVideo, playlist, setPlaylist }}>
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

// Parse "1:23" or "1:23:45" back to seconds
export function parseTimestamp(ts: string): number {
  const parts = ts.split(':').map(Number);
  if (parts.some(isNaN)) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}
