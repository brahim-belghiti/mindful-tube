const STORAGE_KEY = 'editor-content';

export function getStoredContent(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function saveContent(content: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, content);
}

export function clearStoredContent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export { STORAGE_KEY };
