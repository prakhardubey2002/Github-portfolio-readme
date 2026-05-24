const EARLIEST_DOWNLOAD_DATE = new Date("2015-01-10");
const BULK_CHUNK_SIZE = 128;
const LIFETIME_CHUNK_DAYS = 365;
const CONCURRENCY = 5;

export function encodePackageName(name: string): string {
  return name.replace(/\//g, "%2F");
}

export function isScopedPackage(name: string): boolean {
  return name.startsWith("@");
}

export function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export async function runWithConcurrency<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency = CONCURRENCY,
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

export function getLifetimeDateChunks(): { start: string; end: string }[] {
  const chunks: { start: string; end: string }[] = [];
  const today = new Date();
  let cursor = new Date(EARLIEST_DOWNLOAD_DATE);

  while (cursor < today) {
    const end = addDays(cursor, LIFETIME_CHUNK_DAYS - 1);
    const chunkEnd = end > today ? today : end;
    chunks.push({
      start: formatDate(cursor),
      end: formatDate(chunkEnd),
    });
    cursor = addDays(chunkEnd, 1);
  }

  return chunks;
}

export { BULK_CHUNK_SIZE, CONCURRENCY };
