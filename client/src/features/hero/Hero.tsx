import { motion } from 'framer-motion';
import { Doodles } from './Doodles';

export function Hero() {
  return (
    <section className="relative bg-cyan-400 border-b-4 border-black dark:bg-cyan-700 overflow-hidden">
      <Doodles />
      <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-4"
        >
          Download Any
          <br />
          <span className="text-yellow-300 dark:text-yellow-200">TikTok Video</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl font-medium max-w-2xl mx-auto"
        >
          Paste a TikTok URL and download videos in HD, without watermark, or as MP3.
          Free, fast, and no sign-up required.
        </motion.p>
      </div>
    </section>
  );
}
