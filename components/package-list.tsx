import type { NpmPackageStats } from "@/lib/npm/types";
import { formatNumber } from "@/lib/format";
import { GlassCard } from "./glass-card";

interface PackageListProps {
  packages: NpmPackageStats[];
}

export function PackageList({ packages }: PackageListProps) {
  if (packages.length === 0) {
    return (
      <GlassCard>
        <p className="text-center text-white/70">No packages found.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <h2 className="mb-4 text-lg font-semibold text-lime-300">
        All packages ({packages.length})
      </h2>
      <ul className="divide-y divide-white/10">
        {packages.map((pkg) => (
          <li
            key={pkg.name}
            className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
          >
            <a
              href={`https://www.npmjs.com/package/${pkg.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-lime-200 hover:text-lime-100"
            >
              {pkg.name}
            </a>
            <div className="flex gap-4 text-xs text-white/60">
              <span title="Last week">W: {formatNumber(pkg.weeklyDownloads)}</span>
              <span title="Last month">M: {formatNumber(pkg.monthlyDownloads)}</span>
              <span title="Since Jan 2015">All: {formatNumber(pkg.lifetimeDownloads)}</span>
            </div>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
