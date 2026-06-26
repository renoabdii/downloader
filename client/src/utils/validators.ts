export function isValidTikTokUrl(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/i,
    /^https?:\/\/(vm\.|vt\.)?tiktok\.com\/[\w]+\/?/i,
    /^https?:\/\/m\.tiktok\.com\/v\/\d+/i,
  ];
  return patterns.some((pattern) => pattern.test(url.trim()));
}

export function sanitizeUrl(url: string): string {
  return url.trim();
}
