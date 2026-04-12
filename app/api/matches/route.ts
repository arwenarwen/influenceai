import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { runMatchingForCampaign } from '@/lib/ai/matching-engine';

// GET /api/matches?campaignId=xxx
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const campaignId = new URL(req.url).searchParams.get('campaignId');

  const matches = await prisma.campaignMatch.findMany({
    where: campaignId ? { campaignId } : {},
    include: {
      campaign: { include: { brand: true } },
      discoveredCreator: true,
    },
    orderBy: { score: 'desc' },
    take: 50,
  });

  // Enrich with creator data
  const enriched = await Promise.all(matches.map(async (match) => {
    if (match.creatorId) {
      const creator = await prisma.creator.findUnique({
        where: { id: match.creatorId },
        include: { user: { select: { name: true, image: true } }, socialProfiles: true },
      });
      return { ...match, creator };
    }
    return match;
  }));

  return NextResponse.json({ matches: enriched });
}

// POST /api/matches — Trigger re-matching for a campaign
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { campaignId } = await req.json();
  if (!campaignId) return NextResponse.json({ error: 'campaignId required' }, { status: 400 });

  // Verify access
  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId }, include: { brand: true } });
  if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });

  if (session.user.role === 'BRAND') {
    const brand = await prisma.brand.findUnique({ where: { userId: session.user.id } });
    if (!brand || campaign.brandId !== brand.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  await runMatchingForCampaign(campaignId);
  const matchCount = await prisma.campaignMatch.count({ where: { campaignId } });

  return NextResponse.json({ message: 'Matching complete', matchCount });
}

// PATCH /api/matches — Update match status (accept, decline, send)
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { matchId, status } = await req.json();
  if (!matchId || !status) return NextResponse.json({ error: 'matchId and status required' }, { status: 400 });

  const match = await prisma.campaignMatch.update({
    where: { id: matchId },
    data: {
      status,
      ...(status === 'sent' ? { sentAt: new Date() } : {}),
      ...(status !== 'pending' && status !== 'sent' ? { respondedAt: new Date() } : {}),
    },
  });

  // If sending to creator, create a collaboration
  if (status === 'sent' && match.creatorId) {
    const existing = await prisma.collaboration.findFirst({
      where: { campaignId: match.campaignId, creatorId: match.creatorId },
    });
    if (!existing) {
      const campaign = await prisma.campaign.findUnique({ where: { id: match.campaignId } });
      await prisma.collaboration.create({
        data: {
          campaignId: match.campaignId,
          creatorId: match.creatorId,
          status: 'PENDING',
          proposedRate: campaign?.budgetPerPost || null,
        },
      });

      // Notify creator
      const creator = await prisma.creator.findUnique({ where: { id: match.creatorId } });
      if (creator) {
        await prisma.notification.create({
          data: {
            userId: creator.userId,
            title: 'New Collaboration Request!',
            body: `You have a new collaboration request for "${campaign?.title}"`,
            type: 'collaboration',
            link: '/creator/collaborations',
          },
        });
      }
    }
  }

  return NextResponse.json({ match });
}
