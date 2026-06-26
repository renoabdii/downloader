import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { URLInput } from './URLInput';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import { VideoPreview } from './VideoPreview';
import { Toast } from '../../components/Toast';
import { useDownload } from '../../hooks/useDownload';
import { DownloadOption } from '../../types';
import { getDownloadUrl } from '../../utils/api';
import { useHistory } from '../../hooks/useHistory';

export function DownloaderCard() {
  const { state, videoData, error, currentUrl, download, reset } = useDownload();
  const { addEntry } = useHistory();
  const [downloading, setDownloading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleDownload = useCallback(async (option: DownloadOption) => {
    setDownloading(option.quality);
    try {
      const { downloadUrl } = await getDownloadUrl(currentUrl || option.url, option.quality);
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
      setToast({ message: 'Download started!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to start download. Please try again.', type: 'error' });
    } finally {
      setDownloading(null);
    }
  }, [currentUrl]);

  const handleCopyLink = useCallback(async (option: DownloadOption) => {
    setDownloading(option.quality);
    try {
      const { downloadUrl } = await getDownloadUrl(currentUrl || option.url, option.quality);
      await navigator.clipboard.writeText(downloadUrl);
      setToast({ message: 'Download link copied to clipboard!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to copy link', type: 'error' });
    } finally {
      setDownloading(null);
    }
  }, [currentUrl]);

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
            downloading={downloading}
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

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}
