import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { discoverCreators } from "@/lib/ai/discovery";
import type { Platform } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform");
  const niche = searchParams.get("niche");
  const status = searchParams.get("status");

  const creators = await prisma.discoveredCreator.findMany({
    where: {
      ...(platform ? { platform: platform as Platform } : {}),
      ...(niche ? { niches: { has: niche } } : {}),
      ...(status ? { status: status as any } : {}),
    },
    orderBy: [{ followers: "desc" }, { avgEngagement: "desc" }],
    take: 100,
  });

  return NextResponse.json({ creators });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { platform = "INSTAGRAM", niche, hashtag, minFollowers } = body;

  const result = await discoverCreators({
    platform: platform as Platform,
    niche: niche || undefined,
    hashtag: hashtag || undefined,
    minFollowers: minFollowers ? parseInt(minFollowers, 10) : 1000,
    maxResults: 10,
  });

  return NextResponse.json({
    message: `Discovery complete: ${result.discovered} new, ${result.updated} updated`,
    ...result,
  });
}
