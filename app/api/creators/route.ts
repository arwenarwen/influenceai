import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';
  const niche = searchParams.get('niche') || '';
  const tier = searchParams.get('tier') || '';
  const platform = searchParams.get('platform') || '';
  const audienceGender = searchParams.get('audienceGender') || '';
  const minFollowers = parseInt(searchParams.get('minFollowers') || '0');
  const maxFollowers = parseInt(searchParams.get('maxFollowers') || '999999999');

  const creators = await prisma.creator.findMany({
    where: {
      AND: [
        niche ? { niches: { has: niche } } : {},
        tier ? { tier: tier as any } : {},
        audienceGender ? { audienceGender } : {},
        minFollowers ? { totalFollowers: { gte: minFollowers } } : {},
        maxFollowers < 999999999 ? { totalFollowers: { lte: maxFollowers } } : {},
        platform ? { socialProfiles: { some: { platform: platform as any } } } : {},
        query ? {
          OR: [
            { user: { name: { contains: query, mode: 'insensitive' } } },
            { niches: { has: query } },
            { bio: { contains: query, mode: 'insensitive' } },
          ],
        } : {},
      ],
    },
    include: {
      user: { select: { name: true, email: true, image: true } },
      socialProfiles: true,
    },
    orderBy: [{ avgEngagementRate: 'desc' }, { totalFollowers: 'desc' }],
    take: 50,
  });

  return NextResponse.json({ creators });
}
