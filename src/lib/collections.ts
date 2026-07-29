const COLLECTIONS_KEY = 'collections';
const CHANGE_EVENT = 'collections-changed';

export interface CollectionItem {
  videoId: string;
  addedAt: number;
  title?: string;
}

export interface Collection {
  id: string;
  name: string;
  items: CollectionItem[];
  createdAt: number;
  updatedAt: number;
}

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

function isCollection(value: unknown): value is Collection {
  if (typeof value !== 'object' || value === null) return false;
  const c = value as Partial<Collection>;
  return typeof c.id === 'string' && typeof c.name === 'string' && Array.isArray(c.items);
}

export function getCollections(): Collection[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(COLLECTIONS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(isCollection) : [];
  } catch {
    return [];
  }
}

export function getCollection(id: string): Collection | null {
  return getCollections().find((c) => c.id === id) ?? null;
}

function persist(collections: Collection[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {}
}

/** Applies `fn` to the collection with `id` and persists the result. */
function update(id: string, fn: (c: Collection) => Collection): Collection | null {
  const collections = getCollections();
  const index = collections.findIndex((c) => c.id === id);
  if (index === -1) return null;
  const updated = { ...fn(collections[index]), updatedAt: Date.now() };
  collections[index] = updated;
  persist(collections);
  return updated;
}

export function createCollection(name: string): Collection {
  const now = Date.now();
  const collection: Collection = {
    id: newId(),
    name: name.trim() || 'Untitled list',
    items: [],
    createdAt: now,
    updatedAt: now,
  };
  persist([...getCollections(), collection]);
  return collection;
}

export function renameCollection(id: string, name: string): void {
  const trimmed = name.trim();
  if (!trimmed) return;
  update(id, (c) => ({ ...c, name: trimmed }));
}

export function deleteCollection(id: string): void {
  persist(getCollections().filter((c) => c.id !== id));
}

export function addToCollection(id: string, videoId: string, title?: string): void {
  if (!videoId) return;
  update(id, (c) =>
    c.items.some((i) => i.videoId === videoId)
      ? c
      : { ...c, items: [...c.items, { videoId, addedAt: Date.now(), title }] }
  );
}

export function removeFromCollection(id: string, videoId: string): void {
  update(id, (c) => ({ ...c, items: c.items.filter((i) => i.videoId !== videoId) }));
}

/** Fills in a title we only learned about after the video was added. */
export function setItemTitle(id: string, videoId: string, title: string): void {
  if (!title) return;
  update(id, (c) => ({
    ...c,
    items: c.items.map((i) => (i.videoId === videoId ? { ...i, title } : i)),
  }));
}

export function moveItem(id: string, from: number, to: number): void {
  update(id, (c) => {
    if (from === to || from < 0 || from >= c.items.length) return c;
    const items = [...c.items];
    const [moved] = items.splice(from, 1);
    items.splice(Math.max(0, Math.min(to, items.length)), 0, moved);
    return { ...c, items };
  });
}

export function collectionsContaining(videoId: string): string[] {
  return getCollections()
    .filter((c) => c.items.some((i) => i.videoId === videoId))
    .map((c) => c.id);
}

/** Subscribe to any change made through this module (same-tab only). */
export function onCollectionsChange(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(CHANGE_EVENT, listener);
  return () => window.removeEventListener(CHANGE_EVENT, listener);
}

export { COLLECTIONS_KEY, CHANGE_EVENT };
