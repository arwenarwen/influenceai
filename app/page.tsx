import Link from 'next/link';
import {
  ArrowRight, Bot, BarChart3, Users, Zap, Star, TrendingUp, Shield,
  Globe, MapPin, CheckCircle, Dumbbell, Heart, Package, Shirt, Cpu,
  Sparkles, Play, Instagram, Youtube, ShoppingBag, Camera, Mic2, Music2,
  BadgeCheck, ChevronRight,
} from 'lucide-react';

// ─── Theme tokens ──────────────────────────────────────────────────────────
// Mint primary:  #00BFA5   Mint dark: #007A6E
// Deep text:     #0A1F1C   Body text: #374151   Muted: #9CA3AF
// BG white:      #FFFFFF   BG tint:   #F0FDF9
// Border:        rgba(0,191,165,0.2)

// ─── Logo ──────────────────────────────────────────────────────────────────
function NomiLogo({ size = 40 }: { size?: number }) {
  const s = size / 50;
  return (
    <svg width={185 * s} height={50 * s} viewBox="0 0 185 50" fill="none">
      <text x="0" y="42" fontSize="50" fontWeight="900" fill="#0A1F1C" fontFamily="Arial, sans-serif">N</text>
      <circle cx="63" cy="25" r="20" stroke="#00BFA5" strokeWidth="2.5" fill="none" />
      <ellipse cx="63" cy="25" rx="11" ry="20" stroke="#00BFA5" strokeWidth="1.5" fill="none" />
      <line x1="43" y1="25" x2="83" y2="25" stroke="#00BFA5" strokeWidth="2.5" />
      <line x1="48" y1="13" x2="78" y2="13" stroke="#00BFA5" strokeWidth="1.2" />
      <line x1="48" y1="37" x2="78" y2="37" stroke="#00BFA5" strokeWidth="1.2" />
      <text x="97" y="42" fontSize="50" fontWeight="900" fill="#0A1F1C" fontFamily="Arial, sans-serif">M</text>
      <text x="138" y="42" fontSize="50" fontWeight="900" fill="#0A1F1C" fontFamily="Arial, sans-serif">I</text>
    </svg>
  );
}
function NomiLogoSmall() {
  return (
    <svg width="111" height="30" viewBox="0 0 185 50" fill="none">
      <text x="0" y="42" fontSize="50" fontWeight="900" fill="#0A1F1C" fontFamily="Arial, sans-serif">N</text>
      <circle cx="63" cy="25" r="20" stroke="#00BFA5" strokeWidth="2.5" fill="none" />
      <ellipse cx="63" cy="25" rx="11" ry="20" stroke="#00BFA5" strokeWidth="1.5" fill="none" />
      <line x1="43" y1="25" x2="83" y2="25" stroke="#00BFA5" strokeWidth="2.5" />
      <line x1="48" y1="13" x2="78" y2="13" stroke="#00BFA5" strokeWidth="1.2" />
      <line x1="48" y1="37" x2="78" y2="37" stroke="#00BFA5" strokeWidth="1.2" />
      <text x="97" y="42" fontSize="50" fontWeight="900" fill="#0A1F1C" fontFamily="Arial, sans-serif">M</text>
      <text x="138" y="42" fontSize="50" fontWeight="900" fill="#0A1F1C" fontFamily="Arial, sans-serif">I</text>
    </svg>
  );
}

// ─── Creator Card ──────────────────────────────────────────────────────────
interface Creator {
  name: string;
  handle: string;
  niche: string;
  followers: string;
  engagement: string;
  platforms: string[];
  coverGrad: [string, string];
  avatarGrad: [string, string];
  initials: string;
  badge?: string;
  emoji: string;
  tier: 'MEGA' | 'RISING' | 'AUTHORITY';
}

