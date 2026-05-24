import { downloadStatsService } from "./download-stats.service";
import { packageListService } from "./package-list.service";
import type { NpmPackageStats } from "./types";

/** Fast stats for README embed — skips lifetime chunking and daily ranges. */
export interface EmbedStats {
  username: string;
  packageCount: number;
  totalWeeklyDownloads: number;
  totalMonthlyDownloads: number;
  totalYearDownloads: number;
  weeklyAverage: number;
  monthlyAverage: number;
  packages: NpmPackageStats[];
  fetchedAt: string;
}

export class EmbedStatsService {
  async getEmbedStats(username: string): Promise<EmbedStats> {
    const packageNames =
      await packageListService.getPackagesByMaintainer(username);

    if (packageNames.length === 0) {
      return {
        username,
        packageCount: 0,
        totalWeeklyDownloads: 0,
        totalMonthlyDownloads: 0,
        totalYearDownloads: 0,
        weeklyAverage: 0,
        monthlyAverage: 0,
        packages: [],
        fetchedAt: new Date().toISOString(),
      };
    }

    const [weeklyMap, monthlyMap, yearMap] = await Promise.all([
      downloadStatsService.getBulkPointDownloads("last-week", packageNames),
      downloadStatsService.getBulkPointDownloads("last-month", packageNames),
      downloadStatsService.getBulkPointDownloads("last-year", packageNames),
    ]);

    const packages: NpmPackageStats[] = packageNames.map((name) => ({
      name,
      weeklyDownloads: weeklyMap.get(name) ?? 0,
      monthlyDownloads: monthlyMap.get(name) ?? 0,
      lifetimeDownloads: yearMap.get(name) ?? 0,
    }));

    packages.sort((a, b) => b.monthlyDownloads - a.monthlyDownloads);

    const totalWeeklyDownloads = packages.reduce(
      (sum, p) => sum + p.weeklyDownloads,
      0,
    );
    const totalMonthlyDownloads = packages.reduce(
      (sum, p) => sum + p.monthlyDownloads,
      0,
    );
    const totalYearDownloads = packages.reduce(
      (sum, p) => sum + p.lifetimeDownloads,
      0,
    );

    return {
      username,
      packageCount: packages.length,
      totalWeeklyDownloads,
      totalMonthlyDownloads,
      totalYearDownloads,
      weeklyAverage: Math.round(totalWeeklyDownloads / 7),
      monthlyAverage: Math.round(totalMonthlyDownloads / 30),
      packages,
      fetchedAt: new Date().toISOString(),
    };
  }
}

export const embedStatsService = new EmbedStatsService();
