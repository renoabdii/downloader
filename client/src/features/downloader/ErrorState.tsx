import { motion } from 'framer-motion';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card p-6 text-center border-red-500"
    >
      <div className="text-4xl mb-4">😵</div>
      <h3 className="text-lg font-bold mb-2">Oops!</h3>
      <p className="text-sm mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </motion.div>
  );
}
