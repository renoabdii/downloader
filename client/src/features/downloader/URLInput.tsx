import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface URLInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function URLInput({ onSubmit, isLoading }: URLInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isLoading) onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="tiktok-url" className="block text-sm font-bold mb-2">
          Paste TikTok Video URL
        </label>
        <input
          id="tiktok-url"
          type="url"
          placeholder="https://www.tiktok.com/@user/video/123456789"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input-brutal"
          disabled={isLoading}
        />
      </div>
      <motion.button
        type="submit"
        className="btn-primary w-full"
        disabled={isLoading || !url.trim()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? 'Processing...' : '⬇️ Get Video'}
      </motion.button>
    </form>
  );
}
