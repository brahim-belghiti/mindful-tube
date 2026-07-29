import { Collection } from './collections';

/** Link into the focus player at a given position of a user-made list. */
export function collectionWatchHref(collection: Collection, index: number): string | null {
  const item = collection.items[index];
  if (!item) return null;
  const params = new URLSearchParams({
    id: item.videoId,
    c: collection.id,
    i: String(index),
  });
  return `/focus?${params.toString()}`;
}

/**
 * The `i` query param is only a hint — the list may have been reordered since
 * the link was built, so trust the video id first and fall back to the hint.
 */
export function resolveIndex(
  collection: Collection,
  videoId: string | undefined,
  hint: string | null
): number {
  if (videoId) {
    const found = collection.items.findIndex((i) => i.videoId === videoId);
    if (found !== -1) return found;
  }
  const parsed = Number(hint);
  if (!Number.isInteger(parsed)) return 0;
  return Math.max(0, Math.min(parsed, collection.items.length - 1));
}
