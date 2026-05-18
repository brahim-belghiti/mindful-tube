const HISTORY_KEY = 'watch-history';
const MAX_ENTRIES = 10;

export interface HistoryEntry {
  videoId: string;
  watchedAt: number;
  title?: string;
}

export function getWatchHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function recordWatch(videoId: string, title?: string): void {
  if (typeof window === 'undefined' || !videoId) return;
  try {
    const history = getWatchHistory().filter((e) => e.videoId !== videoId);
    history.unshift({ videoId, watchedAt: Date.now(), title });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_ENTRIES)));
  } catch {}
}

export function clearWatchHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
}
