export function formatNumber(num: string): string {
  const cleaned = num.replace(/[^0-9.]/g, '');
  if (!cleaned) return num;
  const n = parseFloat(cleaned);
  if (isNaN(n)) return num;
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return num;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
