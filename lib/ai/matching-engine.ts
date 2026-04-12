/**
 * InfluenceHub AI Matching Engine
 *
 * Scores creators against campaign requirements using:
 * 1. Rule-based scoring (engagement, niche, audience fit, platform)
 * 2. OpenAI GPT analysis for bio/content NLP
 * 3. Composite ROI prediction score
 */

import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
import { Prisma, type Campaign, type Creator, type SocialProfile, type InfluencerTier } from '@prisma/client';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export interface MatchScoreBreakdown {
  overall: number;
  nicheRelevance: number;
  audienceFit: number;
  engagementQuality: number;
  platformFit: number;
  tierFit: number;
  budgetFit: number;
  brandSafety: number;
}

type CreatorWithProfiles = Creator & { socialProfiles: SocialProfile[] };
type CampaignFull = Campaign;

export async function scoreCreatorForCampaign(
  creator: CreatorWithProfiles,
  campaign: CampaignFull
): Promise<{ score: number; breakdown: MatchScoreBreakdown; reason: string }> {
  const breakdown: MatchScoreBreakdown = {
    overall: 0,
    nicheRelevance: scoreNicheRelevance(creator.niches, campaign.niches),
    audienceFit: scoreAudienceFit(creator, campaign),
    engagementQuality: scoreEngagementQuality(creator),
    platformFit: scorePlatformFit(creator.socialProfiles, campaign.platforms as string[]),
    tierFit: scoreTierFit(creator.tier, campaign.preferredTiers as string[]),
    budgetFit: scoreBudgetFit(
      creator.minRatePerPost,
      creator.maxRatePerPost,
      campaign.budgetPerPost || campaign.budget / 3
    ),
    brandSafety: 85,
  };

  breakdown.overall = Math.round(
    breakdown.nicheRelevance * 0.25 +
      breakdown.audienceFit * 0.2 +
      breakdown.engagementQuality * 0.2 +
      breakdown.platformFit * 0.15 +
      breakdown.tierFit * 0.1 +
      breakdown.budgetFit * 0.05 +
      breakdown.brandSafety * 0.05
  );

  let reason = generateRuleBasedReason(creator, campaign, breakdown);
  if (openai && breakdown.overall > 60) {
    try {
      reason = await generateAIReason(creator, campaign, breakdown);
    } catch {
      // fall back
    }
  }

  return { score: breakdown.overall, breakdown, reason };
}

function scoreNicheRelevance(creatorNiches: string[], campaignNiches: string[]): number {
  if (!campaignNiches.length) return 70;
  if (!creatorNiches.length) return 30;

  const normalizedCreator = creatorNiches.map((n) => n.toLowerCase());
  const normalizedCampaign = campaignNiches.map((n) => n.toLowerCase());

  const exactMatches = normalizedCreator.filter((n) => normalizedCampaign.includes(n)).length;
  if (exactMatches === 0) {
    const RELATED: Record<string, string[]> = {
      fitness: ['sports', 'health', 'wellness', 'lifestyle'],
      beauty: ['fashion', 'lifestyle', 'skincare'],
      tech: ['gaming', 'education', 'business'],
      gaming: ['tech', 'entertainment'],
      food: ['lifestyle', 'travel', 'health'],
    };
    const partialScore = normalizedCampaign.reduce((acc, cn) => {
      const related = RELATED[cn] || [];
      return acc + (normalizedCreator.some((c) => related.includes(c)) ? 20 : 0);
    }, 0);
    return Math.min(60, partialScore);
  }

  return Math.min(100, Math.round((exactMatches / Math.max(campaignNiches.length, 1)) * 100));
}

function scoreAudienceFit(creator: Creator, campaign: Campaign): number {
  let score = 70;

  if (campaign.audienceGender && creator.audienceGender) {
    if (creator.audienceGender === campaign.audienceGender) score += 15;
    else if (creator.audienceGender === 'mixed') score += 5;
    else score -= 15;
  }

  if (campaign.audienceAge && creator.audienceAgeRange) {
    if (creator.audienceAgeRange === campaign.audienceAge) score += 15;
  }

  if (campaign.audienceLocations.length && creator.audienceLocations.length) {
    const overlap = creator.audienceLocations.some((l) =>
      campaign.audienceLocations.some((cl) => l.toLowerCase().includes(cl.toLowerCase()))
    );
    if (overlap) score += 15;
  }

  return Math.max(0, Math.min(100, score));
}

