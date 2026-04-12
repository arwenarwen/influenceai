import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { InfluencerTier, Platform } from '@prisma/client';

export const maxDuration = 60;

// ─── Generator data ───────────────────────────────────────────────────────────

const FIRST_NAMES = [
  'Emma','Liam','Olivia','Noah','Ava','Ethan','Isabella','Mason','Sophia','Logan',
  'Mia','Lucas','Charlotte','Jackson','Amelia','Aiden','Harper','Carter','Evelyn','James',
  'Abigail','Sebastian','Emily','Mateo','Elizabeth','Henry','Mila','Alexander','Ella','Michael',
  'Madison','Benjamin','Scarlett','Elijah','Victoria','Daniel','Aria','Owen','Grace','Samuel',
  'Chloe','David','Camila','Joseph','Penelope','Gabriel','Riley','Julian','Layla','Ryan',
  'Zoey','Nathan','Nora','Dylan','Lily','Isaac','Eleanor','Caleb','Hannah','Christopher',
  'Lillian','Isaiah','Addison','Tyler','Aubrey','Andrew','Ellie','Dominic','Stella','John',
  'Natalie','Christian','Zoe','Jonathan','Leah','Landon','Hazel','Colton','Violet','Grayson',
  'Aurora','Jordan','Savannah','Angel','Audrey','Eli','Brooklyn','Austin','Bella','Aaron',
  'Claire','Charles','Skylar','Thomas','Lucy','Ezra','Paisley','Hudson','Everly','Lincoln',
  'Anna','Jaxon','Caroline','Jace','Genesis','Greyson','Aaliyah','Axel','Kennedy','Cooper',
  'Kinsley','Ian','Allison','Jason','Maya','Connor','Sarah','Evan','Madeline','Kevin',
  'Destiny','Robert','Ruby','Timothy','Alice','Chase','Ariana','Jeremiah','Sadie','Adrian',
  'Gabriella','Caden','Mackenzie','Blake','Peyton','Ayden','Rylee','Brandon','Lydia','Cole',
  'Claire','Luke','Autumn','Miles','Faith','Weston','Jade','Marcus','Clara','Zane','Sienna',
  'Maxwell','Naomi','Brayden','Aaliyah','Tristan','Athena','Taylor','Luna','Jake','Delilah',
  'River','Sophie','Kai','Willow','Leo','Elena','Finn','Nadia','Jude','Vera',
  'Cruz','Leilani','Nico','Maeve','Rafael','Piper','Ivan','Isla','Ezekiel','Freya',
  'Damian','Thea','Felix','Giselle','Omar','Rosa','Idris','Yara','Kofi','Amara',
];

const LAST_NAMES = [
  'Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez',
  'Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin',
  'Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson',
  'Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores',
  'Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts',
  'Gomez','Phillips','Evans','Turner','Diaz','Parker','Cruz','Edwards','Collins','Reyes',
  'Stewart','Morris','Morales','Murphy','Cook','Rogers','Gutierrez','Ortiz','Morgan','Cooper',
  'Peterson','Bailey','Reed','Kelly','Howard','Ramos','Kim','Cox','Ward','Richardson',
  'Watson','Brooks','Chavez','Wood','James','Bennett','Gray','Mendoza','Ruiz','Hughes',
  'Price','Alvarez','Castillo','Sanders','Patel','Myers','Long','Ross','Foster','Jimenez',
  'Powell','Jenkins','Perry','Russell','Sullivan','Bell','Coleman','Butler','Henderson','Barnes',
  'Gonzales','Fisher','Vasquez','Simmons','Romero','Jordan','Patterson','Alexander','Hamilton','Graham',
  'Reynolds','Griffin','Wallace','Moreno','West','Cole','Hayes','Bryant','Herrera','Gibson',
  'Ellis','Tran','Medina','Aguilar','Stevens','Murray','Ford','Castro','Marshall','Owens',
  'Harrison','Fernandez','McDonald','Woods','Washington','Kennedy','Wells','Vargas','Henry','Chen',
  'Freeman','Webb','Tucker','Guzman','Burns','Crawford','Olson','Simpson','Porter','Hunter',
  'Gordon','Mendez','Silva','Shaw','Snyder','Mason','Dixon','Munoz','Rose','Byrd',
  'Arnold','Palmer','Warren','Lucas','Bishop','Watkins','Lawson','Spencer','George','Carroll',
  'Park','Tanaka','Okafor','Mensah','Adeyemi','Nwosu','Osei','Diallo','Traore','Bakr',
  'Hassan','Ali','Khan','Singh','Sharma','Gupta','Mehta','Pham','Vo','Le',
];

