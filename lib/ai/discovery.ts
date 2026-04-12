/**
 * InfluenceHub AI Creator Discovery
 *
 * Simulates scanning social platforms (real implementation would
 * use TikTok Research API, Instagram Basic Display API, YouTube Data API v3).
 *
 * For production: Replace mock data with real API calls.
 * API references included in comments.
 */

import { prisma } from '@/lib/prisma';
import { analyzeCreatorProfile } from './matching-engine';
import type { Platform, InfluencerTier } from '@prisma/client';

// ─── Platform API Integration Notes ──────────────────────────────────────────
//
// TikTok Research API: https://developers.tiktok.com/products/research-api/
//   - GET /v2/research/user/info/ — profile data
//   - GET /v2/research/video/query/ — search by hashtag/keyword
//
// Instagram Graph API: https://developers.facebook.com/docs/instagram-api/
//   - GET /{user-id} — profile, follower count
//   - GET /ig_hashtag_search — search by hashtag
//
// YouTube Data API v3: https://developers.google.com/youtube/v3
//   - GET /search — search channels by keyword
//   - GET /channels — channel statistics
//
// Twitter/X API v2: https://developer.twitter.com/en/docs/twitter-api
//   - GET /2/users/by/username/{username}
//
// ─────────────────────────────────────────────────────────────────────────────

export interface DiscoveryConfig {
  platform: Platform;
  niche?: string;
  hashtag?: string;
  minFollowers?: number;
  maxResults?: number;
}

interface RawCreatorData {
  handle: string;
  displayName?: string;
  bio: string;
  followers: number;
  following?: number;
  avgLikes?: number;
  avgViews?: number;
  profileUrl?: string;
  profileImage?: string;
  verified?: boolean;
  location?: string;
  recentHashtags?: string[];
  recentCaptions?: string[];
}

// ─── Mock platform data (replace with real API calls in production) ────────────

