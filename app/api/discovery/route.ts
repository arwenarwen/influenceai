import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { discoverCreators } from '@/lib/ai/discovery';
import type { Platform } from '@prisma/client';

// Allow up to 60 seconds so Apify has time to return results
export const maxDuration = 60;

// GET /api/discovery — List all discovered creators
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const platform = searchParams.get('platform');
  const niche = searchParams.get('niche');
  const status = searchParams.get('status');

  const creators = await prisma.discoveredCreator.findMany({
    where: {
      ...(platform ? { platform: platform as Platform } : {}),
      ...(niche ? { niches: { has: niche } } : {}),
      ...(status ? { status: status as any } : {}),
    },
    orderBy: [{ followers: 'desc' }, { avgEngagement: 'desc' }],
    take: 100,
  });

  return NextResponse.json({ creators });
}

// POST /api/discovery — Trigger a new discovery scan
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const body = await req.json();
  const { platform = 'INSTAGRAM', niche, hashtag, minFollowers } = body;

  const result = await discoverCreators({
    platform: platform as Platform,
    niche: niche || undefined,
    hashtag: hashtag || undefined,
    minFollowers: minFollowers ? parseInt(minFollowers) : 1000,
    maxResults: 10,
  });

  return NextResponse.json({
    message: `Discovery complete: ${result.discovered} new, ${result.updated} updated`,
    ...result,
  });
}
