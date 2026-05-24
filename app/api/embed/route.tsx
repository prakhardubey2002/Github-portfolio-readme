import { ImageResponse } from "@vercel/og";
import type { CSSProperties, ReactNode } from "react";
import { NextRequest } from "next/server";
import { formatNumber } from "@/lib/format";
import type { EmbedStats } from "@/lib/npm/embed-stats.service";
import { embedStatsService } from "@/lib/npm/embed-stats.service";
import { resolveUsername } from "@/lib/npm/stats-aggregator";
import {
  BASE_FONT,
  DISPLAY_FONT,
  loadEmbedFonts,
  type OgFont,
} from "@/lib/embed/fonts";
import { embedProfileMeta, profileConfig } from "@/lib/profile/config";

export const runtime = "nodejs";

const W = 1200;
const PAD = 32;
const INNER = W - PAD * 2;
const LIME = "#c8f135";
const BG = "#0a0a0a";
const CARD_BG = "rgba(255,255,255,0.06)";
const CARD_BORDER = "rgba(200,241,53,0.15)";
const LIME_CARD = "linear-gradient(145deg, #d4f542 0%, #c8f135 50%, #b8e030 100%)";
function dotGrid() {
  const rows: ReactNode[] = [];
  for (let r = 0; r < 6; r++) {
    const rowDots: ReactNode[] = [];
    for (let c = 0; c < 6; c++) {
      rowDots.push(
        <div
          key={`${r}-${c}`}
          style={{
            display: "flex",
            width: 4,
            height: 4,
            borderRadius: 2,
            background: "rgba(10,10,10,0.35)",
            margin: 3,
          }}
        />,
      );
    }
    rows.push(
      <div
        key={`dot-row-${r}`}
        style={{ display: "flex", flexDirection: "row" }}
      >
        {rowDots}
      </div>,
    );
  }
  return col({ display: "flex", width: 48 }, ...rows);
}

function buildProfileSection(displayFont: string) {
  const bio =
    profileConfig.bio.length > 340
      ? `${profileConfig.bio.slice(0, 338)}…`
      : profileConfig.bio;

  const socialColW = Math.floor(INNER / profileConfig.social.length) - 8;
  const socialItems = profileConfig.social.map((link, i) =>
    col(
      {
        width: socialColW,
        marginRight: i < profileConfig.social.length - 1 ? 12 : 0,
      },
      text(link.platform, {
        fontSize: 11,
        color: "rgba(255,255,255,0.45)",
        marginBottom: 4,
      }),
      text(link.label, {
        fontSize: 12,
        color: LIME,
        fontFamily: displayFont,
      }),
    ),
  );

  return col(
    { width: INNER, marginBottom: 20 },
    col(
      {
        width: INNER,
        padding: "24px 28px",
        borderRadius: "24px",
        background: LIME_CARD,
        border: "1px solid rgba(200,241,53,0.4)",
      },
      row(
        { width: INNER - 56, alignItems: "flex-start" },
        col(
          { width: INNER - 120, display: "flex" },
          text(profileConfig.tagline, {
            fontSize: 22,
            color: "#1a1a1a",
            fontFamily: displayFont,
            lineHeight: 1.35,
          }),
          text(bio, {
            fontSize: 12,
            color: "rgba(26,26,26,0.88)",
            marginTop: 14,
            lineHeight: 1.55,
          }),
          text(
            `${embedProfileMeta.company} · ${embedProfileMeta.location}`,
            {
              fontSize: 11,
              color: "rgba(26,26,26,0.75)",
              marginTop: 12,
            },
          ),
        ),
        dotGrid(),
      ),
    ),
    row(
      { marginTop: 18, display: "flex" },
      text(`${embedProfileMeta.publicRepos} repos`, {
        fontSize: 13,
        color: "rgba(200,241,53,0.9)",
        marginRight: 24,
      }),
      text(`${embedProfileMeta.followers} followers`, {
        fontSize: 13,
        color: "rgba(200,241,53,0.9)",
        marginRight: 24,
      }),
      text(`${embedProfileMeta.following} following`, {
        fontSize: 13,
        color: "rgba(200,241,53,0.9)",
      }),
    ),
    text(profileConfig.fontNote, {
      fontSize: 11,
      color: "rgba(255,255,255,0.4)",
      marginTop: 14,
      lineHeight: 1.5,
      fontFamily: displayFont,
    }),
    row(
      {
        marginTop: 16,
        paddingTop: 16,
        borderTop: "1px solid rgba(255,255,255,0.1)",
        width: INNER,
        display: "flex",
      },
      ...socialItems,
    ),
  );
}

function col(style: CSSProperties, ...children: ReactNode[]) {
  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      {children}
    </div>
  );
}