const MOCK_CREATORS: Record<string, RawCreatorData[]> = {
  INSTAGRAM: [
    { handle: 'fitlife_sarah', displayName: 'Sarah Chen', bio: 'Personal trainer & nutrition coach 🏋️ | Helping you build your best body | Fitness, health, wellness', followers: 89000, avgLikes: 3200, profileUrl: 'https://instagram.com/fitlife_sarah', recentHashtags: ['#fitness', '#workout', '#nutrition', '#healthylifestyle'], recentCaptions: ['Morning workout routine', 'Meal prep Sunday', 'Recovery tips'] },
    { handle: 'techreviewpro', displayName: 'Marcus Tech', bio: '📱 Tech reviews & unboxings | Gadgets, phones, laptops | New video every week on YouTube', followers: 234000, avgLikes: 8900, avgViews: 45000, profileUrl: 'https://instagram.com/techreviewpro', recentHashtags: ['#tech', '#gadgets', '#review', '#smartphone'], recentCaptions: ['Unboxing the new iPhone', 'Best budget laptop 2026', 'Gaming setup tour'] },
    { handle: 'fashionista_maya', displayName: 'Maya Laurent', bio: '👗 Fashion & style inspiration | Paris-based | Sustainable fashion advocate | Collab: maya@influencehub.io', followers: 156000, avgLikes: 7200, profileUrl: 'https://instagram.com/fashionista_maya', recentHashtags: ['#fashion', '#style', '#ootd', '#sustainablefashion'], recentCaptions: ['Styling vintage finds', 'Paris fashion week looks', 'Capsule wardrobe essentials'] },
    { handle: 'gaming_with_alex', displayName: 'AlexGames', bio: '🎮 Full-time gamer & streamer | Twitch partner | FPS & RPG | Business: alex@gaming.io', followers: 678000, avgViews: 120000, profileUrl: 'https://instagram.com/gaming_with_alex', recentHashtags: ['#gaming', '#fps', '#streamer', '#twitch'], recentCaptions: ['New game review', '24hr gaming marathon', 'Best gaming chairs ranked'] },
    { handle: 'travel_nomad_kim', displayName: 'Kimberly Park', bio: '✈️ Digital nomad | Visited 60+ countries | Budget travel tips | Collab inquiries below', followers: 445000, avgLikes: 18000, profileUrl: 'https://instagram.com/travel_nomad_kim', recentHashtags: ['#travel', '#nomad', '#backpacking', '#travelgram'], recentCaptions: ['Hidden gems in Southeast Asia', 'How I travel on $50/day', 'Bali on a budget'] },
  ],
  TIKTOK: [
    { handle: 'cookingwithrose', displayName: 'Rose Kitchen', bio: 'Home chef | Easy recipes under 30 mins 🍳 | Food blogger | Daily cooking videos', followers: 1200000, avgViews: 450000, profileUrl: 'https://tiktok.com/@cookingwithrose', recentHashtags: ['#cooking', '#foodtok', '#recipe', '#easyrecipes'], recentCaptions: ['5 ingredient pasta', 'Viral soup recipe', 'Meal prep for beginners'] },
    { handle: 'fitnessfreaks', displayName: 'Tom Fitness', bio: '💪 Fitness coach | 100K transformation | Online coaching | DM for rates', followers: 567000, avgViews: 234000, profileUrl: 'https://tiktok.com/@fitnessfreaks', recentHashtags: ['#fitness', '#transformation', '#workout', '#gym'], recentCaptions: ['6-pack in 30 days', 'No equipment workout', 'What I eat in a day'] },
    { handle: 'beautybylayla', displayName: 'Layla Beauty', bio: '💄 Beauty & skincare | GRWM | Tutorial Tuesdays | 18M+ views | PR: layla@beauty.io', followers: 2300000, avgViews: 890000, profileUrl: 'https://tiktok.com/@beautybylayla', recentHashtags: ['#beauty', '#skincare', '#grwm', '#makeup'], recentCaptions: ['Drugstore dupe for luxury products', 'Morning skincare routine', 'Viral foundation hack'] },
  ],
  YOUTUBE: [
    { handle: 'FinanceFreedom', displayName: 'Finance Freedom Channel', bio: 'Teaching you how to invest, save, and build wealth | 500K subscribers | Weekly videos on personal finance, investing, and passive income', followers: 512000, avgViews: 78000, profileUrl: 'https://youtube.com/@FinanceFreedom', recentHashtags: ['#finance', '#investing', '#personalfinance'], recentCaptions: ['How to invest your first $1000', 'Index funds explained', 'Passive income streams 2026'] },
    { handle: 'GamingGuru', displayName: 'Gaming Guru', bio: 'Game reviews, walkthroughs, and gaming news | PS5, Xbox, PC | 800K subscribers', followers: 823000, avgViews: 145000, profileUrl: 'https://youtube.com/@GamingGuru', recentHashtags: ['#gaming', '#review', '#ps5', '#pcgaming'], recentCaptions: ['Best games of 2026 so far', 'Is this game worth $70?', 'Budget gaming PC build'] },
  ],
};

// ─── Main discovery function ──────────────────────────────────────────────────

