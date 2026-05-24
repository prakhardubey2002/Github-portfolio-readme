export interface NpmSearchPackage {
  name: string;
  version: string;
  description?: string;
}

export interface NpmPackageStats {
  name: string;
  weeklyDownloads: number;
  monthlyDownloads: number;
  lifetimeDownloads: number;
}

export interface DailyDownload {
  day: string;
  downloads: number;
}

export interface AggregatedStats {
  username: string;
  packageCount: number;
  totalLifetimeDownloads: number;
  totalWeeklyDownloads: number;
  totalMonthlyDownloads: number;
  weeklyAverage: number;
  monthlyAverage: number;
  packages: NpmPackageStats[];
  dailyDownloads: DailyDownload[];
  fetchedAt: string;
}

export interface DownloadPointResponse {
  downloads: number;
  start: string;
  end: string;
  package?: string;
}

export interface DownloadRangeResponse {
  downloads: { day: string; downloads: number }[];
  start: string;
  end: string;
  package?: string;
}

export interface NpmSearchResponse {
  objects: { package: NpmSearchPackage }[];
  total: number;
}