function row(style: CSSProperties, ...children: ReactNode[]) {
  return (
    <div style={{ display: "flex", flexDirection: "row", ...style }}>
      {children}
    </div>
  );
}

function text(
  content: string | number,
  style: CSSProperties,
) {
  return <div style={{ display: "flex", ...style }}>{content}</div>;
}

function buildLinePoints(
  daily: EmbedStats["dailyDownloads"],
  width: number,
  height: number,
): string {
  if (daily.length === 0) return "";
  const max = Math.max(...daily.map((d) => d.downloads), 1);
  const step = width / Math.max(daily.length - 1, 1);
  return daily
    .map((d, i) => {
      const x = i * step;
      const y = height - (d.downloads / max) * (height - 12) - 6;
      return `${x},${y}`;
    })
    .join(" ");
}

function buildEmbedLayout(
  stats: EmbedStats,
  npmUsername: string,
  displayFont: string,
) {
  const maxMonthly = Math.max(...stats.packages.map((p) => p.monthlyDownloads), 1);
  const chartColW = Math.floor((INNER - 12) / 2);
  const lineH = 130;
  const lineW = chartColW - 40;
  const recentDaily = stats.dailyDownloads.slice(-14);
  const linePoints = buildLinePoints(recentDaily, lineW, lineH);

  const barRowH = 22;
  const barChartH = 36 + stats.packages.length * barRowH;
  const packageRowH = 36;
  const packagesH = 44 + stats.packages.length * packageRowH;

  const statColW = Math.floor((INNER - 36) / 4);
  const periodColW = Math.floor((INNER - 40) / 3);

  const profileH = 320;
  const height =
    PAD * 2 +
    profileH +
    52 +
    108 +
    16 +
    88 +
    16 +
    Math.max(barChartH, lineH + 50) +
    16 +
    packagesH;

  const statTiles = [
    { label: "Packages", value: stats.packageCount, sub: "" },
    {
      label: "Total downloads",
      value: stats.totalYearDownloads,
      sub: "Since Jan 2015",
    },
    {
      label: "Weekly average",
      value: stats.weeklyAverage,
      sub: "Downloads per day (7d)",
    },
    {
      label: "Monthly average",
      value: stats.monthlyAverage,
      sub: "Downloads per day (30d)",
    },
  ];

  const statCards = statTiles.map((s, i) =>
    col(
      {
        width: statColW,
        marginRight: i < 3 ? 12 : 0,
        padding: "16px 18px",
        borderRadius: "16px",
        border: `1px solid ${CARD_BORDER}`,
        background: CARD_BG,
      },
      text(s.label, { fontSize: 12, color: "rgba(200,241,53,0.8)" }),
      text(formatNumber(s.value), {
        fontSize: 28,
        fontWeight: 700,
        color: "#ffffff",
        marginTop: 6,
      }),
      text(s.sub, {
        fontSize: 10,
        color: "rgba(255,255,255,0.45)",
        marginTop: 4,
        height: s.sub ? 14 : 0,
      }),
    ),
  );

  const periodCols = [
    { label: "Last 7 days", value: stats.totalWeeklyDownloads },
    { label: "Last 30 days", value: stats.totalMonthlyDownloads },
    { label: "Lifetime (since 2015)", value: stats.totalYearDownloads },
  ].map((item, i) =>
    col(
      { width: periodColW, marginRight: i < 2 ? 16 : 0 },
      text(item.label, { fontSize: 11, color: "rgba(255,255,255,0.45)" }),
      text(item.value.toLocaleString(), {
        fontSize: 20,
        fontWeight: 600,
        color: "#ffffff",
        marginTop: 6,
      }),
    ),
  );

  const barRows = stats.packages.map((pkg) =>
    row(
      {
        width: chartColW - 40,
        height: barRowH,
        marginBottom: 4,
        alignItems: "center",
      },
      text(pkg.name.length > 20 ? `${pkg.name.slice(0, 18)}…` : pkg.name, {
        width: 150,
        fontSize: 10,
        color: LIME,
      }),
      row(
        {
          width: chartColW - 200,
          height: 10,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 5,
          marginLeft: 8,
          alignItems: "center",
        },
        <div
          style={{
            display: "flex",
            width: `${Math.max(2, (pkg.monthlyDownloads / maxMonthly) * 100)}%`,
            height: 10,
            background: LIME,
            borderRadius: 5,
          }}
        />,
      ),
    ),
  );

  const packageRows = stats.packages.map((pkg, i) =>
    row(
      {
        width: INNER - 40,
        height: packageRowH,
        alignItems: "center",
        borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
      },
      text(pkg.name, {
        width: 320,
        fontSize: 12,
        color: LIME,
        fontFamily: "monospace",
      }),
      row(
        { width: INNER - 380, justifyContent: "flex-end", alignItems: "center" },
        text(`W: ${formatNumber(pkg.weeklyDownloads)}`, {
          fontSize: 11,
          color: "rgba(255,255,255,0.45)",
          marginRight: 16,
        }),
        text(`M: ${formatNumber(pkg.monthlyDownloads)}`, {
          fontSize: 11,
          color: "rgba(255,255,255,0.45)",
          marginRight: 16,
        }),
        text(`All: ${formatNumber(pkg.lifetimeDownloads)}`, {
          fontSize: 11,
          color: "rgba(255,255,255,0.45)",
        }),
      ),
    ),
  );

  const element = col(
    {
      width: W,
      padding: PAD,
      background: BG,
      fontFamily: BASE_FONT,
    },
    buildProfileSection(displayFont),
    col(
      {
        width: INNER,
        marginBottom: 14,
        paddingTop: 8,
        borderTop: "1px solid rgba(200,241,53,0.2)",
      },
      text("npm packages", { fontSize: 26, color: LIME, fontFamily: displayFont }),
      text(`Author stats for @${npmUsername} · official npm registry`, {
        fontSize: 12,
        color: "rgba(255,255,255,0.45)",
        marginTop: 4,
      }),
    ),
    row({ width: INNER, marginBottom: 14 }, ...statCards),
    col(
      { marginBottom: 14 },
      col(
        {
          width: INNER,
          padding: "18px 20px",
          borderRadius: "16px",
          border: `1px solid ${CARD_BORDER}`,
          background: CARD_BG,
        },
        text("Period totals", {
          fontSize: 12,
          color: "rgba(200,241,53,0.8)",
          marginBottom: 14,
        }),
        row({ width: INNER - 40 }, ...periodCols),
      ),
    ),
    row(
      { width: INNER, marginBottom: 14 },
      col(
        {
          width: chartColW,
          marginRight: 12,
          padding: "18px 20px",
          borderRadius: "16px",
          border: `1px solid ${CARD_BORDER}`,
          background: CARD_BG,
        },
        text("Monthly downloads — all packages", {
          fontSize: 12,
          color: LIME,
          marginBottom: 12,
        }),
        ...barRows,
      ),
      col(
        {
          width: chartColW,
          padding: "18px 20px",
          borderRadius: "16px",
          border: `1px solid ${CARD_BORDER}`,
          background: CARD_BG,
        },
        text("Daily downloads (last 30 days)", {
          fontSize: 12,
          color: LIME,
          marginBottom: 12,
        }),
        <svg width={lineW} height={lineH} viewBox={`0 0 ${lineW} ${lineH}`}>
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1={0}
              y1={lineH * t}
              x2={lineW}
              y2={lineH * t}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          ))}
          {linePoints ? (
            <polyline
              points={linePoints}
              fill="none"
              stroke={LIME}
              strokeWidth={2}
            />
          ) : null}
        </svg>,
      ),
    ),
    col(
      {
        width: INNER,
        padding: "18px 20px",
        borderRadius: "16px",
        border: `1px solid ${CARD_BORDER}`,
        background: CARD_BG,
      },
      text(`All packages (${stats.packages.length})`, {
        fontSize: 12,
        color: LIME,
        marginBottom: 10,
      }),
      ...packageRows,
    ),
  );

  return {
    height: Math.min(Math.max(height, 1200), 2400),
    element,
  };
}

