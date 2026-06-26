import { motion } from 'framer-motion';

function Doodle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span
      className={`absolute text-2xl select-none ${className}`}
      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
    >
      {children}
    </motion.span>
  );
}

export function Doodles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <Doodle className="top-4 left-[15%]">⭐</Doodle>
      <Doodle className="top-8 right-[20%]">✨</Doodle>
      <Doodle className="bottom-12 left-[10%]">🎯</Doodle>
      <Doodle className="bottom-4 right-[15%]">😎</Doodle>
      <Doodle className="top-1/2 left-[5%]">⬇️</Doodle>
      <Doodle className="top-1/3 right-[8%]">🔥</Doodle>
    </div>
  );
}