function scoreEngagementQuality(creator: Creator): number {
  const rate = creator.avgEngagementRate;
  const followers = creator.totalFollowers;

  const benchmarks: Record<InfluencerTier, number> = {
    NANO: 5,
    MICRO: 3,
    MID: 2,
    MACRO: 1.5,
    MEGA: 1,
  };
  const benchmark = benchmarks[creator.tier] || 2;

  if (rate === 0) return 40;

  let score = 50;
  if (rate >= benchmark * 2) score = 100;
  else if (rate >= benchmark * 1.5) score = 85;
  else if (rate >= benchmark) score = 70;
  else if (rate >= benchmark * 0.7) score = 55;
  else score = 35;

  if (creator.avgViews > 0 && followers > 0) {
    const viewRatio = creator.avgViews / followers;
    if (viewRatio > 0.3) score = Math.min(100, score + 10);
  }

  return score;
}

function scorePlatformFit(profiles: SocialProfile[], campaignPlatforms: string[]): number {
  if (!campaignPlatforms.length) return 75;
  if (!profiles.length) return 20;

  const creatorPlatforms = profiles.map((p) => p.platform.toString());
  const overlap = creatorPlatforms.filter((p) => campaignPlatforms.includes(p)).length;
  return Math.round((overlap / Math.max(campaignPlatforms.length, 1)) * 100);
}

function scoreTierFit(creatorTier: InfluencerTier, preferredTiers: string[]): number {
  if (!preferredTiers.length) return 75;
  if (preferredTiers.includes(creatorTier)) return 100;

  const TIER_ORDER = ['NANO', 'MICRO', 'MID', 'MACRO', 'MEGA'];
  const creatorIdx = TIER_ORDER.indexOf(creatorTier);
  const minDist = preferredTiers.reduce((min, t) => {
    const dist = Math.abs(TIER_ORDER.indexOf(t) - creatorIdx);
    return Math.min(min, dist);
  }, Infinity);

  if (minDist === 1) return 65;
  if (minDist === 2) return 40;
  return 20;
}

function scoreBudgetFit(
  minRate: number | null,
  maxRate: number | null,
  campaignBudgetPerCreator: number
): number {
  if (!minRate && !maxRate) return 70;
  const min = minRate || 0;
  const max = maxRate || min * 3;

  if (campaignBudgetPerCreator >= min && campaignBudgetPerCreator <= max) return 100;
  if (campaignBudgetPerCreator >= min * 0.7 && campaignBudgetPerCreator < min) return 70;
  if (campaignBudgetPerCreator > max && campaignBudgetPerCreator <= max * 1.3) return 60;
  return 30;
}

async function generateAIReason(
  creator: CreatorWithProfiles,
  campaign: CampaignFull,
  breakdown: MatchScoreBreakdown
): Promise<string> {
  const completion = await openai!.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are an influencer marketing AI broker. Write a 2-3 sentence explanation for why this creator is a good match for this campaign. Be specific and data-driven. Keep it professional and concise.',
      },
      {
        role: 'user',
        content: `Creator: ${creator.niches.join(', ')} creator with ${creator.totalFollowers.toLocaleString()} followers, ${creator.avgEngagementRate}% engagement rate. Tier: ${creator.tier}. Audience: ${creator.audienceGender || 'mixed'} ${creator.audienceAgeRange || ''}.
Campaign: ${campaign.title} — ${campaign.description.slice(0, 200)}. Niches: ${campaign.niches.join(', ')}. Platforms: ${(campaign.platforms as string[]).join(', ')}.
Match scores: Niche ${breakdown.nicheRelevance}%, Audience ${breakdown.audienceFit}%, Engagement ${breakdown.engagementQuality}%, Overall ${breakdown.overall}%.
Explain why this is a ${breakdown.overall >= 80 ? 'strong' : breakdown.overall >= 60 ? 'good' : 'moderate'} match.`,
      },
    ],
    max_tokens: 150,
  });
  return completion.choices[0].message.content || '';
}

