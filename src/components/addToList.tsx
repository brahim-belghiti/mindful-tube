'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ListPlus, Plus } from 'lucide-react';
import { addToCollection, createCollection, removeFromCollection } from '@/lib/collections';
import { useCollections } from '@/lib/useCollections';
import { cn } from '@/lib/utils';

type TProps = {
  videoId: string;
  title?: string;
  /** Rendered inside a Link (watch history) — clicks must not navigate. */
  stopPropagation?: boolean;
  className?: string;
};

const MENU_WIDTH = 208;

export default function AddToList({ videoId, title, stopPropagation, className }: TProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const { collections } = useCollections();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const newNameRef = useRef<HTMLInputElement>(null);

  // The menu is portalled to <body> so it escapes the scroll containers and
  // rounded-overflow wrappers it is triggered from.
  const place = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({
      top: rect.bottom + 6,
      left: Math.max(8, Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8)),
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, place]);

  useEffect(() => {
    if (creating) newNameRef.current?.focus();
  }, [creating]);

  const swallow = (e: React.MouseEvent | React.FormEvent) => {
    if (stopPropagation) e.preventDefault();
    e.stopPropagation();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const name = newName.trim();
    if (!name) {
      setCreating(false);
      return;
    }
    addToCollection(createCollection(name).id, videoId, title);
    setNewName('');
    setCreating(false);
  };

  const menu = open && position && (
    <div
      ref={menuRef}
      role="menu"
      onClick={(e) => e.stopPropagation()}
      style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
      className="fixed z-50 max-h-64 overflow-y-auto rounded-xl bg-white dark:bg-[#1b1c25] shadow-lg ring-1 ring-black/5 dark:ring-white/10 p-1.5 flex flex-col gap-0.5"
    >
      {collections.length === 0 && !creating && (
        <p className="px-2 py-1.5 text-[11px] text-gray-400 dark:text-gray-500">No lists yet.</p>
      )}

      {collections.map((collection) => {
        const isIn = collection.items.some((i) => i.videoId === videoId);
        return (
          <button
            key={collection.id}
            type="button"
            role="menuitemcheckbox"
            aria-checked={isIn}
            onClick={() =>
              isIn
                ? removeFromCollection(collection.id, videoId)
                : addToCollection(collection.id, videoId, title)
            }
            className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <span className="truncate">{collection.name}</span>
            {isIn && <Check size={13} className="shrink-0 text-orange-500" />}
          </button>
        );
      })}

      {creating ? (
        <form onSubmit={handleCreate} className="p-1">
          <input
            ref={newNameRef}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleCreate}
            placeholder="List name…"
            maxLength={60}
            aria-label="New list name"
            className="w-full px-2 py-1.5 rounded-lg text-xs bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
        >
          <Plus size={13} />
          New list
        </button>
      )}
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          swallow(e);
          place();
          setOpen((v) => !v);
        }}
        aria-label="Add to list"
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'flex items-center gap-1 px-1.5 py-1 rounded-md text-[10px] font-medium',
          'bg-black/60 text-white hover:bg-black/80 transition-colors',
          className
        )}
      >
        <ListPlus size={12} />
        Add
      </button>
      {typeof document !== 'undefined' && menu ? createPortal(menu, document.body) : null}
    </>
  );
}
