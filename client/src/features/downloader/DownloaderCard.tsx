import { motion } from 'framer-motion';
import { URLInput } from './URLInput';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import { VideoPreview } from './VideoPreview';
import { useDownload } from '../../hooks/useDownload';
import { DownloadOption } from '../../types';
import { getDownloadUrl } from '../../utils/api';
import { useHistory } from '../../hooks/useHistory';

export function DownloaderCard() {
  const { state, videoData, error, currentUrl, download, reset } = useDownload();
  const { addEntry } = useHistory();

  const handleDownload = async (option: DownloadOption) => {
    try {
      const { downloadUrl } = await getDownloadUrl(currentUrl || option.url, option.quality);
      window.open(downloadUrl, '_blank');
    } catch {
      alert('Failed to start download. Please try again.');
    }
  };

  const handleCopyLink = async (option: DownloadOption) => {
    try {
      const { downloadUrl } = await getDownloadUrl(currentUrl || option.url, option.quality);
      await navigator.clipboard.writeText(downloadUrl);
      alert('Download link copied to clipboard!');
    } catch {
      alert('Failed to copy link');
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-4 -mt-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6 space-y-6"
      >
        <URLInput onSubmit={download} isLoading={state === 'loading'} />

        {state === 'loading' && <LoadingState />}
        {state === 'error' && <ErrorState message={error} onRetry={reset} />}
        {state === 'idle' && <EmptyState />}
        {state === 'success' && videoData && (
          <VideoPreview
            data={videoData}
            onDownload={(option) => {
              addEntry({
                videoId: videoData.id,
                url: currentUrl,
                title: videoData.title,
                author: videoData.author,
                thumbnail: videoData.thumbnail,
                quality: option.quality,
              });
              handleDownload(option);
            }}
            onCopyLink={(option) => {
              addEntry({
                videoId: videoData.id,
                url: currentUrl,
                title: videoData.title,
                author: videoData.author,
                thumbnail: videoData.thumbnail,
                quality: option.quality,
              });
              handleCopyLink(option);
            }}
          />
        )}
      </motion.div>
    </section>
  );
}
