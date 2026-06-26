import { motion } from 'framer-motion';

const features = [
  {
    icon: '⚡',
    title: 'Fast Download',
    desc: 'Get your TikTok videos in seconds with our high-speed processing.',
    color: 'bg-green-400',
  },
  {
    icon: '🎨',
    title: 'HD Quality',
    desc: 'Download in up to 1080p HD quality, no watermark option available.',
    color: 'bg-purple-400',
  },
  {
    icon: '🎵',
    title: 'MP3 Support',
    desc: 'Extract audio from TikTok videos and save as MP3 files.',
    color: 'bg-pink-400',
  },
  {
    icon: '🔒',
    title: 'No Sign-Up',
    desc: 'No registration required. Free to use for everyone.',
    color: 'bg-cyan-400',
  },
];

export function FeaturesSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-3xl sm:text-4xl font-black tracking-tight text-center mb-10"
      >
        Why SnapDrop?
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className={`${f.color} border-4 border-black p-6 shadow-brutal`}
          >
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="text-lg font-bold mb-2">{f.title}</h3>
            <p className="text-sm font-medium">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
