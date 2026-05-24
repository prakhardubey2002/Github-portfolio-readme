"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyDownload, NpmPackageStats } from "@/lib/npm/types";
import { formatNumber } from "@/lib/format";
import { GlassCard } from "./glass-card";

interface DownloadsChartProps {
  packages: NpmPackageStats[];
  dailyDownloads: DailyDownload[];
}

export function DownloadsChart({ packages, dailyDownloads }: DownloadsChartProps) {
  const barData = packages.map((p) => ({
    name: p.name.length > 22 ? `${p.name.slice(0, 20)}…` : p.name,
    downloads: p.monthlyDownloads,
  }));

  const barHeight = Math.max(280, barData.length * 36 + 80);

  const lineData = dailyDownloads.map((d) => ({
    day: d.day.slice(5),
    downloads: d.downloads,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GlassCard>
        <h2 className="mb-4 text-lg font-semibold text-lime-300">
          Monthly downloads — all packages
        </h2>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={barHeight}>
            <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="name"
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10 }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }}
                tickFormatter={(v) => formatNumber(Number(v))}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(15,15,30,0.95)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
                formatter={(value) => [formatNumber(Number(value)), "Downloads"]}
              />
              <Bar dataKey="downloads" fill="#c8f135" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-white/60">No download data yet.</p>
        )}
      </GlassCard>

      <GlassCard>
        <h2 className="mb-4 text-lg font-semibold text-lime-300">
          Daily downloads (last 30 days)
        </h2>
        {lineData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={lineData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="day"
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10 }}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }}
                tickFormatter={(v) => formatNumber(Number(v))}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(15,15,30,0.95)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
                formatter={(value) => [formatNumber(Number(value)), "Downloads"]}
              />
              <Line
                type="monotone"
                dataKey="downloads"
                stroke="#c8f135"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-white/60">No download data yet.</p>
        )}
      </GlassCard>
    </div>
  );
}
