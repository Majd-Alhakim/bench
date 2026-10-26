export function progressPercent(pages: number, pagesRead: number): number {
  if (pages <= 0) return 0;
  return Math.min(100, Math.round((pagesRead / pages) * 100));
}
