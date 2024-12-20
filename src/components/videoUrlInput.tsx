'use client';

import { useRef } from 'react';
import { validYoutbeUrlLink } from '@/lib/utils';

const VideoUrlInput = () => {
  const videoUrl = useRef<HTMLInputElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (videoUrl.current && feedbackRef.current) {
      const url = videoUrl.current.value;
      const videoId = validYoutbeUrlLink(url);

      if (!videoId) {
        feedbackRef.current.textContent =
          '❌ Invalid YouTube URL. Please enter a valid link.';
        feedbackRef.current.className =
          'w-10/12 bg-red-100 border border-red-400 text-red-700 px-4 py-3 relative rounded-full mt-5';
      } else {
        feedbackRef.current.textContent =
          'valid YouTube Url. will be directed shorlty';
        feedbackRef.current.className =
          'w-10/12 bg-green-100 border border-green-400 text-green-700 px-4 py-3 relative rounded-full mt-5';
        console.log('Valid URL. Redirect logic will go here.');
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <input
        className="w-full lg:w-10/12 mt-1 block py-2 px-3 border-4 border-orange-400 bg-white rounded-full shadow-sm focus:outline-none focus:ring-orange-600 focus:border-orange-600 font-light text-lg xl:text-xl h-14"
        placeholder="Paste your YouTube video link here: https://www.youtube.com/watch?v=D55ctBYF3AY"
        type="text"
        ref={videoUrl}
      />
      <button
        className="w-full lg:w-10/12 bg-orange-400 text-white py-2 px-4 rounded-full shadow-sm hover:bg-orange-600 focus:ring-2 focus:ring-orange-600 font-light text-lg xl:text-xl h-14"
        onClick={handleSubmit}
      >
        Submit
      </button>
      <div ref={feedbackRef} aria-live="polite"></div>
    </div>
  );
};

export default VideoUrlInput;
