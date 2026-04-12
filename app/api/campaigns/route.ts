import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { runMatchingForCampaign } from '@/lib/ai/matching-engine';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let campaigns;

  if (session.user.role === 'BRAND') {
    const brand = await prisma.brand.findUnique({ where: { userId: session.user.id } });
    if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

    campaigns = await prisma.campaign.findMany({
      where: { brandId: brand.id },
      include: { collaborations: true, matches: true },
      orderBy: { createdAt: 'desc' },
    });
  } else if (session.user.role === 'ADMIN') {
    campaigns = await prisma.campaign.findMany({
      include: { brand: true, collaborations: true, matches: true },
      orderBy: { createdAt: 'desc' },
    });
  } else {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ campaigns });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'BRAND') {
    return NextResponse.json({ error: 'Only brands can create campaigns' }, { status: 403 });
  }

  const brand = await prisma.brand.findUnique({ where: { userId: session.user.id } });
  if (!brand) return NextResponse.json({ error: 'Brand profile not found' }, { status: 404 });

  const body = await req.json();
  const {
    title, description, productName, productUrl, budget, budgetPerPost,
    timeline, postTypes, platforms, niches, hashtags, contentBrief,
    preferredTiers, minFollowers, maxFollowers, minEngagement,
    audienceGender, audienceAge, audienceLocations,
  } = body;

  if (!title || !description || !budget) {
    return NextResponse.json({ error: 'title, description, and budget are required' }, { status: 400 });
  }

  const campaign = await prisma.campaign.create({
    data: {
      brandId: brand.id,
      title,
      description,
      productName,
      productUrl,
      industry: brand.industry,
      budget: parseFloat(budget),
      budgetPerPost: budgetPerPost ? parseFloat(budgetPerPost) : null,
      timeline: timeline ? new Date(timeline) : null,
      postTypes: postTypes || [],
      platforms: platforms || [],
      niches: niches || [],
      hashtags: hashtags || [],
      contentBrief,
      preferredTiers: preferredTiers || [],
      minFollowers,
      maxFollowers,
      minEngagement,
      audienceGender,
      audienceAge,
      audienceLocations: audienceLocations ? [audienceLocations] : [],
      status: 'ACTIVE',
    },
  });

  // Trigger AI matching asynchronously
  runMatchingForCampaign(campaign.id).catch(console.error);

  return NextResponse.json({ campaign }, { status: 201 });
}