const NICHES = [
  'Fitness','Beauty','Gaming','Tech','Food','Travel','Fashion','Finance','Education',
  'Music','Comedy','Lifestyle','Sports','Health','DIY','Parenting','Business',
  'Art','Photography','Pets','Cooking','Dance','Motivation','Science','Nature',
  'Skincare','Makeup','Yoga','Running','Cycling','Hiking','Vlogging','Film',
  'Books','Anime','Cars','Basketball','Soccer','Tennis','Golf','Surfing',
];

const PLATFORMS = ['YOUTUBE', 'TIKTOK', 'INSTAGRAM'] as const;

const COUNTRIES = [
  'US','GB','CA','AU','DE','FR','BR','MX','IN','PH','NG','ZA','KE','GH',
  'JP','KR','ID','TH','ES','IT','NL','SE','NO','DK','PL','AR','CO','PE',
];

const BIO_TEMPLATES: Record<string, string[]> = {
  Fitness: [
    'Personal trainer & fitness coach 💪 | Helping you reach your goals | Workout tips & nutrition',
    'Certified fitness instructor | Home workouts | Transformation specialist | DM for coaching',
    'Gym rat turned coach 🏋️ | Strength training | Meal prep | Mindset | Consistency is key',
    'NASM certified PT | Fat loss & muscle gain | Free workout plans in bio | Let\'s get fit!',
    'Fitness enthusiast | Running & HIIT | Body positivity | Making healthy living simple',
  ],
  Beauty: [
    '💄 Makeup artist & beauty blogger | Drugstore to luxury | Tutorials daily',
    'Beauty lover 💅 | GRWM | Skincare routines | Product reviews | Collab: DM me',
    'MUA based in NYC 🗽 | High fashion makeup | Bridal specialist | Booking open',
    'Clean beauty advocate | Natural & organic skincare | Ingredient educator | Glowing skin tips',
    '✨ Beauty creator | Everyday glam | Honest reviews | New look every week',
  ],
  Gaming: [
    '🎮 Full-time gamer & streamer | FPS & RPG | New videos daily | Join the squad',
    'Pro gamer | Twitch affiliate | Competitive FPS | Tips & tricks | GG always',
    'Retro gaming + new releases 🕹️ | Game reviews | Speedruns | Collecting',
    'RPG enthusiast | Story-driven games | Let\'s plays | No spoilers policy',
    '🏆 Esports player | Tournament highlights | Gaming news | Coach & mentor',
  ],
  Tech: [
    '📱 Tech reviewer | Latest gadgets, phones & laptops | Honest opinions',
    'Software engineer turned creator 💻 | Coding tutorials | Dev tools | Career tips',
    'AI & future tech 🤖 | Weekly breakdowns | No hype just facts | Subscribe for more',
    'Gadget unboxings & reviews | Budget tech finds | Best bang for your buck',
    '🔧 Tech repairs & DIY | Fixing what big tech says is broken | Right to repair advocate',
  ],
  Food: [
    '👨‍🍳 Home chef | Easy recipes under 30 mins | Comfort food & meal prep',
    'Food blogger & recipe developer | International cuisine | New recipe every day',
    'Plant-based cooking 🌱 | Vegan recipes | Making healthy food delicious',
    'Pastry chef 🎂 | Baking tutorials | Cakes, cookies & more | Cake smash specialist',
    'Street food explorer 🌮 | Reviewing local eats | Hidden gem restaurants | Food tours',
  ],
  Travel: [
    '✈️ Digital nomad | Visited 70+ countries | Budget travel tips & guides',
    'Solo traveler 🗺️ | Honest travel guides | Hidden gems | Adventure seeker',
    'Luxury travel creator ✨ | Hotels, flights & experiences | Points & miles tips',
    'Van life & road trips 🚐 | Full-time traveler | Freedom lifestyle | Community of nomads',
    'Family travel blogger 👨‍👩‍👧 | Kid-friendly destinations | Travel hacks for families',
  ],
  Fashion: [
    '👗 Fashion & style creator | Outfit inspiration | Sustainable fashion advocate',
    'Streetwear & sneakers 👟 | Daily outfits | Brand collabs | Style for everyone',
    'Plus size fashion creator 🌟 | Body positive | Style has no size | Shopping guides',
    'Vintage & thrift fashion 🛍️ | Sustainable shopping | Upcycling | Slow fashion movement',
    'Luxury fashion 💎 | Designer pieces | Investment dressing | Styling tips',
  ],
  Finance: [
    '💰 Personal finance educator | Budgeting, investing & building wealth | Free tips daily',
    'Stock market & investing 📈 | Breaking down complex finance simply | Not financial advice',
    'Crypto & blockchain educator 🔗 | DeFi explained | Market analysis | DYOR always',
    'FIRE movement advocate 🔥 | Financial independence | Retire early | Side hustles',
    'Debt-free journey 💳 | Paying off loans | Frugal living | Financial freedom is possible',
  ],
  Lifestyle: [
    '🌿 Lifestyle creator | Morning routines | Productivity | Mindful living',
    'Day in my life 📸 | Honest content | Real life, real moments | Come hang with me',
    'Minimalist lifestyle 🤍 | Less is more | Intentional living | Declutter your life',
    'Wellness & self-care 🧘 | Mental health advocate | Balance & boundaries | You matter',
    'Mom creator 👶 | Motherhood unfiltered | Parenting tips | Family life vlogs',
  ],
  Music: [
    '🎵 Singer-songwriter | Original music | Behind the scenes | New music coming soon',
    'Music producer 🎧 | Beats & instrumentals | Free samples | Collab with me',
    'Guitar player 🎸 | Tutorials & covers | From beginner to pro | Daily practice',
    'DJ & electronic music 🎛️ | Sets & mixes | Festival season | Booking open',
    'Classical musician 🎻 | Making classical accessible | Covers & originals | Concert dates in bio',
  ],
};

