import Link from 'next/link';
import { ArrowRight, Bot, BarChart3, Users, Zap, Star, TrendingUp, Shield, Globe, MapPin, CheckCircle, Dumbbell, Heart, Package, Shirt, Cpu, Sparkles } from 'lucide-react';

// ─── Color tokens ──────────────────────────────────────────────────────────────
// Primary mint:  #00BFA5
// Dark teal:     #007A6E
// Deep text:     #0A1F1C
// Body text:     #374151
// Muted text:    #6B7280
// BG white:      #FFFFFF
// BG mint tint:  #F0FDF9
// Border mint:   rgba(0,191,165,0.22)

// ─── NOMI Globe Logo SVG ───────────────────────────────────────────────────────
function NomiLogo({ size = 40, dark = false }: { size?: number; dark?: boolean }) {
  const textColor = dark ? '#0A1F1C' : '#0A1F1C';
  const scale = size / 50;
  return (
    <svg
      width={185 * scale}
      height={50 * scale}
      viewBox="0 0 185 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text x="0" y="42" fontSize="50" fontWeight="900" fill={textColor} fontFamily="Arial, sans-serif">N</text>
      <circle cx="63" cy="25" r="20" stroke="#00BFA5" strokeWidth="2.5" fill="none" />
      <ellipse cx="63" cy="25" rx="11" ry="20" stroke="#00BFA5" strokeWidth="1.5" fill="none" />
      <line x1="43" y1="25" x2="83" y2="25" stroke="#00BFA5" strokeWidth="2.5" />
      <line x1="48" y1="13" x2="78" y2="13" stroke="#00BFA5" strokeWidth="1.2" />
      <line x1="48" y1="37" x2="78" y2="37" stroke="#00BFA5" strokeWidth="1.2" />
      <text x="97" y="42" fontSize="50" fontWeight="900" fill={textColor} fontFamily="Arial, sans-serif">M</text>
      <text x="138" y="42" fontSize="50" fontWeight="900" fill={textColor} fontFamily="Arial, sans-serif">I</text>
    </svg>
  );
}

function NomiLogoSmall() {
  return (
    <svg width="111" height="30" viewBox="0 0 185 50" fill="none" xmlns="http://www.w3.org/2000/svg">
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

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '2.1M+', label: 'Creator Network Reach', labelCn: '创作者覆盖粉丝' },
  { value: '80M+', label: 'Total Content Likes', labelCn: '内容总点赞量' },
  { value: 'D1 / USA', label: 'Athlete Caliber', labelCn: '运动员级别' },
  { value: '98%', label: 'Match Accuracy', labelCn: '匹配准确率' },
];

const PLATFORMS = [
  { name: 'TikTok Shop', icon: '🎵', desc: '达人带货 · Live commerce' },
  { name: 'Amazon', icon: '📦', desc: '产品测评 · Review & storefront' },
  { name: 'Instagram', icon: '📸', desc: '品牌合作 · Brand content' },
  { name: 'YouTube', icon: '▶️', desc: '深度评测 · Long-form review' },
];

const SERVICES = [
  {
    icon: Bot,
    title: 'AI Creator Matching',
    titleCn: 'AI驱动达人匹配',
    description: 'Our proprietary AI analyzes audience demographics, engagement quality, and brand fit to match your product with the optimal creator for maximum ROI.',
  },
  {
    icon: Globe,
    title: 'Bilingual Strategy',
    titleCn: '中美双语服务',
    description: 'NYC-based bilingual team handles all strategy, negotiation, and content direction in both English and Chinese — zero language barriers, seamless execution.',
  },
  {
    icon: Users,
    title: 'US Creator Network',
    titleCn: '美国本土创作者网络',
    description: 'Access exclusive relationships with NCAA Division I athletes, Team USA competitors, and top lifestyle creators across TikTok, Instagram, Amazon, and YouTube.',
  },
  {
    icon: TrendingUp,
    title: 'UGC & Ad Creative',
    titleCn: '带货内容·广告素材',
    description: 'We source high-converting UGC assets for paid ads plus drive direct sales through TikTok Shop, Amazon storefronts, and affiliate campaigns.',
  },
  {
    icon: Shield,
    title: 'Content Licensing Rights',
    titleCn: '内容版权授权',
    description: 'Beyond influencer posts, we secure full licensing rights so you can use creator-generated content in your own paid ads, Amazon listings, and storefronts.',
  },
  {
    icon: BarChart3,
    title: 'Campaign Management',
    titleCn: '全链路活动管理',
    description: 'End-to-end execution: creator briefing, product shipping, content approval, live tracking, and performance reporting — all handled by our team.',
  },
];

