import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const creator = await prisma.creator.findFirst({
    orderBy: { createdAt: "asc" },
    include: { socialProfiles: true, portfolio: true },
  });

  return NextResponse.json({ creator });
}

export async function PUT(req: NextRequest) {
  const creator = await prisma.creator.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!creator) {
    return NextResponse.json({ error: "No creator found" }, { status: 404 });
  }

  const body = await req.json();
  const { socialProfiles, portfolio, ...profileData } = body;

  const totalFollowers = Array.isArray(socialProfiles)
    ? socialProfiles.reduce((sum: number, sp: any) => sum + (parseInt(sp.followers) || 0), 0)
    : undefined;

  const tier =
    totalFollowers !== undefined
      ? totalFollowers >= 1_000_000
        ? "MEGA"
        : totalFollowers >= 500_000
        ? "MACRO"
        : totalFollowers >= 100_000
        ? "MID"
        : totalFollowers >= 10_000
        ? "MICRO"
        : "NANO"
      : undefined;

  const profileComplete = !!(profileData.bio && profileData.niches?.length > 0);

  const updatedCreator = await prisma.creator.update({
    where: { id: creator.id },
    data: {
      ...profileData,
      ...(totalFollowers !== undefined ? { totalFollowers } : {}),
      ...(tier ? { tier } : {}),
      profileComplete,
      minRatePerPost: profileData.minRatePerPost ? parseFloat(profileData.minRatePerPost) : undefined,
      maxRatePerPost: profileData.maxRatePerPost ? parseFloat(profileData.maxRatePerPost) : undefined,
    },
  });

  if (Array.isArray(socialProfiles)) {
    const existingProfiles = await prisma.socialProfile.findMany({
      where: { creatorId: creator.id },
    });

    const newHandles = socialProfiles.map((sp: any) => sp.handle);
    const toDelete = existingProfiles.filter((ep) => !newHandles.includes(ep.handle));

    if (toDelete.length) {
      await prisma.socialProfile.deleteMany({
        where: { id: { in: toDelete.map((d) => d.id) } },
      });
    }

    for (const sp of socialProfiles) {
      await prisma.socialProfile.upsert({
        where: {
          creatorId_platform: {
            creatorId: creator.id,
            platform: sp.platform,
          },
        },
        create: {
          creatorId: creator.id,
          platform: sp.platform,
          handle: sp.handle,
          followers: parseInt(sp.followers) || 0,
          engagementRate: parseFloat(sp.engagementRate) || 0,
        },
        update: {
          handle: sp.handle,
          followers: parseInt(sp.followers) || 0,
          engagementRate: parseFloat(sp.engagementRate) || 0,
        },
      });
    }
  }

  return NextResponse.json({ creator: updatedCreator });
}
