import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (session.user.role === 'BRAND') {
    const brand = await prisma.brand.findUnique({ where: { userId: session.user.id } });
    if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

    const campaigns = await prisma.campaign.findMany({
      where: { brandId: brand.id },
      include: { collaborations: true },
    });

    const totalSpent = campaigns.reduce((sum, c) =>
      sum + c.collaborations.reduce((s, col) => s + (col.agreedRate || 0), 0), 0);
    const totalCampaigns = campaigns.length;
    const completedCampaigns = campaigns.filter(c => c.status === 'COMPLETED').length;
    const activeCollaborations = campaigns.reduce((sum, c) =>
      sum + c.collaborations.filter(col => col.status === 'IN_PROGRESS').length, 0);

    // Monthly spend (mock)
    const monthlyData = Array.from({ length: 6 }, (_, i) => ({
      month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'short' }),
      spend: Math.floor(Math.random() * 5000) + 1000,
      collaborations: Math.floor(Math.random() * 5),
    }));

    return NextResponse.json({ totalSpent, totalCampaigns, completedCampaigns, activeCollaborations, monthlyData });
  }

  if (session.user.role === 'ADMIN') {
    const [creatorCount, brandCount, campaignCount, matchCount] = await Promise.all([
      prisma.creator.count(),
      prisma.brand.count(),
      prisma.campaign.count(),
      prisma.campaignMatch.count(),
    ]);

    const weeklyData = Array.from({ length: 7 }, (_, i) => ({
      day: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('default', { weekday: 'short' }),
      campaigns: Math.floor(Math.random() * 8),
      matches: Math.floor(Math.random() * 20),
      creators: Math.floor(Math.random() * 5),
    }));

    return NextResponse.json({ creatorCount, brandCount, campaignCount, matchCount, weeklyData });
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