const CATEGORIES = [
  { icon: Dumbbell, label: 'Sports Nutrition', labelCn: '运动营养', desc: 'Pre-workouts, protein, hydration, functional supplements' },
  { icon: Package, label: 'Fitness Gear', labelCn: '健身器材', desc: 'Home gym, lifting accessories, wearable fitness tech' },
  { icon: Heart, label: 'Recovery Tools', labelCn: '恢复工具', desc: 'Massage guns, compression boots, ice bath, foam rollers' },
  { icon: Shirt, label: 'Activewear', labelCn: '运动服饰', desc: 'Performance clothing, training footwear, athleisure' },
  { icon: Cpu, label: 'Health Tech', labelCn: '健康科技', desc: 'Sleep trackers, smart scales, wellness monitoring devices' },
  { icon: Sparkles, label: 'Athletic Skincare', labelCn: '运动护肤', desc: 'SPF for athletes, anti-chafe, muscle balms, recovery skincare' },
];

const WHY_NOMI = [
  {
    title: 'Direct Access, No Middlemen',
    titleCn: '直接对接，无中间商',
    desc: 'Our personal relationships with creators and athletes mean faster communication, better rates, and more authentic collaborations than any marketplace platform.',
  },
  {
    title: 'NIL Expertise',
    titleCn: '大学运动员肖像权专家',
    desc: 'We navigate the complex U.S. college sports sponsorship landscape (Name, Image, Likeness rules) so Chinese brands can safely partner with NCAA student-athletes.',
  },
  {
    title: 'Goal-Driven Matching',
    titleCn: '目标驱动的达人匹配',
    desc: 'We select creators specifically for ads vs. direct sales — UGC creators to lower CAC, affiliate influencers to drive immediate TikTok Shop and Amazon conversion.',
  },
  {
    title: 'Scalable Growth',
    titleCn: '可扩展的品牌增长',
    desc: 'Start in your target niche to build trust and sales velocity, then expand into broader lifestyle categories as your brand grows in the U.S. market.',
  },
];

const PHASES = [
  {
    phase: 'PHASE 1 — AWARENESS',
    phaseCn: '第一阶段 — 品牌曝光',
    title: 'The Elite Endorsement',
    titleCn: '精英背书',
    desc: 'We deploy mega-influencers (1M+ followers) to create a high-impact viral video featuring your product — the "halo effect" that associates your brand with elite performance and reaches millions instantly.',
    num: '01',
  },
  {
    phase: 'PHASE 2 — TRUST',
    phaseCn: '第二阶段 — 建立信任',
    title: 'The Authentic Integration',
    titleCn: '真实生活融入',
    desc: 'Rising creators integrate your product into their daily content — morning routines, training sessions, game-day prep. This isn\'t an ad; it\'s a genuine lifestyle endorsement that drives deep social proof.',
    num: '02',
  },
  {
    phase: 'PHASE 3 — CONVERSION',
    phaseCn: '第三阶段 — 驱动转化',
    title: 'The Expert Review',
    titleCn: '专家深度评测',
    desc: 'Authority-level athletes and coaches provide detailed, technical reviews of your product\'s performance benefits — targeting high-intent buyers ready to purchase on Amazon and TikTok Shop.',
    num: '03',
  },
];

