import { motion } from 'framer-motion';
import { HistoryEntry } from '../../types';
import { formatDate } from '../../utils/formatters';

interface HistoryItemProps {
  entry: HistoryEntry;
  index: number;
}

export function HistoryItem({ entry, index }: HistoryItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 p-3 border-4 border-black bg-white dark:bg-gray-800 shadow-brutal-sm"
    >
      <img
        src={entry.thumbnail}
        alt={entry.title}
        className="w-14 h-14 object-cover border-2 border-black flex-shrink-0"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold truncate">{entry.title}</p>
        <p className="text-xs">{entry.author}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(entry.timestamp)}</p>
      </div>
      <span className="text-xs font-bold px-2 py-1 border-2 border-black bg-yellow-300 capitalize">
        {entry.quality}
      </span>
    </motion.div>
  );
}
