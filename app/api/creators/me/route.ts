import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const creator = await prisma.creator.findUnique({
    where: { userId: session.user.id },
    include: { socialProfiles: true, portfolio: true },
  });

  return NextResponse.json({ creator });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { socialProfiles, portfolio, ...profileData } = body;

  // Calculate total followers & tier
  const totalFollowers = Array.isArray(socialProfiles)
    ? socialProfiles.reduce((sum: number, sp: any) => sum + (parseInt(sp.followers) || 0), 0)
    : undefined;

  const tier = totalFollowers !== undefined
    ? totalFollowers >= 1_000_000 ? 'MEGA'
    : totalFollowers >= 500_000 ? 'MACRO'
    : totalFollowers >= 100_000 ? 'MID'
    : totalFollowers >= 10_000 ? 'MICRO' : 'NANO'
    : undefined;

  // Check if profile is reasonably complete
  const profileComplete = !!(profileData.bio && profileData.niches?.length > 0);

  const creator = await prisma.creator.update({
    where: { userId: session.user.id },
    data: {
      ...profileData,
      ...(totalFollowers !== undefined ? { totalFollowers } : {}),
      ...(tier ? { tier } : {}),
      profileComplete,
      minRatePerPost: profileData.minRatePerPost ? parseFloat(profileData.minRatePerPost) : undefined,
      maxRatePerPost: profileData.maxRatePerPost ? parseFloat(profileData.maxRatePerPost) : undefined,
    },
  });

  // Upsert social profiles
  if (Array.isArray(socialProfiles)) {
    // Delete removed profiles
    const existingProfiles = await prisma.socialProfile.findMany({ where: { creatorId: creator.id } });
    const newHandles = socialProfiles.map((sp: any) => sp.handle);
    const toDelete = existingProfiles.filter(ep => !newHandles.includes(ep.handle));
    if (toDelete.length) {
      await prisma.socialProfile.deleteMany({ where: { id: { in: toDelete.map(d => d.id) } } });
    }

    // Upsert each
    for (const sp of socialProfiles) {
      await prisma.socialProfile.upsert({
        where: { creatorId_platform: { creatorId: creator.id, platform: sp.platform } },
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

  return NextResponse.json({ creator });
}
