import { motion } from 'framer-motion';

export function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card p-6 space-y-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse border-4 border-black" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse border-2 border-black w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 animate-pulse border-2 border-black w-1/2" />
        </div>
      </div>
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 animate-pulse border-4 border-black" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 animate-pulse border-4 border-black" />
        ))}
      </div>
    </motion.div>
  );
}