const PRICING = [
  {
    tier: 'Starter',
    tierCn: '入门测试',
    price: '$3,000',
    priceSuffix: '– $5,000',
    desc: 'Perfect for testing content formats and audience response before scaling.',
    features: [
      'Campaign strategy & creator brief',
      '5–10 micro-influencers or UGC creators',
      '15–20 ready-to-use video assets',
      'Platform targeting: TikTok or Amazon',
      'Performance summary report',
    ],
    highlight: false,
  },
  {
    tier: 'Growth',
    tierCn: '品牌增长',
    price: '$10,000',
    priceSuffix: '+',
    desc: 'Full influencer campaigns for brands serious about U.S. market presence.',
    features: [
      'Full end-to-end campaign management',
      'Mid-tier & mega influencer placement',
      'Multi-platform: TikTok + Amazon + Instagram',
      'Content licensing rights included',
      'Dedicated bilingual account manager',
      'Live performance dashboard',
    ],
    highlight: true,
  },
  {
    tier: 'Performance',
    tierCn: '效果分成',
    price: 'Base + %',
    priceSuffix: 'commission',
    desc: 'Affiliate-driven model for TikTok Shop and Amazon — pay for results.',
    features: [
      'Base retainer + 10–20% sales commission',
      'TikTok Shop affiliate network activation',
      'Amazon storefront creator seeding',
      'Ongoing creator relationship management',
      'No cap on scale',
    ],
    highlight: false,
  },
];

