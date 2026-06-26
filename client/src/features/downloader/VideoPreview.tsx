import { motion } from 'framer-motion';
import { VideoData, DownloadOption } from '../../types';
import { DownloadOptions } from './DownloadOptions';
import { formatNumber } from '../../utils/formatters';

interface VideoPreviewProps {
  data: VideoData;
  onDownload: (option: DownloadOption) => void;
  onCopyLink: (option: DownloadOption) => void;
}

export function VideoPreview({ data, onDownload, onCopyLink }: VideoPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden"
    >
      <div className="aspect-video relative border-b-4 border-black">
        <img
          src={data.thumbnail}
          alt={data.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <span className="absolute bottom-2 right-2 bg-black text-white text-xs font-bold px-2 py-1 border-2 border-white">
          {data.duration}
        </span>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          <img
            src={data.authorAvatar}
            alt={data.author}
            className="w-10 h-10 border-2 border-black flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="font-bold text-sm sm:text-base leading-tight line-clamp-2">
              {data.title}
            </h3>
            <p className="text-sm font-medium mt-1">{data.author}</p>
            <div className="flex gap-4 text-xs mt-1 text-gray-500 dark:text-gray-400">
              <span>👁️ {formatNumber(data.views)} views</span>
              <span>❤️ {formatNumber(data.likes)} likes</span>
            </div>
          </div>
        </div>
        <DownloadOptions
          options={data.downloadOptions}
          onDownload={onDownload}
          onCopyLink={onCopyLink}
        />
      </div>
    </motion.div>
  );
}
