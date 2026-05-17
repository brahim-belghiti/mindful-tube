import Link from 'next/link';
import FinNotes from '@/components/finNotes';
import ThemeToggle from '@/components/themeToggle';

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function FinPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await searchParams;
  const videoId = typeof resolved?.id === 'string' ? resolved.id : undefined;

  return (
    <main className="w-full min-h-full flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-[#14151c] rounded-2xl shadow-md p-8 flex flex-col gap-10">
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide">
                Done
              </p>
            </div>
            <h1 className="text-4xl font-black leading-tight text-gray-900 dark:text-gray-50">
              Go do productive work.
            </h1>
            <p className="text-base text-gray-400 dark:text-gray-500 font-light">
              This is not anti-YouTube. This is anti-distraction.
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-400 hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600 text-white text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            Watch another video
          </Link>
        </div>

        {/* Notes */}
        <FinNotes videoId={videoId} />

        {/* Resources */}
        <div className="flex flex-col gap-3 border-t border-gray-100 dark:border-white/5 pt-6">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            Stay distraction-free on YouTube
          </h2>
          <ul className="flex flex-col gap-1.5 text-sm">
            <li>
              <a
                href="https://chrome.google.com/webstore/detail/df-tube-distraction-free/mjdepdfccjgcndkmemponafgioodelna"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 underline underline-offset-2"
              >
                DF Tube
              </a>
            </li>
            <li>
              <a
                href="https://chrome.google.com/webstore/detail/blocktube/bbeaicapbccfllodepmimpkgecanonai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 underline underline-offset-2"
              >
                BlockTube
              </a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
