import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'Is SnapDrop free to use?',
    a: 'Yes! SnapDrop is completely free. No sign-up or payment required.',
  },
  {
    q: 'How do I download a TikTok video?',
    a: 'Copy the TikTok video URL, paste it into the input above, and click "Get Video". Choose your preferred quality and download.',
  },
  {
    q: 'Can I download without watermark?',
    a: 'Yes! Select the "Without Watermark" option in the download choices.',
  },
  {
    q: 'Is this affiliated with TikTok?',
    a: 'No, SnapDrop is an independent tool and is not affiliated with TikTok or ByteDance.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="max-w-2xl mx-auto px-4 py-16">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-3xl sm:text-4xl font-black tracking-tight text-center mb-10"
      >
        ❓ FAQ
      </motion.h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left font-bold"
            >
              <span>{faq.q}</span>
              <span className="text-xl">{openIndex === i ? '−' : '+'}</span>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-4 text-sm font-medium border-t-4 border-black pt-4">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
