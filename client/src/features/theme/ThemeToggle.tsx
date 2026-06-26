import { motion } from 'framer-motion';
import { useTheme } from './useTheme';

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <motion.button
      onClick={toggle}
      className="p-2 border-4 border-black bg-white dark:bg-gray-800 shadow-brutal-sm hover:shadow-brutal active:translate-x-[2px] active:translate-y-[2px] transition-all duration-100"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      {isDark ? '☀️' : '🌙'}
    </motion.button>
  );
}