function errorElement(message: string) {
  return col(
    {
      width: W,
      height: 400,
      alignItems: "center",
      justifyContent: "center",
      background: BG,
      color: LIME,
      fontSize: 22,
      padding: 40,
      fontFamily: BASE_FONT,
    },
    text(message, { fontFamily: BASE_FONT }),
  );
}

function errorImage(message: string, fonts: OgFont[]) {
  return new ImageResponse(errorElement(message), {
    width: W,
    height: 400,
    fonts,
    headers: { "Content-Type": "image/png" },
  });
}

export async function GET(request: NextRequest) {
  try {
    const npmUsername = resolveUsername(
      request.nextUrl.searchParams.get("user") ?? profileConfig.npmUsername,
    );

    const [{ fonts, displayFont }, stats] = await Promise.all([
      loadEmbedFonts(),
      embedStatsService.getEmbedStats(npmUsername),
    ]);
    const { height, element } = buildEmbedLayout(stats, npmUsername, displayFont);

    return new ImageResponse(element, {
      width: W,
      height,
      fonts,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[embed]", error);
    try {
      const { fonts } = await loadEmbedFonts();
      return errorImage(
        "Stats temporarily unavailable — retry in a minute",
        fonts,
      );
    } catch {
      return new Response("Embed failed", { status: 500 });
    }
  }
}
