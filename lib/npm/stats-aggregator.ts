import { downloadStatsService } from "./download-stats.service";
import { packageListService } from "./package-list.service";
import type { AggregatedStats, NpmPackageStats } from "./types";

export class StatsAggregator {
  async getStatsForUser(username: string): Promise<AggregatedStats> {
    const packageNames = await packageListService.getPackagesByMaintainer(username);

    if (packageNames.length === 0) {
      return {
        username,
        packageCount: 0,
        totalLifetimeDownloads: 0,
        totalWeeklyDownloads: 0,
        totalMonthlyDownloads: 0,
        weeklyAverage: 0,
        monthlyAverage: 0,
        packages: [],
        dailyDownloads: [],
        fetchedAt: new Date().toISOString(),
      };
    }

    const [weeklyMap, monthlyMap, lifetimeMap, dailyDownloads] =
      await Promise.all([
        downloadStatsService.getBulkPointDownloads("last-week", packageNames),
        downloadStatsService.getBulkPointDownloads("last-month", packageNames),
        downloadStatsService.getBulkLifetimeDownloads(packageNames),
        downloadStatsService.getAggregatedDailyDownloads(packageNames),
      ]);

    const packages: NpmPackageStats[] = packageNames.map((name) => ({
      name,
      weeklyDownloads: weeklyMap.get(name) ?? 0,
      monthlyDownloads: monthlyMap.get(name) ?? 0,
      lifetimeDownloads: lifetimeMap.get(name) ?? 0,
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
    const totalLifetimeDownloads = packages.reduce(
      (sum, p) => sum + p.lifetimeDownloads,
      0,
    );

    return {
      username,
      packageCount: packages.length,
      totalLifetimeDownloads,
      totalWeeklyDownloads,
      totalMonthlyDownloads,
      weeklyAverage: Math.round(totalWeeklyDownloads / 7),
      monthlyAverage: Math.round(totalMonthlyDownloads / 30),
      packages,
      dailyDownloads,
      fetchedAt: new Date().toISOString(),
    };
  }
}

export const statsAggregator = new StatsAggregator();

export function resolveUsername(
  queryUser?: string | null,
): string {
  return queryUser?.trim() || process.env.NPM_USERNAME || "prakhar_dubey";
}
