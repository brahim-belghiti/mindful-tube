import { validYoutbeUrlLink } from '@/lib/utils';

describe('validYoutbeUrlLink', () => {
  test('should return video ID for a full YouTube URL', () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    expect(validYoutbeUrlLink(url)).toBe('dQw4w9WgXcQ');
  });

  test('should return video ID for a shortened YouTube URL', () => {
    const url = 'https://youtu.be/dQw4w9WgXcQ';
    expect(validYoutbeUrlLink(url)).toBe('dQw4w9WgXcQ');
  });

  test('should return video ID for a YouTube URL without "www"', () => {
    const url = 'https://youtube.com/watch?v=dQw4w9WgXcQ';
    expect(validYoutbeUrlLink(url)).toBe('dQw4w9WgXcQ');
  });

  test('should return video ID for a YouTube URL without "https"', () => {
    const url = 'http://www.youtube.com/watch?v=dQw4w9WgXcQ';
    expect(validYoutbeUrlLink(url)).toBe('dQw4w9WgXcQ');
  });

  test('should return an empty string for an invalid YouTube URL', () => {
    const url = 'https://www.example.com/watch?v=dQw4w9WgXcQ';
    expect(validYoutbeUrlLink(url)).toBe('');
  });

  test('should return an empty string for an invalid YouTube UR', () => {
    const url = 'https://www.youtube.com/watch?v=xN1-2p06Urcccccc';
    expect(validYoutbeUrlLink(url)).toBe('');
  });

  test('should return an empty string for a non-YouTube URL', () => {
    const url = 'https://www.google.com';
    expect(validYoutbeUrlLink(url)).toBe('');
  });

  test('should return an empty string for a malformed URL', () => {
    const url = 'youtube.com/watch?v=';
    expect(validYoutbeUrlLink(url)).toBe('');
  });

  test('should return an empty string for an empty input', () => {
    const url = '';
    expect(validYoutbeUrlLink(url)).toBe('');
  });
});
