import { NextRequest, NextResponse } from "next/server";
import { resolveUsername, statsAggregator } from "@/lib/npm/stats-aggregator";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const username = resolveUsername(
    request.nextUrl.searchParams.get("user"),
  );

  try {
    const stats = await statsAggregator.getStatsForUser(username);
    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch npm stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
