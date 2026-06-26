import { motion } from 'framer-motion';
import { DownloadOption } from '../../types';

interface DownloadOptionsProps {
  options: DownloadOption[];
  onDownload: (option: DownloadOption) => void;
  onCopyLink: (option: DownloadOption) => void;
}

const qualityColors: Record<string, string> = {
  hd: 'bg-green-400',
  sd: 'bg-blue-400',
  'no-watermark': 'bg-purple-400',
  'with-watermark': 'bg-orange-400',
  mp3: 'bg-pink-400',
};

export function DownloadOptions({ options, onDownload, onCopyLink }: DownloadOptionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {options.map((option, i) => (
        <motion.div
          key={option.quality}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`${qualityColors[option.quality] || 'bg-gray-300'} border-4 border-black p-3`}
        >
          <div className="text-xs font-bold mb-1">{option.label}</div>
          <div className="text-xs mb-2">{option.size}</div>
          <div className="flex gap-2">
            <button
              onClick={() => onDownload(option)}
              className="btn-download bg-black text-white flex-1 text-xs"
            >
              ⬇️ Download
            </button>
            <button
              onClick={() => onCopyLink(option)}
              className="btn-download bg-white dark:bg-gray-700 flex-1 text-xs"
            >
              📋 Copy
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