function generateRuleBasedReason(
  creator: CreatorWithProfiles,
  campaign: CampaignFull,
  breakdown: MatchScoreBreakdown
): string {
  const strengths: string[] = [];
  if (breakdown.nicheRelevance >= 70) {
    strengths.push(`strong niche alignment in ${creator.niches.slice(0, 2).join(' and ')}`);
  }
  if (breakdown.engagementQuality >= 70) {
    strengths.push(`above-average engagement rate of ${creator.avgEngagementRate.toFixed(1)}%`);
  }
  if (breakdown.audienceFit >= 70) {
    strengths.push(`audience demographics match your target market`);
  }
  if (breakdown.platformFit >= 70) {
    strengths.push(`active on your required platforms`);
  }

  if (strengths.length === 0) {
    return `This creator has potential for your campaign with room for growth in alignment.`;
  }
  return `This creator is a ${breakdown.overall >= 80 ? 'top' : 'solid'} match due to ${strengths.join(', ')}.`;
}

export async function runMatchingForCampaign(campaignId: string): Promise<void> {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { matches: true },
  });
  if (!campaign) return;

  const creators = await prisma.creator.findMany({
    where: { profileComplete: true },
    include: { socialProfiles: true },
  });

  await prisma.campaignMatch.deleteMany({
    where: { campaignId, status: 'pending' },
  });

  const matchPromises = creators.map(async (creator) => {
    const { score, breakdown, reason } = await scoreCreatorForCampaign(creator, campaign);
    if (score < 40) return null;

    return prisma.campaignMatch.create({
      data: {
        campaignId,
        creatorId: creator.id,
        score,
        breakdown: breakdown as unknown as Prisma.InputJsonValue,
        reason,
        status: 'pending',
      },
    });
  });

  const results = await Promise.all(matchPromises);
  const created = results.filter(Boolean).length;

  await prisma.campaign.update({
    where: { id: campaignId },
    data: { status: 'MATCHING', matchCount: created },
  });

  const brand = await prisma.brand.findUnique({
    where: { id: campaign.brandId },
    include: { user: true },
  });
  if (brand) {
    await prisma.notification.create({
      data: {
        userId: brand.userId,
        title: 'AI Match Results Ready',
        body: `Found ${created} creator matches for "${campaign.title}". Review them now!`,
        type: 'match',
        link: `/brand/campaigns/${campaignId}`,
      },
    });
  }
}

export async function analyzeCreatorProfile(profile: {
  handle: string;
  bio: string;
  recentCaptions?: string[];
  hashtags?: string[];
}): Promise<{
  niches: string[];
  contentTypes: string[];
  audienceSummary: string;
  brandSafetyScore: number;
  summary: string;
}> {
  const KNOWN_NICHES = [
    'Fashion',
    'Beauty',
    'Tech',
    'Gaming',
    'Fitness',
    'Food',
    'Travel',
    'Music',
    'Lifestyle',
    'Sports',
    'Education',
    'Finance',
    'Parenting',
    'Entertainment',
  ];

  if (!openai) {
    const bioLower = profile.bio.toLowerCase();
    const detectedNiches = KNOWN_NICHES.filter((n) => bioLower.includes(n.toLowerCase()));
    return {
      niches: detectedNiches.length ? detectedNiches : ['Lifestyle'],
      contentTypes: ['Posts', 'Stories'],
      audienceSummary: 'General audience',
      brandSafetyScore: 80,
      summary: `@${profile.handle} — content creator in ${detectedNiches.join(', ') || 'lifestyle'}.`,
    };
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an influencer analyst. Analyze this creator's profile and return JSON with:
- niches: array of 1-3 niches from: ${KNOWN_NICHES.join(', ')}
- contentTypes: array of content types (e.g. Tutorials, Reviews, Vlogs, Lifestyle, Unboxing)
- audienceSummary: one sentence about likely audience
- brandSafetyScore: 0-100 (check bio for controversy, inappropriate content, politics)
- summary: 1 sentence bio summary for brands`,
      },
      {
        role: 'user',
        content: `Handle: @${profile.handle}
Bio: ${profile.bio}
Recent captions: ${profile.recentCaptions?.slice(0, 3).join(' | ') || 'N/A'}
Hashtags: ${profile.hashtags?.slice(0, 10).join(', ') || 'N/A'}`,
      },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 300,
  });

  try {
    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch {
    return {
      niches: ['Lifestyle'],
      contentTypes: ['Posts'],
      audienceSummary: 'General audience',
      brandSafetyScore: 75,
      summary: `@${profile.handle} is a content creator.`,
    };
  }
}