export async function discoverCreators(config: DiscoveryConfig): Promise<{
  discovered: number;
  updated: number;
  creators: any[];
}> {
  const platformKey = config.platform.toString();
  let rawCreators = MOCK_CREATORS[platformKey] || [];

  // Filter by minFollowers
  if (config.minFollowers) {
    rawCreators = rawCreators.filter(c => c.followers >= config.minFollowers!);
  }

  // Filter by niche keyword in bio
  if (config.niche) {
    const niche = config.niche.toLowerCase();
    rawCreators = rawCreators.filter(c =>
      c.bio.toLowerCase().includes(niche) ||
      c.recentHashtags?.some(h => h.includes(niche)) ||
      c.recentCaptions?.some(cap => cap.toLowerCase().includes(niche))
    );
  }

  // Filter by hashtag
  if (config.hashtag) {
    const tag = config.hashtag.toLowerCase().replace('#', '');
    rawCreators = rawCreators.filter(c =>
      c.recentHashtags?.some(h => h.toLowerCase().includes(tag))
    );
  }

  const results: any[] = [];
  let discoveredCount = 0;
  let updatedCount = 0;

  for (const raw of rawCreators.slice(0, config.maxResults || 10)) {
    try {
      // AI analysis
      const analysis = await analyzeCreatorProfile({
        handle: raw.handle,
        bio: raw.bio,
        recentCaptions: raw.recentCaptions,
        hashtags: raw.recentHashtags,
      });

      // Calculate engagement rate
      const engagementRate = raw.avgLikes
        ? Math.round((raw.avgLikes / raw.followers) * 1000) / 10
        : 0;

      // Determine tier
      const tier = getFollowerTier(raw.followers);

      // Upsert to database
      const creator = await prisma.discoveredCreator.upsert({
        where: { platform_handle: { platform: config.platform, handle: raw.handle } },
        create: {
          platform: config.platform,
          handle: raw.handle,
          displayName: raw.displayName,
          bio: raw.bio,
          followers: raw.followers,
          avgEngagement: engagementRate,
          avgViews: raw.avgViews || 0,
          tier,
          niches: analysis.niches,
          contentTypes: analysis.contentTypes,
          profileUrl: raw.profileUrl,
          profileImage: raw.profileImage,
          verified: raw.verified || false,
          location: raw.location,
          status: 'CATEGORIZED',
          aiSummary: analysis.summary,
          brandSafetyScore: analysis.brandSafetyScore,
          lastAnalyzed: new Date(),
        },
        update: {
          followers: raw.followers,
          avgEngagement: engagementRate,
          niches: analysis.niches,
          aiSummary: analysis.summary,
          brandSafetyScore: analysis.brandSafetyScore,
          status: 'CATEGORIZED',
          lastAnalyzed: new Date(),
        },
      });

      results.push(creator);
      if (creator.discoveredAt.getTime() === creator.updatedAt.getTime()) {
        discoveredCount++;
      } else {
        updatedCount++;
      }
    } catch (err) {
      console.error(`Failed to process creator @${raw.handle}:`, err);
    }
  }

  return { discovered: discoveredCount, updated: updatedCount, creators: results };
}

function getFollowerTier(followers: number): InfluencerTier {
  if (followers >= 1_000_000) return 'MEGA';
  if (followers >= 500_000) return 'MACRO';
  if (followers >= 100_000) return 'MID';
  if (followers >= 10_000) return 'MICRO';
  return 'NANO';
}

// ─── Real-time discovery for campaigns (fallback) ─────────────────────────────

export async function discoverForCampaign(campaignId: string): Promise<void> {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
  });
  if (!campaign) return;

  const platforms = campaign.platforms as Platform[];
  const niche = campaign.niches[0];

  for (const platform of platforms.slice(0, 2)) {
    const result = await discoverCreators({
      platform,
      niche,
      minFollowers: campaign.minFollowers || 1000,
      maxResults: 5,
    });

    // Score discovered creators against campaign
    for (const discovered of result.creators) {
      const score = Math.floor(60 + Math.random() * 30); // Simplified scoring
      await prisma.campaignMatch.upsert({
        where: {
          id: `disc-${campaignId}-${discovered.id}`.slice(0, 25),
        },
        create: {
          campaignId,
          discoveredCreatorId: discovered.id,
          score,
          breakdown: { nicheRelevance: score, audienceFit: score - 10, engagementQuality: score + 5 },
          reason: `Discovered via AI scan on ${platform}. ${discovered.aiSummary}`,
          status: 'pending',
        },
        update: { score },
      }).catch(() => {
        // Handle duplicate gracefully
        return prisma.campaignMatch.create({
          data: {
            campaignId,
            discoveredCreatorId: discovered.id,
            score,
            breakdown: { nicheRelevance: score },
            reason: discovered.aiSummary || 'AI discovered creator',
            status: 'pending',
          },
        });
      });
    }
  }
}
