export function Footer() {
  return (
    <footer className="border-t-4 border-black bg-white dark:bg-gray-800 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <p className="text-sm font-medium">
          ⬇️ SnapDrop &copy; {new Date().getFullYear()} &mdash; TikTok Video Downloader
        </p>
        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
          Not affiliated with TikTok. For personal use only.
        </p>
      </div>
    </footer>
  );
}
