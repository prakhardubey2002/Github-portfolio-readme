import { Suspense } from "react";
import { DownloadsChart } from "@/components/downloads-chart";
import { PackageList } from "@/components/package-list";
import { ProfileHero } from "@/components/profile-hero";
import { SectionHeading } from "@/components/section-heading";
import { StatTile } from "@/components/stat-tile";
import { GlassCard } from "@/components/glass-card";
import { getResolvedProfile } from "@/lib/profile";
import { resolveUsername, statsAggregator } from "@/lib/npm/stats-aggregator";

interface PageProps {
  searchParams: Promise<{ user?: string }>;
}

async function NpmStatsSection({ username }: { username: string }) {
  const stats = await statsAggregator.getStatsForUser(username);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard>
          <StatTile label="Packages" value={stats.packageCount} />
        </GlassCard>
        <GlassCard>
          <StatTile
            label="Total downloads"
            value={stats.totalLifetimeDownloads}
            sublabel="Since Jan 2015"
          />
        </GlassCard>
        <GlassCard>
          <StatTile
            label="Weekly average"
            value={stats.weeklyAverage}
            sublabel="Downloads per day (7d)"
          />
        </GlassCard>
        <GlassCard>
          <StatTile
            label="Monthly average"
            value={stats.monthlyAverage}
            sublabel="Downloads per day (30d)"
          />
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="mb-3 text-sm font-medium text-lime-300/80">
          Period totals
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-white/50">Last 7 days</p>
            <p className="text-xl font-semibold text-white">
              {stats.totalWeeklyDownloads.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/50">Last 30 days</p>
            <p className="text-xl font-semibold text-white">
              {stats.totalMonthlyDownloads.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/50">Lifetime (since 2015)</p>
            <p className="text-xl font-semibold text-white">
              {stats.totalLifetimeDownloads.toLocaleString()}
            </p>
          </div>
        </div>
      </GlassCard>

      <DownloadsChart
        packages={stats.packages}
        dailyDownloads={stats.dailyDownloads}
      />

      <PackageList packages={stats.packages} />
    </>
  );
}

function NpmStatsSkeleton() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl border border-lime-400/10 bg-white/5"
          />
        ))}
      </div>
      <div className="h-24 animate-pulse rounded-2xl border border-lime-400/10 bg-white/5" />
      <div className="h-80 animate-pulse rounded-2xl border border-lime-400/10 bg-white/5" />
      <div className="h-64 animate-pulse rounded-2xl border border-lime-400/10 bg-white/5" />
    </div>
  );
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const profile = await getResolvedProfile();
  const npmUsername = resolveUsername(params.user ?? profile.npmUsername);

  return (
    <div className="dashboard-bg min-h-screen px-4 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-2">
        <ProfileHero profile={profile} />

        <SectionHeading
          title="npm packages"
          subtitle={`Author stats for @${npmUsername} · official npm registry`}
        />

        <Suspense fallback={<NpmStatsSkeleton />}>
          <NpmStatsSection username={npmUsername} />
        </Suspense>

        <footer className="mt-8 flex flex-wrap justify-center gap-6 border-t border-white/10 pt-8 text-sm text-white/50">
          <a
            href={`https://www.npmjs.com/~${npmUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lime-300 hover:text-lime-200"
          >
            npm profile →
          </a>
          <a
            href={`https://github.com/${profile.githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lime-300 hover:text-lime-200"
          >
            GitHub profile →
          </a>
        </footer>
      </div>
    </div>
  );
}
