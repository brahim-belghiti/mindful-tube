import { getCachedTitles, setCachedTitle } from '@/lib/useVideoTitles';

beforeEach(() => {
  localStorage.clear();
});

describe('video title cache', () => {
  test('starts empty', () => {
    expect(getCachedTitles()).toEqual({});
  });

  test('stores and reads back a title', () => {
    setCachedTitle('aaaaaaaaaaa', 'Ownership');
    expect(getCachedTitles()).toEqual({ aaaaaaaaaaa: 'Ownership' });
  });

  test('keeps previously cached titles', () => {
    setCachedTitle('aaaaaaaaaaa', 'First');
    setCachedTitle('bbbbbbbbbbb', 'Second');
    expect(getCachedTitles()).toEqual({ aaaaaaaaaaa: 'First', bbbbbbbbbbb: 'Second' });
  });

  test('ignores blank ids or titles', () => {
    setCachedTitle('', 'Orphan');
    setCachedTitle('aaaaaaaaaaa', '');
    expect(getCachedTitles()).toEqual({});
  });

  test('recovers from malformed storage', () => {
    localStorage.setItem('video-titles', '{not json');
    expect(getCachedTitles()).toEqual({});
  });
});
