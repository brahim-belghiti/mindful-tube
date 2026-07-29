'use client';

import { useEffect, useState } from 'react';
import { Collection, getCollection, getCollections, onCollectionsChange } from './collections';

/**
 * Reads collections from localStorage after mount (so SSR and the first client
 * render agree) and re-reads whenever anything in the app mutates them.
 */
export function useCollections(): { collections: Collection[]; loaded: boolean } {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sync = () => setCollections(getCollections());
    sync();
    setLoaded(true);
    return onCollectionsChange(sync);
  }, []);

  return { collections, loaded };
}

export function useCollection(id: string | undefined): { collection: Collection | null; loaded: boolean } {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoaded(true);
      return;
    }
    const sync = () => setCollection(getCollection(id));
    sync();
    setLoaded(true);
    return onCollectionsChange(sync);
  }, [id]);

  return { collection, loaded };
}
