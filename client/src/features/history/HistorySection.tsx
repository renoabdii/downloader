import { useHistory } from '../../hooks/useHistory';
import { HistoryItem } from './HistoryItem';

export function HistorySection() {
  const { entries, clearHistory } = useHistory();

  if (entries.length === 0) return null;

  return (
    <section className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black tracking-tight">📋 History</h2>
        <button onClick={clearHistory} className="btn-secondary text-sm px-4 py-2">
          Clear All
        </button>
      </div>
      <div className="space-y-3">
        {entries.map((entry, i) => (
          <HistoryItem key={entry.id} entry={entry} index={i} />
        ))}
      </div>
    </section>
  );
}
