const STORAGE_KEY = 'editor-content';
const PANEL_STATE_KEY = 'editor-panel-state';

function contentKey(videoId?: string) {
  return videoId ? `${STORAGE_KEY}-${videoId}` : STORAGE_KEY;
}

export interface PanelState {
  width: number;
  isExpanded: boolean;
  isPinned: boolean;
}

const DEFAULT_PANEL_STATE: PanelState = {
  width: 550,
  isExpanded: false,
  isPinned: false,
};

export function getStoredContent(videoId?: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(contentKey(videoId));
}

export function saveContent(content: string, videoId?: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(contentKey(videoId), content);
}

export function clearStoredContent(videoId?: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(contentKey(videoId));
}

export function getPanelState(): PanelState {
  if (typeof window === 'undefined') return DEFAULT_PANEL_STATE;
  try {
    const stored = localStorage.getItem(PANEL_STATE_KEY);
    if (!stored) return DEFAULT_PANEL_STATE;
    return { ...DEFAULT_PANEL_STATE, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PANEL_STATE;
  }
}

export function savePanelState(state: Partial<PanelState>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getPanelState();
    localStorage.setItem(PANEL_STATE_KEY, JSON.stringify({ ...current, ...state }));
  } catch (error) {
    console.error('Failed to save panel state:', error);
  }
}

export { STORAGE_KEY, PANEL_STATE_KEY };
