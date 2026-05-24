import type { DailyDownload, DownloadPointResponse, DownloadRangeResponse } from "./types";
import {
  BULK_CHUNK_SIZE,
  chunkArray,
  encodePackageName,
  getLifetimeDateChunks,
  isScopedPackage,
  runWithConcurrency,
} from "./utils";

const DOWNLOADS_BASE = "https://api.npmjs.org/downloads";

export class DownloadStatsService {
  async getPointDownloads(
    period: string,
    packageName: string,
  ): Promise<number> {
    const encoded = encodePackageName(packageName);
    const url = `${DOWNLOADS_BASE}/point/${period}/${encoded}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return 0;
    const data = (await res.json()) as DownloadPointResponse;
    return data.downloads ?? 0;
  }

  private parseBulkPointResponse(
    data: Record<string, unknown>,
    packages: string[],
  ): Map<string, number> {
    const result = new Map<string, number>();

    if (typeof data.downloads === "number" && packages.length === 1) {
      result.set(packages[0], data.downloads);
      return result;
    }

    for (const pkg of packages) {
      const pkgData = data[pkg] as DownloadPointResponse | undefined;
      result.set(pkg, pkgData?.downloads ?? 0);
    }

    return result;
  }

  async getBulkPointDownloads(
    period: string,
    packages: string[],
  ): Promise<Map<string, number>> {
    const result = new Map<string, number>();
    const unscoped = packages.filter((p) => !isScopedPackage(p));
    const scoped = packages.filter((p) => isScopedPackage(p));

    for (const chunk of chunkArray(unscoped, BULK_CHUNK_SIZE)) {
      if (chunk.length === 0) continue;
      const url = `${DOWNLOADS_BASE}/point/${period}/${chunk.join(",")}`;
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) {
        for (const pkg of chunk) result.set(pkg, 0);
        continue;
      }
      const data = (await res.json()) as Record<string, unknown>;
      const parsed = this.parseBulkPointResponse(data, chunk);
      for (const [pkg, downloads] of parsed) {
        result.set(pkg, downloads);
      }
    }

    await runWithConcurrency(scoped, async (pkg) => {
      const downloads = await this.getPointDownloads(period, pkg);
      result.set(pkg, downloads);
    });

    return result;
  }

  async getBulkLifetimeDownloads(packages: string[]): Promise<Map<string, number>> {
    const result = new Map<string, number>();
    for (const pkg of packages) result.set(pkg, 0);

    const dateChunks = getLifetimeDateChunks();

    for (const { start, end } of dateChunks) {
      const period = `${start}:${end}`;
      const chunkTotals = await this.getBulkPointDownloads(period, packages);
      for (const [pkg, downloads] of chunkTotals) {
        result.set(pkg, (result.get(pkg) ?? 0) + downloads);
      }
    }

    return result;
  }

  async getRangeDownloads(
    period: string,
    packageName: string,
  ): Promise<DailyDownload[]> {
    const encoded = encodePackageName(packageName);
    const url = `${DOWNLOADS_BASE}/range/${period}/${encoded}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = (await res.json()) as DownloadRangeResponse;
    return (data.downloads ?? []).map((d) => ({
      day: d.day,
      downloads: d.downloads,
    }));
  }

  async getAggregatedDailyDownloads(
    packages: string[],
  ): Promise<DailyDownload[]> {
    const dayMap = new Map<string, number>();

    const seriesList = await runWithConcurrency(packages, (pkg) =>
      this.getRangeDownloads("last-month", pkg),
    );

    for (const series of seriesList) {
      for (const { day, downloads } of series) {
        dayMap.set(day, (dayMap.get(day) ?? 0) + downloads);
      }
    }

    return [...dayMap.entries()]
      .map(([day, downloads]) => ({ day, downloads }))
      .sort((a, b) => a.day.localeCompare(b.day));
  }
}

export const downloadStatsService = new DownloadStatsService();
