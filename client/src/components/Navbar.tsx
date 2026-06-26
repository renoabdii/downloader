import { motion } from 'framer-motion';
import { ThemeToggle } from '../features/theme/ThemeToggle';

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-yellow-400 border-b-4 border-black dark:bg-yellow-600"
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <motion.a
          href="/"
          className="text-2xl font-bold tracking-tighter"
          whileHover={{ scale: 1.05 }}
        >
          ⬇️ SnapDrop
        </motion.a>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm font-medium">
            TikTok Downloader
          </span>
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
}
