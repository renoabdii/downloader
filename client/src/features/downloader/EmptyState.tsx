import { motion } from 'framer-motion';

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card p-8 text-center"
    >
      <div className="text-5xl mb-4">🎬</div>
      <h3 className="text-xl font-bold mb-2">Ready to Download</h3>
      <p className="text-sm">
        Paste a TikTok video URL above and click &quot;Get Video&quot; to start.
      </p>
      <div className="mt-4 flex justify-center gap-2 text-2xl">
        <span>⬇️</span>
        <span>🎵</span>
        <span>🎥</span>
      </div>
    </motion.div>
  );
}
