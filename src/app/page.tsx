import VideoUrlInput from '@/components/videoUrlInput';

export default function Home() {
  return (
    <main className="w-full min-h-full flex flex-col justify-center items-center p-6 lg:p-8 gap-16 lg:gap-20">
      {/* Hero */}
      <div className="w-full max-w-2xl flex flex-col items-start gap-2">
        <p className="text-sm font-medium tracking-widest uppercase text-orange-500 dark:text-orange-400">
          Mindful Tube
        </p>
        <h1 className="text-4xl xl:text-6xl font-black leading-tight">
          Escape the rabbit hole.
        </h1>
        <p className="text-xl xl:text-2xl font-light text-gray-600 dark:text-gray-400 mt-1">
          Watch the video. Get back to work.
        </p>
      </div>

      {/* Input */}
      <div className="w-full max-w-2xl flex flex-col gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Paste a YouTube video or playlist link to watch it distraction-free.
        </p>
        <VideoUrlInput />
      </div>

      {/* About */}
      <div className="w-full max-w-2xl flex flex-col gap-3 border-t border-gray-200 dark:border-gray-800 pt-10">
        <h2 className="text-lg font-semibold">Why Mindful Tube?</h2>
        <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          YouTube is great for learning, but recommendations and comment threads
          turn a 5-minute watch into a 40-minute detour. Mindful Tube strips
          everything away — just the video, a distraction-free player, and a
          built-in notes panel so you capture what matters before moving on.
        </p>
      </div>
    </main>
  );
}