const DEFAULT_BIOS = [
  'Content creator | Sharing my journey | New posts daily',
  'Creating content I love | Follow for more | Collab: DM me',
  'Digital creator | Passionate about what I do | Join the community',
  'Sharing tips, tricks & my life | Content creator since 2020',
  'Just a creator sharing what I love | Thanks for being here 🙏',
];

// ─── Generator ────────────────────────────────────────────────────────────────

function seededRandom(seed: number) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function pickFrom<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function generateFollowers(tier: string, rng: () => number): number {
  switch (tier) {
    case 'NANO':  return Math.floor(1000 + rng() * 9000);
    case 'MICRO': return Math.floor(10000 + rng() * 90000);
    case 'MID':   return Math.floor(100000 + rng() * 400000);
    case 'MACRO': return Math.floor(500000 + rng() * 500000);
    case 'MEGA':  return Math.floor(1000000 + rng() * 9000000);
    default:      return Math.floor(1000 + rng() * 50000);
  }
}

function getTierFromFollowers(followers: number): InfluencerTier {
  if (followers >= 1_000_000) return 'MEGA';
  if (followers >= 500_000)   return 'MACRO';
  if (followers >= 100_000)   return 'MID';
  if (followers >= 10_000)    return 'MICRO';
  return 'NANO';
}

interface GeneratedCreator {
  platform: Platform;
  handle: string;
  displayName: string;
  bio: string;
  followers: number;
  avgEngagement: number;
  avgViews: number;
  tier: InfluencerTier;
  niches: string[];
  contentTypes: string[];
  profileUrl: string;
  verified: boolean;
  location: string;
  status: string;
  aiSummary: string;
  brandSafetyScore: number;
}

