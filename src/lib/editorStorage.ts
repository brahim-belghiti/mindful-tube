const STORAGE_KEY = 'editor-content';
const PANEL_STATE_KEY = 'editor-panel-state';

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