const TESTIMONIALS = [
  {
    name: 'Zhang Wei',
    role: 'CMO, ShineMax Beauty',
    avatar: 'ZW',
    text: 'NOMI found us 20 authentic US beauty creators in one week. Our TikTok Shop sales grew 4x in the first campaign. The bilingual team made everything seamless — no brief got lost in translation.',
    rating: 5,
  },
  {
    name: 'Ashley Rodriguez',
    role: 'Lifestyle Creator · 890K followers',
    avatar: 'AR',
    text: 'NOMI connects me with Chinese brands I genuinely love. They handle all translations and negotiations — I just create. Best partnership experience I\'ve had in three years of full-time content.',
    rating: 5,
  },
  {
    name: 'Li Hao',
    role: 'Founder, TechGear Pro',
    avatar: 'LH',
    text: '我们第一次进军美国市场就选择了NOMI，他们的AI匹配系统帮我们找到了完美的科技类创作者，ROI超出预期200%，强烈推荐。',
    rating: 5,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF', color: '#0A1F1C' }}>

      {/* ── Navbar ── */}
      <nav
        style={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderBottom: '1px solid rgba(0,191,165,0.2)',
          backdropFilter: 'blur(14px)',
        }}
        className="sticky top-0 z-50"
      >
        <div className="container flex h-16 items-center justify-between">
          <NomiLogoSmall />
          <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: '#6B7280' }}>
            <a href="#services" className="hover:text-[#00BFA5] transition-colors">Services</a>
            <a href="#how-it-works" className="hover:text-[#00BFA5] transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-[#00BFA5] transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-[#00BFA5] transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <button
                className="text-sm px-4 py-2 rounded-lg transition-colors"
                style={{ color: '#374151', border: '1px solid rgba(0,0,0,0.12)' }}
              >
                Sign in
              </button>
            </Link>
            <Link href="/sign-up">
              <button
                className="text-sm px-4 py-2 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #00BFA5, #007A6E)' }}
              >
                Get started →
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-24 pb-32" style={{ backgroundColor: '#F0FDF9' }}>
        {/* Subtle mint glow */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 70% 40%, rgba(0,191,165,0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(0,122,110,0.08) 0%, transparent 50%)'
        }} />
        {/* Fine grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(0,191,165,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,165,0.8) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="container relative">
          <div className="mx-auto max-w-5xl text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
              style={{ border: '1px solid rgba(0,191,165,0.45)', backgroundColor: 'rgba(0,191,165,0.1)', color: '#007A6E' }}
            >
              <Bot className="h-3.5 w-3.5" />
              AI-Powered Creator Matching · 纽约 · 双语团队
            </div>

            {/* Logo */}
            <div className="flex justify-center mb-8">
              <NomiLogo size={64} />
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 leading-tight" style={{ color: '#0A1F1C' }}>
              Go Global,{' '}
              <span style={{ color: '#00BFA5' }}>Stay Local</span>
            </h1>
            <p className="text-2xl font-medium mb-3" style={{ color: '#007A6E' }}>
              出海有声，品牌有信
            </p>
            <p className="text-lg mb-4 max-w-2xl mx-auto leading-loose" style={{ color: '#4B5563' }}>
              We help Chinese consumer brands enter the U.S. market through authentic creator partnerships — building the trust that turns American shoppers into loyal customers.
              <br />
              <span style={{ color: '#9CA3AF' }}>连接中国品牌与美国本土创作者，用真实内容建立消费者信任</span>
            </p>

            {/* Location tag */}
            <div className="flex items-center justify-center gap-2 mb-10" style={{ color: '#9CA3AF' }}>
              <MapPin className="h-4 w-4" style={{ color: '#00BFA5' }} />
              <span className="text-sm">NYC Based · Bilingual Team · 纽约本土双语团队</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <Link href="/sign-up?role=BRAND">
                <button
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white text-base transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #00BFA5, #007A6E)', boxShadow: '0 0 28px rgba(0,191,165,0.35)' }}
                >
                  我是品牌方 · I&apos;m a Brand <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/sign-up?role=CREATOR">
                <button
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base transition-colors"
                  style={{ border: '1px solid rgba(0,191,165,0.4)', color: '#007A6E', backgroundColor: 'rgba(0,191,165,0.06)' }}
                >
                  我是创作者 · I&apos;m a Creator
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl p-5 text-center bg-white"
                  style={{ border: '1px solid rgba(0,191,165,0.2)', boxShadow: '0 1px 8px rgba(0,191,165,0.08)' }}
                >
                  <div className="text-2xl md:text-3xl font-extrabold mb-1" style={{ color: '#00BFA5' }}>{stat.value}</div>
                  <div className="text-xs sm:text-sm font-medium" style={{ color: '#0A1F1C' }}>{stat.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{stat.labelCn}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Platforms Strip ── */}
      <section
        id="platforms"
        className="py-14"
        style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid rgba(0,191,165,0.15)', borderBottom: '1px solid rgba(0,191,165,0.15)' }}
      >
        <div className="container">
          <p className="text-center text-xs font-semibold tracking-widest mb-8 uppercase" style={{ color: '#9CA3AF' }}>
            Platforms We Operate On · 覆盖平台
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {PLATFORMS.map((p) => (
              <div
                key={p.name}
                className="flex flex-col items-center gap-2 rounded-xl p-5"
                style={{ backgroundColor: '#F0FDF9', border: '1px solid rgba(0,191,165,0.18)' }}
              >
                <span className="text-3xl">{p.icon}</span>
                <span className="font-bold text-sm" style={{ color: '#0A1F1C' }}>{p.name}</span>
                <span className="text-xs text-center leading-relaxed" style={{ color: '#6B7280' }}>{p.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Trust Gap ── */}
      <section className="py-28 relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 15% 60%, rgba(0,191,165,0.06) 0%, transparent 55%)'
        }} />
        <div className="container relative max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#00BFA5' }}>
                The Challenge · 品牌出海的核心挑战
              </p>
              <h2 className="text-4xl font-extrabold mb-6 leading-tight" style={{ color: '#0A1F1C' }}>
                The Trust Gap in the U.S. Market
              </h2>
              <p className="text-lg leading-relaxed mb-6" style={{ color: '#4B5563' }}>
                When Chinese brands enter the U.S. market, the biggest hurdle isn&apos;t product quality — it&apos;s{' '}
                <span style={{ color: '#0A1F1C', fontWeight: 600 }}>consumer trust</span>. American shoppers are highly skeptical of unfamiliar brands, no matter how good the product is.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: '#9CA3AF' }}>
                中国品牌进入美国市场时，最大的障碍不是产品质量，而是消费者信任。NOMI 用本土创作者的真实声音填补这一信任鸿沟。
              </p>
              <div className="space-y-3">
                {[
                  'U.S. consumers trust local creator content far more than brand messaging',
                  'Authentic, creator-led content bridges the cultural gap',
                  'Performance-tracked from awareness all the way to purchase',
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: '#00BFA5' }} />
                    <span className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Generic brand ad', score: 23, note: 'Average US consumer trust' },
                { label: 'Macro influencer post', score: 54, note: 'Familiar face, less authentic' },
                { label: 'NOMI creator content', score: 91, note: 'Local voice, real endorsement' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl p-5 bg-white"
                  style={{ border: '1px solid rgba(0,191,165,0.18)', boxShadow: '0 1px 6px rgba(0,191,165,0.06)' }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium" style={{ color: '#0A1F1C' }}>{item.label}</span>
                    <span className="text-sm font-bold" style={{ color: item.score > 80 ? '#00BFA5' : '#9CA3AF' }}>
                      {item.score}%
                    </span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ backgroundColor: '#F3F4F6' }}>
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${item.score}%`,
                        background: item.score > 80 ? 'linear-gradient(90deg, #00BFA5, #007A6E)' : '#D1D5DB',
                      }}
                    />
                  </div>
                  <p className="text-xs mt-2" style={{ color: '#9CA3AF' }}>{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-24" style={{ backgroundColor: '#F0FDF9' }}>
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#00BFA5' }}>Our Services · 我们的服务</p>
            <h2 className="text-4xl font-bold mb-3" style={{ color: '#0A1F1C' }}>Everything you need to go global</h2>
            <p style={{ color: '#6B7280' }}>出海全链路解决方案 · Full-stack brand globalization</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-6 bg-white transition-all hover:translate-y-[-3px]"
                style={{ border: '1px solid rgba(0,191,165,0.18)', boxShadow: '0 2px 12px rgba(0,191,165,0.07)' }}
              >
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'rgba(0,191,165,0.12)', border: '1px solid rgba(0,191,165,0.3)' }}
                >
                  <f.icon className="h-5 w-5" style={{ color: '#00BFA5' }} />
                </div>
                <h3 className="font-semibold text-lg mb-0.5" style={{ color: '#0A1F1C' }}>{f.title}</h3>
                <p className="text-xs font-medium mb-3" style={{ color: '#00BFA5' }}>{f.titleCn}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Creator Network ── */}
      <section className="py-24" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#00BFA5' }}>
              Exclusive Network · 独家创作者网络
            </p>
            <h2 className="text-4xl font-bold mb-3" style={{ color: '#0A1F1C' }}>Not a marketplace. A personal network.</h2>
            <p className="max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
              Our creators are not sourced from a platform — they are our personal relationships. Faster communication, better rates, and more authentic content than any agency can offer.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-14">
            {[
              {
                tier: 'MEGA',
                title: '1M+ Followers',
                titleCn: '百万级粉丝',
                desc: 'Mega creators for massive brand awareness. The "halo effect" that puts your product in front of millions of American consumers and builds instant brand recognition.',
                icon: '🏆',
              },
              {
                tier: 'RISING',
                title: 'Authentic Integrators',
                titleCn: '真实生活达人',
                desc: 'Rising creators who weave your product naturally into daily content — supplement routines, training vlogs, game-day prep — building deep, authentic social proof.',
                icon: '⭐',
              },
              {
                tier: 'AUTHORITY',
                title: 'Expert Validators',
                titleCn: '权威专家达人',
                desc: 'Coaches, certified trainers, and competitive athletes who provide detailed technical reviews — targeting high-intent buyers ready to purchase on Amazon or TikTok Shop.',
                icon: '🎯',
              },
            ].map((t) => (
              <div
                key={t.tier}
                className="rounded-2xl p-6 text-center bg-white"
                style={{ border: '1px solid rgba(0,191,165,0.2)', boxShadow: '0 2px 10px rgba(0,191,165,0.07)' }}
              >
                <div className="text-3xl mb-3">{t.icon}</div>
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                  style={{ backgroundColor: 'rgba(0,191,165,0.12)', color: '#007A6E', border: '1px solid rgba(0,191,165,0.3)' }}
                >
                  {t.tier}
                </span>
                <h3 className="font-bold text-lg mb-0.5" style={{ color: '#0A1F1C' }}>{t.title}</h3>
                <p className="text-xs font-medium mb-3" style={{ color: '#00BFA5' }}>{t.titleCn}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{t.desc}</p>
              </div>
            ))}
          </div>

          {/* Why NOMI */}
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {WHY_NOMI.map((item) => (
              <div
                key={item.title}
                className="rounded-xl p-5 flex gap-4 bg-white"
                style={{ border: '1px solid rgba(0,191,165,0.16)', boxShadow: '0 1px 6px rgba(0,191,165,0.05)' }}
              >
                <div
                  className="h-8 w-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: 'rgba(0,191,165,0.12)', border: '1px solid rgba(0,191,165,0.28)' }}
                >
                  <Zap className="h-4 w-4" style={{ color: '#00BFA5' }} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-0.5" style={{ color: '#0A1F1C' }}>{item.title}</h4>
                  <p className="text-xs mb-2" style={{ color: '#00BFA5' }}>{item.titleCn}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Categories ── */}
      <section className="py-20" style={{ backgroundColor: '#F0FDF9', borderTop: '1px solid rgba(0,191,165,0.12)' }}>
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#00BFA5' }}>
              Categories We Specialize In · 专注品类
            </p>
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#0A1F1C' }}>Built for high-growth wellness & lifestyle brands</h2>
            <p style={{ color: '#6B7280' }}>我们的创作者网络在以下品类拥有最强影响力</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.label}
                className="rounded-xl p-5 flex gap-3 items-start bg-white"
                style={{ border: '1px solid rgba(0,191,165,0.18)', boxShadow: '0 1px 6px rgba(0,191,165,0.06)' }}
              >
                <div
                  className="h-8 w-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0,191,165,0.12)', border: '1px solid rgba(0,191,165,0.28)' }}
                >
                  <cat.icon className="h-4 w-4" style={{ color: '#00BFA5' }} />
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#0A1F1C' }}>{cat.label}</div>
                  <div className="text-xs mb-1" style={{ color: '#00BFA5' }}>{cat.labelCn}</div>
                  <div className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{cat.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3-Phase Campaign Framework ── */}
      <section id="how-it-works" className="py-28" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#00BFA5' }}>
              Campaign Framework · 活动执行框架
            </p>
            <h2 className="text-4xl font-bold mb-3" style={{ color: '#0A1F1C' }}>From unknown to trusted to purchased</h2>
            <p className="max-w-xl mx-auto" style={{ color: '#6B7280' }}>
              We don&apos;t just sell influencer posts — we offer a structured, three-phase campaign designed to move your brand through the full funnel.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PHASES.map((p, idx) => (
              <div
                key={p.num}
                className="rounded-2xl p-8 bg-white"
                style={{ border: '1px solid rgba(0,191,165,0.2)', boxShadow: '0 2px 12px rgba(0,191,165,0.07)' }}
              >
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#00BFA5' }}>
                  {p.phase}
                </p>
                <p className="text-xs mb-5" style={{ color: '#9CA3AF' }}>{p.phaseCn}</p>
                <div
                  className="text-5xl font-extrabold mb-4"
                  style={{
                    background: 'linear-gradient(135deg, #00BFA5, #007A6E)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {p.num}
                </div>
                <h3 className="font-bold text-xl mb-0.5" style={{ color: '#0A1F1C' }}>{p.title}</h3>
                <p className="text-sm font-medium mb-4" style={{ color: '#00BFA5' }}>{p.titleCn}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Step labels below cards — no overlapping line */}
          <div className="hidden md:flex items-center justify-center gap-4 mt-8 max-w-5xl mx-auto px-8">
            <div className="text-xs font-semibold" style={{ color: '#9CA3AF' }}>Awareness 曝光</div>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(0,191,165,0.3), rgba(0,122,110,0.3))' }} />
            <div className="text-xs font-semibold" style={{ color: '#9CA3AF' }}>Trust 信任</div>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(0,122,110,0.3), rgba(0,191,165,0.3))' }} />
            <div className="text-xs font-semibold" style={{ color: '#9CA3AF' }}>Conversion 转化</div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24" style={{ backgroundColor: '#F0FDF9', borderTop: '1px solid rgba(0,191,165,0.12)' }}>
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#00BFA5' }}>Pricing · 合作方案</p>
            <h2 className="text-4xl font-bold mb-3" style={{ color: '#0A1F1C' }}>Flexible plans for every stage</h2>
            <p style={{ color: '#6B7280' }}>灵活的合作模式，适配您的品牌成长阶段</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING.map((plan) => (
              <div
                key={plan.tier}
                className="rounded-2xl p-7 flex flex-col relative bg-white"
                style={{
                  border: plan.highlight ? '2px solid #00BFA5' : '1px solid rgba(0,191,165,0.18)',
                  boxShadow: plan.highlight ? '0 4px 24px rgba(0,191,165,0.18)' : '0 2px 10px rgba(0,191,165,0.06)',
                }}
              >
                {plan.highlight && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #00BFA5, #007A6E)' }}
                  >
                    Most Popular · 最受欢迎
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-bold text-xl mb-0.5" style={{ color: '#0A1F1C' }}>{plan.tier}</h3>
                  <p className="text-xs mb-4" style={{ color: '#00BFA5' }}>{plan.tierCn}</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-extrabold" style={{ color: '#0A1F1C' }}>{plan.price}</span>
                    <span className="text-sm" style={{ color: '#9CA3AF' }}>{plan.priceSuffix}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{plan.desc}</p>
                </div>

                <ul className="space-y-2.5 flex-1 mb-7">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: '#00BFA5' }} />
                      <span className="text-sm" style={{ color: '#4B5563' }}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/sign-up?role=BRAND">
                  <button
                    className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
                    style={plan.highlight
                      ? { background: 'linear-gradient(135deg, #00BFA5, #007A6E)', color: 'white' }
                      : { border: '1px solid rgba(0,191,165,0.4)', color: '#007A6E', backgroundColor: 'transparent' }
                    }
                  >
                    Get started →
                  </button>
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-xs mt-8" style={{ color: '#9CA3AF' }}>
            All plans include bilingual account support · 所有方案均包含中英双语客户支持
          </p>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-3" style={{ color: '#0A1F1C' }}>Trusted by brands & creators</h2>
          <p className="text-center mb-16" style={{ color: '#9CA3AF' }}>品牌与创作者的共同选择</p>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl p-6 bg-white"
                style={{ border: '1px solid rgba(0,191,165,0.18)', boxShadow: '0 2px 12px rgba(0,191,165,0.06)' }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4" style={{ fill: '#00BFA5', color: '#00BFA5' }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#4B5563' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ background: 'linear-gradient(135deg, #00BFA5, #007A6E)' }}
                  >
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

      {/* ── Contact / CTA ── */}
      <section id="contact" className="py-24 relative overflow-hidden" style={{ backgroundColor: '#F0FDF9' }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, rgba(0,191,165,0.12) 0%, transparent 65%)'
        }} />
        <div className="container relative text-center">
          <div className="flex justify-center mb-6">
            <NomiLogo size={52} />
          </div>
          <h2 className="text-4xl font-bold mb-3" style={{ color: '#0A1F1C' }}>Ready to go global?</h2>
          <p className="text-xl mb-2" style={{ color: '#007A6E' }}>出海有声，品牌有信</p>
          <p className="mb-10 max-w-xl mx-auto" style={{ color: '#6B7280' }}>
            Stop competing on price alone. Let NOMI&apos;s creator network build the trust that turns American consumers into loyal buyers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/sign-up?role=BRAND">
              <button
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white text-base transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #00BFA5, #007A6E)', boxShadow: '0 0 36px rgba(0,191,165,0.35)' }}
              >
                Start as a Brand · 品牌注册 <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/sign-up?role=CREATOR">
              <button
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base transition-colors"
                style={{ border: '1px solid rgba(0,191,165,0.45)', color: '#007A6E', backgroundColor: 'rgba(0,191,165,0.07)' }}
              >
                Join as Creator · 创作者入驻
              </button>
            </Link>
          </div>

          {/* Contact details */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm" style={{ color: '#6B7280' }}>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#00BFA5' }}>Email</span>
              <span>partnerships@nomi-agency.com</span>
            </div>
            <div className="w-px h-8" style={{ backgroundColor: 'rgba(0,191,165,0.2)' }} />
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#00BFA5' }}>WeChat · 微信</span>
              <span>NOMI_Official</span>
            </div>
            <div className="w-px h-8" style={{ backgroundColor: 'rgba(0,191,165,0.2)' }} />
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#00BFA5' }}>WhatsApp</span>
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{ borderTop: '1px solid rgba(0,191,165,0.15)', backgroundColor: '#FFFFFF' }}
        className="py-12"
      >
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-start gap-1.5">
            <NomiLogoSmall />
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
              NYC Based · Bilingual Team · 纽约本土双语团队
            </p>
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