function generateCreatorBatch(startIndex: number, count: number): GeneratedCreator[] {
  const creators: GeneratedCreator[] = [];
  const tiers = ['NANO', 'NANO', 'NANO', 'MICRO', 'MICRO', 'MICRO', 'MID', 'MID', 'MACRO', 'MEGA'];

  for (let i = 0; i < count; i++) {
    const seed = startIndex + i;
    const rng = seededRandom(seed * 7919 + 1234567);

    const firstName = pickFrom(FIRST_NAMES, rng);
    const lastName = pickFrom(LAST_NAMES, rng);
    const niche = pickFrom(NICHES, rng);
    const platform = pickFrom([...PLATFORMS], rng) as Platform;
    const tier = pickFrom(tiers, rng);
    const followers = generateFollowers(tier, rng);
    const country = pickFrom(COUNTRIES, rng);

    // Generate handle variations
    const handleVariants = [
      `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      `${firstName.toLowerCase()}_${niche.toLowerCase()}`,
      `${niche.toLowerCase()}_${firstName.toLowerCase()}`,
      `${firstName.toLowerCase()}${Math.floor(rng() * 999)}`,
      `real${firstName.toLowerCase()}${lastName.slice(0, 3).toLowerCase()}`,
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
      `the${firstName.toLowerCase()}${niche.toLowerCase()}`,
    ];
    const handle = pickFrom(handleVariants, rng).replace(/\s/g, '').slice(0, 30);

    const displayName = `${firstName} ${lastName}`;
    const bioTemplates = BIO_TEMPLATES[niche] || DEFAULT_BIOS;
    const bio = pickFrom(bioTemplates, rng);

    // Engagement rate is higher for smaller accounts
    const baseEngagement = tier === 'NANO' ? 4 + rng() * 8
      : tier === 'MICRO' ? 3 + rng() * 5
      : tier === 'MID'   ? 1.5 + rng() * 3
      : tier === 'MACRO' ? 1 + rng() * 2
      : 0.5 + rng() * 1.5;
    const avgEngagement = Math.round(baseEngagement * 10) / 10;

    const avgViews = platform === 'YOUTUBE'
      ? Math.floor(followers * (0.05 + rng() * 0.2))
      : Math.floor(followers * (0.1 + rng() * 0.5));

    const brandSafetyScore = Math.floor(65 + rng() * 35);
    const verified = followers > 500000 && rng() > 0.3;

    const platformPrefix = platform === 'YOUTUBE' ? 'youtube.com/@'
      : platform === 'TIKTOK' ? 'tiktok.com/@'
      : 'instagram.com/';

    creators.push({
      platform,
      handle,
      displayName,
      bio,
      followers,
      avgEngagement,
      avgViews,
      tier: getTierFromFollowers(followers),
      niches: [niche],
      contentTypes: ['posts', 'stories'],
      profileUrl: `https://${platformPrefix}${handle}`,
      verified,
      location: country,
      status: 'CATEGORIZED',
      aiSummary: `@${handle} — ${niche} content creator in ${country}`,
      brandSafetyScore,
    });
  }

  return creators;
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const batchSize = Math.min(parseInt(body.batchSize) || 500, 1000);

  // Find out how many creators already exist to pick a start index
  const existingCount = await prisma.discoveredCreator.count();
  const startIndex = existingCount;

  const generated = generateCreatorBatch(startIndex, batchSize);

  let inserted = 0;
  let skipped = 0;

  // Insert in chunks of 50 to avoid timeout
  const CHUNK = 50;
  for (let i = 0; i < generated.length; i += CHUNK) {
    const chunk = generated.slice(i, i + CHUNK);
    const results = await Promise.allSettled(
      chunk.map(c =>
        prisma.discoveredCreator.upsert({
          where: { platform_handle: { platform: c.platform, handle: c.handle } },
          create: { ...c, lastAnalyzed: new Date() },
          update: {},  // don't overwrite existing
        })
      )
    );
    inserted += results.filter(r => r.status === 'fulfilled').length;
    skipped  += results.filter(r => r.status === 'rejected').length;
  }

  const total = await prisma.discoveredCreator.count();

  return NextResponse.json({
    message: `Bulk import complete: ${inserted} added, ${skipped} skipped`,
    inserted,
    skipped,
    totalInDatabase: total,
  });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }
  const total = await prisma.discoveredCreator.count();
  return NextResponse.json({ total });
}