function CreatorCard({ c, compact = false }: { c: Creator; compact?: boolean }) {
  const tierColor: Record<string, string> = { MEGA: '#00BFA5', RISING: '#3B82F6', AUTHORITY: '#8B5CF6' };
  return (
    <div
      className="rounded-2xl overflow-hidden bg-white flex flex-col"
      style={{ border: '1px solid rgba(0,191,165,0.18)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
    >
      {/* Cover */}
      <div
        className="relative flex items-end justify-end p-3"
        style={{
          height: compact ? 72 : 100,
          background: `linear-gradient(135deg, ${c.coverGrad[0]}, ${c.coverGrad[1]})`,
        }}
      >
        <span style={{ fontSize: compact ? 28 : 36, lineHeight: 1 }}>{c.emoji}</span>
        {c.badge && (
          <div
            className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold text-white"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
          >
            {c.badge}
          </div>
        )}
      </div>

      {/* Avatar + info */}
      <div className="px-4 pb-4">
        <div className="flex items-end justify-between -mt-6 mb-2">
          <div
            className="h-12 w-12 rounded-full border-3 border-white flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${c.avatarGrad[0]}, ${c.avatarGrad[1]})`,
              border: '3px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {c.initials}
          </div>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${tierColor[c.tier]}18`, color: tierColor[c.tier] }}
          >
            {c.tier}
          </span>
        </div>

        <div className="flex items-center gap-1 mb-0.5">
          <span className="font-bold text-sm" style={{ color: '#0A1F1C' }}>{c.name}</span>
          <BadgeCheck className="h-3.5 w-3.5" style={{ color: '#00BFA5' }} />
        </div>
        <div className="text-xs mb-2" style={{ color: '#9CA3AF' }}>@{c.handle}</div>

        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: 'rgba(0,191,165,0.1)', color: '#007A6E' }}
          >
            {c.niche}
          </span>
          {c.platforms.includes('TikTok') && <span className="text-xs">🎵</span>}
          {c.platforms.includes('Instagram') && <span className="text-xs">📸</span>}
          {c.platforms.includes('YouTube') && <span className="text-xs">▶️</span>}
          {c.platforms.includes('Amazon') && <span className="text-xs">📦</span>}
        </div>

        <div className="flex gap-4">
          <div>
            <div className="text-sm font-bold" style={{ color: '#0A1F1C' }}>{c.followers}</div>
            <div className="text-xs" style={{ color: '#9CA3AF' }}>followers</div>
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: '#00BFA5' }}>{c.engagement}</div>
            <div className="text-xs" style={{ color: '#9CA3AF' }}>engagement</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────

const FEATURED_CREATORS: Creator[] = [
  {
    name: 'Michael Jaroh',
    handle: 'michaeljaroh',
    niche: 'Gymnastics',
    followers: '1.9M',
    engagement: '8.2%',
    platforms: ['TikTok', 'Instagram'],
    coverGrad: ['#00BFA5', '#007A6E'],
    avatarGrad: ['#00BFA5', '#004D40'],
    initials: 'MJ',
    badge: '2028 Olympic Hopeful',
    emoji: '🤸',
    tier: 'MEGA',
  },
  {
    name: 'Kacper Garnczarek',
    handle: 'gym.kapi',
    niche: 'Gymnastics',
    followers: '466K',
    engagement: '11.4%',
    platforms: ['TikTok', 'Instagram'],
    coverGrad: ['#3B82F6', '#1D4ED8'],
    avatarGrad: ['#3B82F6', '#1E3A8A'],
    initials: 'KG',
    badge: 'Polish National Team',
    emoji: '🏅',
    tier: 'RISING',
  },
  {
    name: 'Edriss Ndiaye',
    handle: 'edriss_fence',
    niche: 'Fencing',
    followers: '76K',
    engagement: '14.2%',
    platforms: ['TikTok', 'Instagram'],
    coverGrad: ['#8B5CF6', '#6D28D9'],
    avatarGrad: ['#8B5CF6', '#4C1D95'],
    initials: 'EN',
    badge: '2× NCAA All-American',
    emoji: '🤺',
    tier: 'AUTHORITY',
  },
];

const MORE_CREATORS: Creator[] = [
  {
    name: 'Sofia Martinez',
    handle: 'sofialifts',
    niche: 'Fitness & Wellness',
    followers: '890K',
    engagement: '7.8%',
    platforms: ['TikTok', 'Instagram', 'YouTube'],
    coverGrad: ['#F59E0B', '#D97706'],
    avatarGrad: ['#F59E0B', '#92400E'],
    initials: 'SM',
    badge: 'Certified PT',
    emoji: '💪',
    tier: 'RISING',
  },
  {
    name: 'Jake Thornton',
    handle: 'jakerecovers',
    niche: 'Recovery & Health',
    followers: '340K',
    engagement: '9.6%',
    platforms: ['TikTok', 'YouTube', 'Amazon'],
    coverGrad: ['#EC4899', '#BE185D'],
    avatarGrad: ['#EC4899', '#831843'],
    initials: 'JT',
    badge: 'Sports Physio',
    emoji: '🧘',
    tier: 'RISING',
  },
  {
    name: 'Priya Kapoor',
    handle: 'priyaruns',
    niche: 'Running & Nutrition',
    followers: '1.2M',
    engagement: '6.4%',
    platforms: ['TikTok', 'Instagram'],
    coverGrad: ['#10B981', '#047857'],
    avatarGrad: ['#10B981', '#064E3B'],
    initials: 'PK',
    badge: 'USA Track & Field',
    emoji: '🏃',
    tier: 'MEGA',
  },
  {
    name: 'Alex Chen',
    handle: 'alexgeartech',
    niche: 'Health Tech',
    followers: '203K',
    engagement: '12.1%',
    platforms: ['YouTube', 'Amazon', 'TikTok'],
    coverGrad: ['#0EA5E9', '#0369A1'],
    avatarGrad: ['#0EA5E9', '#0C4A6E'],
    initials: 'AC',
    emoji: '⌚',
    tier: 'AUTHORITY',
  },
  {
    name: 'Destiny Williams',
    handle: 'destinyactive',
    niche: 'Activewear',
    followers: '657K',
    engagement: '9.9%',
    platforms: ['Instagram', 'TikTok'],
    coverGrad: ['#F97316', '#C2410C'],
    avatarGrad: ['#F97316', '#7C2D12'],
    initials: 'DW',
    badge: 'Brand Ambassador',
    emoji: '👟',
    tier: 'RISING',
  },
  {
    name: 'Marcus Reid',
    handle: 'marcusstrength',
    niche: 'Strength & Coaching',
    followers: '88K',
    engagement: '16.3%',
    platforms: ['YouTube', 'Instagram', 'Amazon'],
    coverGrad: ['#6366F1', '#4338CA'],
    avatarGrad: ['#6366F1', '#312E81'],
    initials: 'MR',
    badge: 'NSCA Certified',
    emoji: '🏋️',
    tier: 'AUTHORITY',
  },
];

const NICHES = [
  { emoji: '🤸', label: 'Gymnastics & Athletics', count: '120+ creators' },
  { emoji: '💪', label: 'Fitness & Training', count: '480+ creators' },
  { emoji: '🧘', label: 'Wellness & Recovery', count: '310+ creators' },
  { emoji: '🥗', label: 'Nutrition & Diet', count: '260+ creators' },
  { emoji: '👟', label: 'Activewear & Gear', count: '390+ creators' },
  { emoji: '⌚', label: 'Health Tech', count: '180+ creators' },
  { emoji: '🏃', label: 'Running & Endurance', count: '220+ creators' },
  { emoji: '🏋️', label: 'Strength & Powerlifting', count: '300+ creators' },
  { emoji: '🛁', label: 'Athletic Skincare', count: '140+ creators' },
  { emoji: '💊', label: 'Sports Nutrition', count: '430+ creators' },
  { emoji: '🏊', label: 'Swimming & Aquatics', count: '95+ creators' },
  { emoji: '🎯', label: 'Competitive Sports', count: '170+ creators' },
];

const STATS = [
  { value: '10K+', label: 'Vetted US Creators', labelCn: '精选美国创作者' },
  { value: '2.1M+', label: 'Network Reach', labelCn: '全网粉丝覆盖' },
  { value: '80M+', label: 'Total Content Likes', labelCn: '内容总点赞量' },
  { value: '98%', label: 'Match Accuracy', labelCn: '匹配准确率' },
];

const PLATFORM_ICONS = [
  { name: 'TikTok Shop', icon: '🎵', desc: 'Live commerce · 达人带货', color: '#FF0050' },
  { name: 'Instagram', icon: '📸', desc: 'Brand content · 品牌合作', color: '#E1306C' },
  { name: 'Amazon', icon: '📦', desc: 'Reviews & storefronts · 测评推广', color: '#FF9900' },
  { name: 'YouTube', icon: '▶️', desc: 'Long-form reviews · 深度评测', color: '#FF0000' },
];

const SERVICES = [
  { icon: Bot, title: 'AI Creator Matching', titleCn: 'AI驱动匹配', desc: 'Proprietary AI ranks thousands of creators by predicted ROI, niche fit, and audience authenticity for your specific product.' },
  { icon: Globe, title: 'Bilingual Strategy', titleCn: '中美双语服务', desc: 'NYC-based team handles all strategy, negotiation, and content direction in both English and Chinese — zero friction.' },
  { icon: TrendingUp, title: 'UGC & Ad Creative', titleCn: '带货内容素材', desc: 'High-converting UGC assets for paid ads plus direct sales via TikTok Shop, Amazon storefronts, and affiliate campaigns.' },
  { icon: Shield, title: 'Content Licensing', titleCn: '内容版权授权', desc: 'We secure full licensing rights so you own creator content for your own paid ads, Amazon listings, and storefronts.' },
  { icon: Users, title: 'NIL Expertise', titleCn: '大学运动员合规', desc: 'We navigate U.S. college sports sponsorship rules (Name, Image, Likeness) so brands safely partner with NCAA athletes.' },
  { icon: BarChart3, title: 'Full Campaign Mgmt', titleCn: '全链路活动管理', desc: 'Briefing, shipping, content approval, live tracking, and performance reporting — fully managed end-to-end.' },
];

const PHASES = [
  { num: '01', phase: 'AWARENESS', phaseCn: '品牌曝光', title: 'The Elite Endorsement', titleCn: '精英背书', emoji: '🚀', desc: 'Mega-creators (1M+ followers) create a high-impact viral video featuring your product — instant brand halo effect reaching millions of U.S. consumers.' },
  { num: '02', phase: 'TRUST', phaseCn: '建立信任', title: 'Authentic Integration', titleCn: '真实生活融入', emoji: '🤝', desc: 'Rising creators weave your product naturally into their daily content — training routines, unboxing, game-day prep. Deep social proof, not an ad.' },
  { num: '03', phase: 'CONVERSION', phaseCn: '驱动转化', title: 'The Expert Review', titleCn: '专家深度评测', emoji: '💰', desc: 'Authority athletes and coaches deliver detailed technical reviews targeting high-intent buyers — driving direct purchases on Amazon and TikTok Shop.' },
];

const PRICING = [
  {
    tier: 'Starter', tierCn: '入门测试', price: '$3,000', priceSuffix: '– $5,000',
    desc: 'Test content formats and audience response before scaling.',
    features: ['Strategy & creator brief', '5–10 micro-influencers or UGC creators', '15–20 ready-to-use video assets', 'TikTok or Amazon targeting', 'Performance summary report'],
    highlight: false,
  },
  {
    tier: 'Growth', tierCn: '品牌增长', price: '$10,000', priceSuffix: '+',
    desc: 'Full influencer campaigns for brands serious about the U.S. market.',
    features: ['End-to-end campaign management', 'Mid-tier & mega creator placement', 'TikTok + Amazon + Instagram', 'Content licensing rights included', 'Dedicated bilingual account manager', 'Live performance dashboard'],
    highlight: true,
  },
  {
    tier: 'Performance', tierCn: '效果分成', price: 'Base + %', priceSuffix: 'commission',
    desc: 'Affiliate-driven model for TikTok Shop and Amazon — pay for results.',
    features: ['Base retainer + 10–20% commission', 'TikTok Shop affiliate activation', 'Amazon storefront creator seeding', 'Ongoing relationship management', 'Unlimited scale'],
    highlight: false,
  },
];

const TESTIMONIALS = [
  { name: 'Zhang Wei', role: 'CMO, ShineMax Beauty', avatar: 'ZW', grad: ['#00BFA5', '#007A6E'], text: 'NOMI found us 20 authentic US creators in one week. Our TikTok Shop sales grew 4x in the first campaign. The bilingual team made everything seamless.', rating: 5 },
  { name: 'Ashley Rodriguez', role: 'Lifestyle Creator · 890K', avatar: 'AR', grad: ['#EC4899', '#BE185D'], text: "NOMI connects me with brands I genuinely love. They handle all translations and negotiations — I just create. Best partnership experience I've had.", rating: 5 },
  { name: 'Li Hao', role: 'Founder, TechGear Pro', avatar: 'LH', grad: ['#6366F1', '#4338CA'], text: '我们第一次进军美国市场就选择了NOMI，AI匹配系统帮我们找到了完美的科技类创作者，ROI超出预期200%。', rating: 5 },
];

// ─── Page ──────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF', color: '#0A1F1C' }}>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50" style={{ backgroundColor: 'rgba(255,255,255,0.96)', borderBottom: '1px solid rgba(0,191,165,0.18)', backdropFilter: 'blur(14px)' }}>
        <div className="container flex h-16 items-center justify-between">
          <NomiLogoSmall />
          <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: '#6B7280' }}>
            <a href="#creators" className="hover:text-[#00BFA5] transition-colors">Creators</a>
            <a href="#services" className="hover:text-[#00BFA5] transition-colors">Services</a>
            <a href="#how-it-works" className="hover:text-[#00BFA5] transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-[#00BFA5] transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <button className="text-sm px-4 py-2 rounded-lg transition-colors" style={{ color: '#374151', border: '1px solid rgba(0,0,0,0.1)' }}>Sign in</button>
            </Link>
            <Link href="/sign-up">
              <button className="text-sm px-4 py-2 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, #00BFA5, #007A6E)' }}>Get started →</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16 pb-0" style={{ backgroundColor: '#F0FDF9' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 60% 30%, rgba(0,191,165,0.14) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(rgba(0,191,165,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,165,1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center pb-16">

            {/* Left — copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{ border: '1px solid rgba(0,191,165,0.4)', backgroundColor: 'rgba(0,191,165,0.08)', color: '#007A6E' }}>
                <Bot className="h-3.5 w-3.5" />
                AI Creator Matching · 纽约双语团队
              </div>

              <div className="mb-4">
                <NomiLogo size={56} />
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight" style={{ color: '#0A1F1C' }}>
                Go Global,{' '}
                <span style={{ color: '#00BFA5' }}>Stay Local</span>
              </h1>
              <p className="text-xl font-medium mb-2" style={{ color: '#007A6E' }}>出海有声，品牌有信</p>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: '#4B5563', maxWidth: 480 }}>
                Connecting Chinese brands with elite U.S. creators — NCAA athletes, Team USA competitors, and top lifestyle influencers — to build the trust that drives real sales.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link href="/sign-up?role=BRAND">
                  <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-base hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, #00BFA5, #007A6E)', boxShadow: '0 0 28px rgba(0,191,165,0.3)' }}>
                    我是品牌方 · I&apos;m a Brand <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href="/sign-up?role=CREATOR">
                  <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-colors" style={{ border: '1px solid rgba(0,191,165,0.4)', color: '#007A6E', backgroundColor: 'rgba(0,191,165,0.06)' }}>
                    我是创作者 · Join as Creator
                  </button>
                </Link>
              </div>

              <div className="flex items-center gap-2" style={{ color: '#9CA3AF' }}>
                <MapPin className="h-4 w-4" style={{ color: '#00BFA5' }} />
                <span className="text-sm">NYC Based · Bilingual Team · 纽约本土双语团队</span>
              </div>
            </div>

            {/* Right — creator cards collage */}
            <div className="relative hidden lg:block h-[520px]">
              {/* Main featured card */}
              <div className="absolute left-0 top-10 w-64 z-20" style={{ transform: 'rotate(-2deg)' }}>
                <CreatorCard c={FEATURED_CREATORS[0]} />
              </div>
              {/* Second card */}
              <div className="absolute right-0 top-0 w-60 z-10" style={{ transform: 'rotate(2deg)' }}>
                <CreatorCard c={FEATURED_CREATORS[1]} />
              </div>
              {/* Third card */}
              <div className="absolute right-16 bottom-4 w-58 z-30" style={{ transform: 'rotate(-1deg)' }}>
                <CreatorCard c={FEATURED_CREATORS[2]} />
              </div>

              {/* Floating stats badge */}
              <div className="absolute left-52 top-8 z-40 rounded-xl px-4 py-3 bg-white" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.1)', border: '1px solid rgba(0,191,165,0.2)' }}>
                <div className="text-xs font-semibold mb-0.5" style={{ color: '#9CA3AF' }}>Avg. Engagement</div>
                <div className="text-2xl font-extrabold" style={{ color: '#00BFA5' }}>11.4%</div>
              </div>

              {/* Floating platform badge */}
              <div className="absolute left-4 bottom-20 z-40 rounded-xl px-4 py-3 bg-white" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.1)', border: '1px solid rgba(0,191,165,0.2)' }}>
                <div className="text-xs font-semibold mb-1.5" style={{ color: '#9CA3AF' }}>Live on</div>
                <div className="flex gap-2 text-lg">🎵 📸 ▶️ 📦</div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 pt-2">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl p-5 text-center bg-white" style={{ border: '1px solid rgba(0,191,165,0.18)', boxShadow: '0 2px 12px rgba(0,191,165,0.07)' }}>
                <div className="text-2xl md:text-3xl font-extrabold mb-1" style={{ color: '#00BFA5' }}>{s.value}</div>
                <div className="text-xs sm:text-sm font-medium" style={{ color: '#0A1F1C' }}>{s.label}</div>
                <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{s.labelCn}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platforms Strip ── */}
      <section className="py-12 bg-white" style={{ borderBottom: '1px solid rgba(0,191,165,0.12)' }}>
        <div className="container">
          <p className="text-center text-xs font-semibold tracking-widest uppercase mb-7" style={{ color: '#9CA3AF' }}>Platforms We Operate On · 覆盖平台</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {PLATFORM_ICONS.map((p) => (
              <div key={p.name} className="flex flex-col items-center gap-2 rounded-xl p-4" style={{ backgroundColor: '#F0FDF9', border: '1px solid rgba(0,191,165,0.16)' }}>
                <span className="text-3xl">{p.icon}</span>
                <span className="font-bold text-sm" style={{ color: '#0A1F1C' }}>{p.name}</span>
                <span className="text-xs text-center" style={{ color: '#6B7280' }}>{p.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Creators ── */}
      <section id="creators" className="py-24" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#00BFA5' }}>Featured Creators · 精选创作者</p>
              <h2 className="text-4xl font-bold" style={{ color: '#0A1F1C' }}>Meet our exclusive network</h2>
              <p className="mt-2" style={{ color: '#6B7280' }}>Personal relationships — not a marketplace · 独家私人关系，非达人平台</p>
            </div>
            <Link href="/sign-up">
              <button className="flex items-center gap-1.5 text-sm font-semibold hover:gap-2.5 transition-all" style={{ color: '#00BFA5' }}>
                Browse all creators <ChevronRight className="h-4 w-4" />
              </button>
            </Link>
          </div>

          {/* Featured 3 */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {FEATURED_CREATORS.map((c) => (
              <CreatorCard key={c.handle} c={c} />
            ))}
          </div>

          {/* More creators grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {MORE_CREATORS.map((c) => (
              <div key={c.handle} className="rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid rgba(0,191,165,0.15)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                {/* Mini cover */}
                <div className="relative h-16 flex items-end justify-end p-2" style={{ background: `linear-gradient(135deg, ${c.coverGrad[0]}, ${c.coverGrad[1]})` }}>
                  <span style={{ fontSize: 22 }}>{c.emoji}</span>
                </div>
                {/* Mini info */}
                <div className="p-3">
                  <div className="-mt-5 mb-2">
                    <div className="h-9 w-9 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-xs" style={{ background: `linear-gradient(135deg, ${c.avatarGrad[0]}, ${c.avatarGrad[1]})` }}>
                      {c.initials}
                    </div>
                  </div>
                  <div className="font-bold text-xs truncate" style={{ color: '#0A1F1C' }}>{c.name}</div>
                  <div className="text-xs truncate" style={{ color: '#9CA3AF' }}>@{c.handle}</div>
                  <div className="text-xs font-bold mt-1.5" style={{ color: '#00BFA5' }}>{c.followers}</div>
                  <div className="text-xs" style={{ color: '#9CA3AF' }}>followers</div>
                </div>
              </div>
            ))}
          </div>

          {/* View more CTA */}
          <div className="text-center mt-10">
            <Link href="/sign-up">
              <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, #00BFA5, #007A6E)' }}>
                Browse full creator roster · 查看所有创作者 <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Creator Niches ── */}
      <section className="py-20" style={{ backgroundColor: '#F0FDF9', borderTop: '1px solid rgba(0,191,165,0.12)' }}>
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#00BFA5' }}>Creator Niches · 达人垂类</p>
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#0A1F1C' }}>Every wellness & lifestyle vertical covered</h2>
            <p style={{ color: '#6B7280' }}>我们的创作者网络覆盖所有健康生活方式垂直品类</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {NICHES.map((n) => (
              <div key={n.label} className="rounded-xl p-4 flex items-center gap-3 bg-white hover:shadow-md transition-shadow cursor-default" style={{ border: '1px solid rgba(0,191,165,0.16)' }}>
                <span className="text-2xl flex-shrink-0">{n.emoji}</span>
                <div>
                  <div className="font-semibold text-xs leading-snug" style={{ color: '#0A1F1C' }}>{n.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#00BFA5' }}>{n.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#00BFA5' }}>Our Services · 我们的服务</p>
            <h2 className="text-4xl font-bold mb-2" style={{ color: '#0A1F1C' }}>Everything you need to go global</h2>
            <p style={{ color: '#6B7280' }}>出海全链路解决方案 · Full-stack brand globalization</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((f) => (
              <div key={f.title} className="rounded-2xl p-6 bg-white hover:-translate-y-1 transition-transform" style={{ border: '1px solid rgba(0,191,165,0.18)', boxShadow: '0 2px 12px rgba(0,191,165,0.06)' }}>
                <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(0,191,165,0.1)', border: '1px solid rgba(0,191,165,0.28)' }}>
                  <f.icon className="h-5 w-5" style={{ color: '#00BFA5' }} />
                </div>
                <h3 className="font-semibold text-lg mb-0.5" style={{ color: '#0A1F1C' }}>{f.title}</h3>
                <p className="text-xs font-medium mb-2" style={{ color: '#00BFA5' }}>{f.titleCn}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Campaign Framework ── */}
      <section id="how-it-works" className="py-24" style={{ backgroundColor: '#F0FDF9' }}>
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#00BFA5' }}>Campaign Framework · 活动执行框架</p>
            <h2 className="text-4xl font-bold mb-2" style={{ color: '#0A1F1C' }}>From unknown to trusted to purchased</h2>
            <p className="max-w-xl mx-auto" style={{ color: '#6B7280' }}>A structured three-phase campaign that moves your brand through the full funnel with real creator voices.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PHASES.map((p) => (
              <div key={p.num} className="rounded-2xl p-8 bg-white" style={{ border: '1px solid rgba(0,191,165,0.2)', boxShadow: '0 2px 14px rgba(0,191,165,0.07)' }}>
                <div className="text-4xl mb-4">{p.emoji}</div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-0.5" style={{ color: '#00BFA5' }}>{p.phase}</p>
                <p className="text-xs mb-4" style={{ color: '#9CA3AF' }}>{p.phaseCn}</p>
                <div className="text-5xl font-extrabold mb-4" style={{ background: 'linear-gradient(135deg, #00BFA5, #007A6E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{p.num}</div>
                <h3 className="font-bold text-xl mb-0.5" style={{ color: '#0A1F1C' }}>{p.title}</h3>
                <p className="text-sm font-medium mb-3" style={{ color: '#00BFA5' }}>{p.titleCn}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="hidden md:flex items-center justify-center gap-4 mt-8 max-w-5xl mx-auto px-8">
            <span className="text-xs font-medium" style={{ color: '#9CA3AF' }}>Awareness 曝光</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(0,191,165,0.3), rgba(0,122,110,0.3))' }} />
            <span className="text-xs font-medium" style={{ color: '#9CA3AF' }}>Trust 信任</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(0,122,110,0.3), rgba(0,191,165,0.3))' }} />
            <span className="text-xs font-medium" style={{ color: '#9CA3AF' }}>Conversion 转化</span>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#00BFA5' }}>Pricing · 合作方案</p>
            <h2 className="text-4xl font-bold mb-2" style={{ color: '#0A1F1C' }}>Flexible plans for every stage</h2>
            <p style={{ color: '#6B7280' }}>灵活的合作模式，适配您的品牌成长阶段</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING.map((plan) => (
              <div key={plan.tier} className="rounded-2xl p-7 flex flex-col relative bg-white" style={{ border: plan.highlight ? '2px solid #00BFA5' : '1px solid rgba(0,191,165,0.18)', boxShadow: plan.highlight ? '0 4px 28px rgba(0,191,165,0.16)' : '0 2px 10px rgba(0,191,165,0.05)' }}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #00BFA5, #007A6E)' }}>Most Popular · 最受欢迎</div>
                )}
                <div className="mb-5">
                  <h3 className="font-bold text-xl mb-0.5" style={{ color: '#0A1F1C' }}>{plan.tier}</h3>
                  <p className="text-xs mb-4" style={{ color: '#00BFA5' }}>{plan.tierCn}</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-extrabold" style={{ color: '#0A1F1C' }}>{plan.price}</span>
                    <span className="text-sm" style={{ color: '#9CA3AF' }}>{plan.priceSuffix}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{plan.desc}</p>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: '#00BFA5' }} />
                      <span className="text-sm" style={{ color: '#4B5563' }}>{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up?role=BRAND">
                  <button className="w-full py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
                    style={plan.highlight ? { background: 'linear-gradient(135deg, #00BFA5, #007A6E)', color: 'white' } : { border: '1px solid rgba(0,191,165,0.4)', color: '#007A6E', backgroundColor: 'transparent' }}>
                    Get started →
                  </button>
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-6" style={{ color: '#9CA3AF' }}>All plans include bilingual account support · 所有方案均包含中英双语客户支持</p>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24" style={{ backgroundColor: '#F0FDF9' }}>
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-2" style={{ color: '#0A1F1C' }}>Trusted by brands & creators</h2>
          <p className="text-center mb-14" style={{ color: '#9CA3AF' }}>品牌与创作者的共同选择</p>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl p-6 bg-white" style={{ border: '1px solid rgba(0,191,165,0.18)', boxShadow: '0 2px 12px rgba(0,191,165,0.06)' }}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4" style={{ fill: '#00BFA5', color: '#00BFA5' }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#4B5563' }}>&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${t.grad[0]}, ${t.grad[1]})` }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: '#0A1F1C' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: '#9CA3AF' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Creator CTA (join as creator) ── */}
      <section className="py-20 bg-white" style={{ borderTop: '1px solid rgba(0,191,165,0.12)', borderBottom: '1px solid rgba(0,191,165,0.12)' }}>
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* For brands */}
            <div className="rounded-2xl p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #00BFA5, #007A6E)' }}>
              <div className="absolute top-0 right-0 text-8xl opacity-20 -mt-4 -mr-4">🌏</div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-white opacity-75">For Brands · 品牌方</p>
              <h3 className="text-2xl font-extrabold text-white mb-3">Launch your U.S. creator campaign</h3>
              <p className="text-sm text-white opacity-75 mb-6">Tell us your product, audience, and budget — we match you with the perfect creators and handle everything bilingually.</p>
              <Link href="/sign-up?role=BRAND">
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-white hover:bg-opacity-90 transition-all" style={{ color: '#007A6E' }}>
                  Start a campaign · 开始合作 <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>

            {/* For creators */}
            <div className="rounded-2xl p-8 relative overflow-hidden bg-white" style={{ border: '2px solid rgba(0,191,165,0.3)', boxShadow: '0 4px 24px rgba(0,191,165,0.1)' }}>
              <div className="absolute top-0 right-0 text-8xl opacity-10 -mt-4 -mr-4">🎬</div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#00BFA5' }}>For Creators · 创作者</p>
              <h3 className="text-2xl font-extrabold mb-3" style={{ color: '#0A1F1C' }}>Get paid to create authentic content</h3>
              <p className="text-sm mb-6" style={{ color: '#6B7280' }}>Join NOMI&apos;s exclusive network and get matched with Chinese brands that fit your niche. We handle contracts, payments, and translations.</p>
              <Link href="/sign-up?role=CREATOR">
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, #00BFA5, #007A6E)' }}>
                  Apply to join · 申请加入 <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact / CTA ── */}
      <section id="contact" className="py-20" style={{ backgroundColor: '#F0FDF9' }}>
        <div className="container relative text-center">
          <div className="flex justify-center mb-5">
            <NomiLogo size={48} />
          </div>
          <h2 className="text-4xl font-bold mb-2" style={{ color: '#0A1F1C' }}>Ready to go global?</h2>
          <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: '#6B7280' }}>Stop competing on price. Let NOMI&apos;s creator network build the trust that turns American consumers into loyal buyers.</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm" style={{ color: '#6B7280' }}>
            {[
              { label: 'Email', value: 'partnerships@nomi-agency.com' },
              { label: 'WeChat · 微信', value: 'NOMI_Official' },
              { label: 'WhatsApp', value: '+1 (555) 123-4567' },
            ].map((item, i, arr) => (
              <div key={item.label} className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#00BFA5' }}>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                {i < arr.length - 1 && <div className="w-px h-8 hidden sm:block" style={{ backgroundColor: 'rgba(0,191,165,0.2)' }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 bg-white" style={{ borderTop: '1px solid rgba(0,191,165,0.14)' }}>
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-start gap-1">
            <NomiLogoSmall />
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>NYC Based · Bilingual Team · 纽约本土双语团队</p>
          </div>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>© 2026 NOMI. All rights reserved.</p>
          <div className="flex gap-6 text-sm" style={{ color: '#9CA3AF' }}>
            <a href="#" className="hover:text-[#00BFA5] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#00BFA5] transition-colors">Terms</a>
            <a href="#contact" className="hover:text-[#00BFA5] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
