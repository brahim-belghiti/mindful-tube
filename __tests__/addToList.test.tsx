import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddToList from '@/components/addToList';
import { createCollection, getCollections } from '@/lib/collections';

beforeEach(() => {
  localStorage.clear();
});

const openMenu = () => fireEvent.click(screen.getByRole('button', { name: /add to list/i }));

describe('AddToList', () => {
  test('shows an empty state when there are no lists', () => {
    render(<AddToList videoId="aaaaaaaaaaa" />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    openMenu();
    expect(screen.getByText(/no lists yet/i)).toBeInTheDocument();
  });

  test('adds and removes the video by toggling a list', () => {
    createCollection('Watch later');
    render(<AddToList videoId="aaaaaaaaaaa" title="Ownership" />);
    openMenu();

    const item = screen.getByRole('menuitemcheckbox', { name: /watch later/i });
    expect(item).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(item);
    expect(getCollections()[0].items).toEqual([
      expect.objectContaining({ videoId: 'aaaaaaaaaaa', title: 'Ownership' }),
    ]);
    expect(
      screen.getByRole('menuitemcheckbox', { name: /watch later/i })
    ).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: /watch later/i }));
    expect(getCollections()[0].items).toEqual([]);
  });

  test('creates a new list and drops the video into it', () => {
    render(<AddToList videoId="aaaaaaaaaaa" title="Lifetimes" />);
    openMenu();
    fireEvent.click(screen.getByRole('button', { name: /new list/i }));

    const input = screen.getByLabelText(/new list name/i);
    fireEvent.change(input, { target: { value: 'Rust course' } });
    fireEvent.submit(input);

    const [collection] = getCollections();
    expect(collection.name).toBe('Rust course');
    expect(collection.items.map((i) => i.videoId)).toEqual(['aaaaaaaaaaa']);
  });

  test('closes on Escape', () => {
    createCollection('Watch later');
    render(<AddToList videoId="aaaaaaaaaaa" />);
    openMenu();
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
