'use client';

import { useState, useRef, useTransition } from 'react';
import { validYoutbeUrlLink } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const VideoUrlInput = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const validate = (value: string) => {
    if (!value.trim()) return '';
    const id = validYoutbeUrlLink(value);
    return id ? '' : 'Please enter a valid YouTube URL.';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = validYoutbeUrlLink(url);
    if (!videoId) {
      setError('Please enter a valid YouTube URL.');
      inputRef.current?.focus();
      return;
    }
    setError('');
    startTransition(() => {
      router.push(`/focus?id=${videoId}`);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    if (error) setError(validate(value));
  };

  const hasError = !!error;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3" noValidate>
      <label htmlFor="youtube-url" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        YouTube link
      </label>
      <div className="relative flex items-center">
        <input
          id="youtube-url"
          ref={inputRef}
          type="url"
          value={url}
          onChange={handleChange}
          onBlur={() => setError(validate(url))}
          disabled={isPending}
          placeholder="https://www.youtube.com/watch?v=..."
          className={cn(
            'w-full pr-14 pl-4 py-3.5 rounded-2xl border-2 text-base',
            'bg-white dark:bg-gray-900',
            'placeholder-gray-400 dark:placeholder-gray-600',
            'text-gray-900 dark:text-white',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:opacity-60 disabled:cursor-not-allowed',
            'transition-colors duration-150',
            hasError
              ? 'border-red-400 focus:border-red-500 focus:ring-red-400'
              : 'border-orange-400 dark:border-orange-500 focus:border-orange-500 focus:ring-orange-400'
          )}
          aria-describedby={hasError ? 'url-error' : undefined}
          aria-invalid={hasError}
        />
        <button
          type="submit"
          disabled={isPending || !url.trim()}
          aria-label="Watch video"
          className={cn(
            'absolute right-2 p-2.5 rounded-xl',
            'bg-orange-400 hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600',
            'text-white',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-150'
          )}
        >
          {isPending ? (
            <span className="w-4 h-4 block border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <ArrowRight size={16} />
          )}
        </button>
      </div>
      {hasError && (
        <p id="url-error" role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </form>
  );
};

export default VideoUrlInput;
