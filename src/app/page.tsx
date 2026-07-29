import VideoUrlInput from '@/components/videoUrlInput';
import RecentlyWatched from '@/components/recentlyWatched';
import CollectionsSection from '@/components/collectionsSection';
import ThemeToggle from '@/components/themeToggle';

export default function Home() {
  return (
    <main className="w-full h-full overflow-y-auto flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-4xl bg-white dark:bg-[#14151c] rounded-2xl shadow-md p-8 flex flex-col gap-10">
        {/* Hero */}
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide">
                Mindful Tube
              </p>
            </div>
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-black leading-tight text-gray-900 dark:text-gray-50 mt-1">
            Escape the rabbit hole.
          </h1>
          <p className="text-base text-gray-400 dark:text-gray-500 font-light">
            Watch the video. Get back to work.
          </p>
        </div>

        {/* Input */}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Paste a YouTube video or playlist link to watch it distraction-free.
          </p>
          <VideoUrlInput />
        </div>

        <CollectionsSection />

        <RecentlyWatched />

        {/* About */}
        <div className="flex flex-col gap-2 border-t border-gray-100 dark:border-white/5 pt-6">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            Why Mindful Tube?
          </h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">
            YouTube is great for learning, but recommendations and comment threads
            turn a 5-minute watch into a 40-minute detour. Mindful Tube strips
            everything away — just the video, a distraction-free player, and a
            built-in notes panel so you capture what matters before moving on.
          </p>
        </div>
      </div>
    </main>
  );
}
