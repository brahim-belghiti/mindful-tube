import {
  addToCollection,
  collectionsContaining,
  createCollection,
  deleteCollection,
  getCollection,
  getCollections,
  moveItem,
  removeFromCollection,
  renameCollection,
  setItemTitle,
  COLLECTIONS_KEY,
} from '@/lib/collections';
import { collectionWatchHref, resolveIndex } from '@/lib/collectionPlayback';

const ids = (collectionId: string) =>
  getCollection(collectionId)?.items.map((i) => i.videoId) ?? [];

beforeEach(() => {
  localStorage.clear();
});

describe('collections storage', () => {
  test('creates a list and reads it back', () => {
    const created = createCollection('Rust course');
    expect(getCollections()).toHaveLength(1);
    expect(getCollection(created.id)?.name).toBe('Rust course');
  });

  test('falls back to a placeholder name when given blank input', () => {
    expect(createCollection('   ').name).toBe('Untitled list');
  });

  test('ignores malformed entries in storage', () => {
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify([{ nope: true }, 'garbage']));
    expect(getCollections()).toEqual([]);
  });

  test('returns an empty list when storage holds invalid JSON', () => {
    localStorage.setItem(COLLECTIONS_KEY, '{not json');
    expect(getCollections()).toEqual([]);
  });

  test('adds videos and refuses duplicates', () => {
    const { id } = createCollection('Watch later');
    addToCollection(id, 'aaaaaaaaaaa', 'First');
    addToCollection(id, 'aaaaaaaaaaa', 'First again');
    expect(ids(id)).toEqual(['aaaaaaaaaaa']);
    expect(getCollection(id)?.items[0].title).toBe('First');
  });

  test('removes a video', () => {
    const { id } = createCollection('Watch later');
    addToCollection(id, 'aaaaaaaaaaa');
    addToCollection(id, 'bbbbbbbbbbb');
    removeFromCollection(id, 'aaaaaaaaaaa');
    expect(ids(id)).toEqual(['bbbbbbbbbbb']);
  });

  test('backfills a title', () => {
    const { id } = createCollection('Watch later');
    addToCollection(id, 'aaaaaaaaaaa');
    setItemTitle(id, 'aaaaaaaaaaa', 'Ownership');
    expect(getCollection(id)?.items[0].title).toBe('Ownership');
  });

  test('renames and deletes', () => {
    const { id } = createCollection('Old');
    renameCollection(id, 'New');
    expect(getCollection(id)?.name).toBe('New');
    renameCollection(id, '   ');
    expect(getCollection(id)?.name).toBe('New');
    deleteCollection(id);
    expect(getCollection(id)).toBeNull();
  });

  test('reports which lists hold a video', () => {
    const a = createCollection('A');
    const b = createCollection('B');
    addToCollection(a.id, 'aaaaaaaaaaa');
    expect(collectionsContaining('aaaaaaaaaaa')).toEqual([a.id]);
    addToCollection(b.id, 'aaaaaaaaaaa');
    expect(collectionsContaining('aaaaaaaaaaa')).toEqual([a.id, b.id]);
  });

  test('operations on a missing list are no-ops', () => {
    expect(() => addToCollection('nope', 'aaaaaaaaaaa')).not.toThrow();
    expect(getCollections()).toEqual([]);
  });
});

describe('moveItem', () => {
  const seed = () => {
    const { id } = createCollection('L');
    ['aaaaaaaaaaa', 'bbbbbbbbbbb', 'ccccccccccc'].forEach((v) => addToCollection(id, v));
    return id;
  };

  test('moves an item down', () => {
    const id = seed();
    moveItem(id, 0, 1);
    expect(ids(id)).toEqual(['bbbbbbbbbbb', 'aaaaaaaaaaa', 'ccccccccccc']);
  });

  test('moves an item up', () => {
    const id = seed();
    moveItem(id, 2, 0);
    expect(ids(id)).toEqual(['ccccccccccc', 'aaaaaaaaaaa', 'bbbbbbbbbbb']);
  });

  test('clamps out-of-range destinations', () => {
    const id = seed();
    moveItem(id, 0, 99);
    expect(ids(id)).toEqual(['bbbbbbbbbbb', 'ccccccccccc', 'aaaaaaaaaaa']);
    moveItem(id, 2, -5);
    expect(ids(id)).toEqual(['aaaaaaaaaaa', 'bbbbbbbbbbb', 'ccccccccccc']);
  });

  test('ignores an out-of-range source', () => {
    const id = seed();
    moveItem(id, 7, 0);
    expect(ids(id)).toEqual(['aaaaaaaaaaa', 'bbbbbbbbbbb', 'ccccccccccc']);
  });
});

describe('collection playback links', () => {
  const seed = () => {
    const { id } = createCollection('L');
    ['aaaaaaaaaaa', 'bbbbbbbbbbb'].forEach((v) => addToCollection(id, v));
    return getCollection(id)!;
  };

  test('builds a watch href', () => {
    const collection = seed();
    expect(collectionWatchHref(collection, 1)).toBe(
      `/focus?id=bbbbbbbbbbb&c=${collection.id}&i=1`
    );
  });

  test('returns null past the end of the list', () => {
    expect(collectionWatchHref(seed(), 5)).toBeNull();
  });

  test('resolves position from the video id, not the stale hint', () => {
    const collection = seed();
    expect(resolveIndex(collection, 'bbbbbbbbbbb', '0')).toBe(1);
  });

  test('falls back to the hint when the video is not in the list', () => {
    const collection = seed();
    expect(resolveIndex(collection, 'zzzzzzzzzzz', '1')).toBe(1);
    expect(resolveIndex(collection, undefined, null)).toBe(0);
    expect(resolveIndex(collection, undefined, '99')).toBe(1);
  });
});
