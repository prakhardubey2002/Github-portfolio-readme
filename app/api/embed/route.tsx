import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { formatNumber } from "@/lib/format";
import { embedStatsService } from "@/lib/npm/embed-stats.service";
import { resolveUsername } from "@/lib/npm/stats-aggregator";
import { profileConfig } from "@/lib/profile/config";

export const runtime = "edge";

function errorImage(message: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#c8f135",
          fontSize: 24,
          padding: 40,
          textAlign: "center",
        }}
      >
        <span>{message}</span>
      </div>
    ),
    {
      width: 1200,
      height: 400,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}

export async function GET(request: NextRequest) {
  try {
    const npmUsername = resolveUsername(
      request.nextUrl.searchParams.get("user") ?? profileConfig.npmUsername,
    );

    const stats = await embedStatsService.getEmbedStats(npmUsername);
    const topPackages = stats.packages.slice(0, 5);
    const maxMonthly = Math.max(
      ...topPackages.map((p) => p.monthlyDownloads),
      1,
    );

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "40px",
            background: "#0a0a0a",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "28px",
              borderRadius: "20px",
              background: "linear-gradient(145deg, #d4f542, #c8f135)",
              marginBottom: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: "#1a1a1a",
                  lineHeight: 1.3,
                }}
              >
                {profileConfig.tagline}
              </span>
              <span
                style={{
                  fontSize: 14,
                  color: "rgba(26,26,26,0.85)",
                  marginTop: 12,
                }}
              >
                {profileConfig.name} · npm @{npmUsername}
              </span>
            </div>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 700,
                color: "#1a1a1a",
              }}
            >
              {profileConfig.name.charAt(0)}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "24px",
              borderRadius: "20px",
              border: "1px solid rgba(200,241,53,0.2)",
              background: "rgba(255,255,255,0.05)",
              flex: 1,
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: "rgba(200,241,53,0.8)",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              npm statistics
            </span>

            <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
              {[
                { label: "Packages", value: stats.packageCount },
                { label: "Downloads (1y)", value: stats.totalYearDownloads },
                { label: "Weekly avg/day", value: stats.weeklyAverage },
                { label: "Monthly avg/day", value: stats.monthlyAverage },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "16px",
                    borderRadius: "12px",
                    border: "1px solid rgba(200,241,53,0.15)",
                    background: "rgba(0,0,0,0.3)",
                    flex: 1,
                  }}
                >
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                    {stat.label}
                  </span>
                  <span
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      color: "#c8f135",
                      marginTop: 6,
                    }}
                  >
                    {formatNumber(stat.value)}
                  </span>
                </div>
              ))}
            </div>

            {topPackages.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "20px",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: 10,
                  }}
                >
                  Top packages (monthly)
                </span>
                {topPackages.map((pkg) => (
                  <div
                    key={pkg.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "#c8f135",
                        width: "200px",
                      }}
                    >
                      {pkg.name.length > 24
                        ? `${pkg.name.slice(0, 22)}…`
                        : pkg.name}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: "10px",
                        borderRadius: "5px",
                        background: "rgba(255,255,255,0.08)",
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          width: `${(pkg.monthlyDownloads / maxMonthly) * 100}%`,
                          height: "100%",
                          borderRadius: "5px",
                          background: "#c8f135",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <span
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.5)",
                  marginTop: 20,
                }}
              >
                No packages found for @{npmUsername}
              </span>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 720,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("[embed]", error);
    return errorImage("Stats temporarily unavailable — retry in a minute");
  }
}
