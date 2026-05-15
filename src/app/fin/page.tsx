import Link from 'next/link';

export default function FinPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium tracking-widest uppercase text-orange-500 dark:text-orange-400">
            Done
          </p>
          <h1 className="text-4xl xl:text-7xl font-black leading-tight">
            Go do productive work.
          </h1>
          <p className="text-xl font-light text-gray-600 dark:text-gray-400">
            This is not anti-YouTube. This is anti-distraction.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-orange-400 hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            Watch another video
          </Link>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col gap-3">
          <p className="text-base text-gray-600 dark:text-gray-400">
            Want to stay distraction-free on YouTube itself? These tools help:
          </p>
          <ul className="flex flex-col gap-1.5 text-base font-medium">
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
