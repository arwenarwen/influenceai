/**
 * Seed script — populates the database with demo data for testing.
 * Run with: npm run db:seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin user
  const adminPassword = await bcrypt.hash('admin123456', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@influencehub.io' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@influencehub.io',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });
  await prisma.admin.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: { userId: adminUser.id, permissions: ['all'] },
  });

  // Creator users
  const creatorData = [
    {
      name: 'Sarah Chen', email: 'sarah@creator.io',
      bio: 'Personal trainer & nutrition coach helping you build your best body 💪',
      location: 'Los Angeles, CA', niches: ['Fitness', 'Health', 'Lifestyle'],
      tier: 'MICRO' as const, totalFollowers: 89000, avgEngagementRate: 4.2,
      audienceGender: 'female', audienceAgeRange: '18-34',
      platforms: [{ platform: 'INSTAGRAM' as const, handle: 'fitlife_sarah', followers: 54000, engagementRate: 4.2 },
                  { platform: 'TIKTOK' as const, handle: 'fitlife_sarah', followers: 35000, engagementRate: 5.1 }],
    },
    {
      name: 'Marcus Johnson', email: 'marcus@creator.io',
      bio: '📱 Tech reviews & unboxings. Gadgets, phones, laptops | YouTube tech channel',
      location: 'San Francisco, CA', niches: ['Tech', 'Gaming', 'Education'],
      tier: 'MID' as const, totalFollowers: 345000, avgEngagementRate: 3.1,
      audienceGender: 'male', audienceAgeRange: '18-34',
      platforms: [{ platform: 'YOUTUBE' as const, handle: 'MarcusTechReviews', followers: 234000, engagementRate: 3.1 },
                  { platform: 'INSTAGRAM' as const, handle: 'marcustechpro', followers: 111000, engagementRate: 2.8 }],
    },
    {
      name: 'Layla Martinez', email: 'layla@creator.io',
      bio: '💄 Beauty & skincare obsessed | GRWM content | Clean beauty advocate',
      location: 'Miami, FL', niches: ['Beauty', 'Fashion', 'Lifestyle'],
      tier: 'MACRO' as const, totalFollowers: 892000, avgEngagementRate: 2.8,
      audienceGender: 'female', audienceAgeRange: '18-34',
      platforms: [{ platform: 'TIKTOK' as const, handle: 'beautybylaylamia', followers: 623000, engagementRate: 3.2 },
                  { platform: 'INSTAGRAM' as const, handle: 'layla.beauty', followers: 269000, engagementRate: 2.1 }],
    },
  ];

  for (const creator of creatorData) {
    const creatorPassword = await bcrypt.hash('creator123456', 12);
    const user = await prisma.user.upsert({
      where: { email: creator.email },
      update: {},
      create: {
        name: creator.name, email: creator.email,
        password: creatorPassword, role: 'CREATOR', emailVerified: new Date(),
      },
    });

    const creatorRecord = await prisma.creator.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        bio: creator.bio,
        location: creator.location,
        niches: creator.niches,
        tier: creator.tier,
        totalFollowers: creator.totalFollowers,
        avgEngagementRate: creator.avgEngagementRate,
        audienceGender: creator.audienceGender,
        audienceAgeRange: creator.audienceAgeRange,
        audienceLocations: ['United States'],
        minRatePerPost: 500,
        maxRatePerPost: creator.tier === 'MACRO' ? 8000 : creator.tier === 'MID' ? 3000 : 1500,
        profileComplete: true,
        rating: 4.5 + Math.random() * 0.5,
        reviewCount: Math.floor(Math.random() * 20) + 5,
      },
    });

    for (const platform of creator.platforms) {
      await prisma.socialProfile.upsert({
        where: { creatorId_platform: { creatorId: creatorRecord.id, platform: platform.platform } },
        update: {},
        create: {
          creatorId: creatorRecord.id,
          platform: platform.platform,
          handle: platform.handle,
          followers: platform.followers,
          engagementRate: platform.engagementRate,
          isPublic: true,
        },
      });
    }
  }

  // Brand users
  const brandPassword = await bcrypt.hash('brand123456', 12);
  const brandUser = await prisma.user.upsert({
    where: { email: 'hello@techvibe.com' },
    update: {},
    create: {
      name: 'TechVibe Marketing', email: 'hello@techvibe.com',
      password: brandPassword, role: 'BRAND', emailVerified: new Date(),
    },
  });

  const brand = await prisma.brand.upsert({
    where: { userId: brandUser.id },
    update: {},
    create: {
      userId: brandUser.id,
      companyName: 'TechVibe',
      industry: 'Technology',
      website: 'https://techvibe.example.com',
      description: 'We build innovative tech products for the modern consumer',
      contactName: 'Alex Kim',
      verified: true,
      preferredTiers: ['MICRO', 'MID'],
      preferredNiches: ['Tech', 'Gaming', 'Lifestyle'],
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📝 Demo Accounts:');
  console.log('  Admin:   admin@influencehub.io / admin123456');
  console.log('  Creator: sarah@creator.io / creator123456');
  console.log('  Creator: marcus@creator.io / creator123456');
  console.log('  Brand:   hello@techvibe.com / brand123456');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
