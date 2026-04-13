import Link from 'next/link';
import { ArrowRight, Bot, BarChart3, Users, Zap, Star, TrendingUp, Shield, Globe, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── NOMI Globe Logo SVG ──────────────────────────────────────────────────────
function NomiLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size * 2.8} height={size} viewBox="0 0 140 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* N */}
      <text x="0" y="42" fontSize="50" fontWeight="900" fill="white" fontFamily="Arial, sans-serif">N</text>
      {/* Globe O */}
      <circle cx="72" cy="25" r="20" stroke="#E53E2F" strokeWidth="2.5" fill="none"/>
      <ellipse cx="72" cy="25" rx="11" ry="20" stroke="#E53E2F" strokeWidth="1.5" fill="none"/>
      <line x1="52" y1="25" x2="92" y2="25" stroke="#E53E2F" strokeWidth="2.5"/>
      <line x1="57" y1="13" x2="87" y2="13" stroke="#E53E2F" strokeWidth="1.2"/>
      <line x1="57" y1="37" x2="87" y2="37" stroke="#E53E2F" strokeWidth="1.2"/>
      {/* MI */}
      <text x="94" y="42" fontSize="50" fontWeight="900" fill="white" fontFamily="Arial, sans-serif">MI</text>
    </svg>
  );
}

function NomiLogoSmall() {
  return (
    <svg width="80" height="28" viewBox="0 0 140 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="42" fontSize="50" fontWeight="900" fill="white" fontFamily="Arial, sans-serif">N</text>
      <circle cx="72" cy="25" r="20" stroke="#E53E2F" strokeWidth="2.5" fill="none"/>
      <ellipse cx="72" cy="25" rx="11" ry="20" stroke="#E53E2F" strokeWidth="1.5" fill="none"/>
      <line x1="52" y1="25" x2="92" y2="25" stroke="#E53E2F" strokeWidth="2.5"/>
      <line x1="57" y1="13" x2="87" y2="13" stroke="#E53E2F" strokeWidth="1.2"/>
      <line x1="57" y1="37" x2="87" y2="37" stroke="#E53E2F" strokeWidth="1.2"/>
      <text x="94" y="42" fontSize="50" fontWeight="900" fill="white" fontFamily="Arial, sans-serif">MI</text>
    </svg>
  );
}

const FEATURES = [
  {
    icon: Bot,
    title: 'AI Creator Matching',
    titleCn: 'AI驱动达人匹配',
    description: 'Our AI analyzes 50+ signals — niche, engagement quality, audience demographics — to surface the perfect creator for every campaign.',
    color: '#E53E2F',
  },
  {
    icon: Globe,
    title: 'Bilingual Service',
    titleCn: '中美双语服务',
    description: 'NYC-based bilingual team bridges US creators and Chinese brands — no language barriers, seamless communication on both sides.',
    color: '#FF6B35',
  },
  {
    icon: Users,
    title: 'US Creator Network',
    titleCn: '美国本土创作者',
    description: 'Access thousands of vetted US creators on TikTok, Instagram, Amazon, and YouTube ready to represent your brand authentically.',
    color: '#E53E2F',
  },
  {
    icon: TrendingUp,
    title: 'Brand Globalization',
    titleCn: '品牌出海策略',
    description: 'We help Chinese brands break into the US market with localized content strategy, creator partnerships, and platform-native campaigns.',
    color: '#FF6B35',
  },
  {
    icon: BarChart3,
    title: 'UGC & Conversion',
    titleCn: '带货转化 · UGC内容',
    description: 'Drive real sales through TikTok Shop, Amazon storefronts, and Instagram Shopping with performance-tracked creator content.',
    color: '#E53E2F',
  },
  {
    icon: Shield,
    title: 'Brand Safety',
    titleCn: '品牌安全保障',
    description: 'AI content moderation and creator vetting ensures every partnership aligns with your brand values before any content goes live.',
    color: '#FF6B35',
  },
];

const STATS = [
  { value: '10K+', label: 'US Creators', labelCn: '美国创作者' },
  { value: '500+', label: 'Brand Partners', labelCn: '合作品牌' },
  { value: '98%', label: 'Match Accuracy', labelCn: '匹配准确率' },
  { value: '$8M+', label: 'Creator Earnings', labelCn: '达人收益' },
];

const PLATFORMS = [
  { name: 'TikTok Shop', icon: '🎵', desc: '达人带货' },
  { name: 'Amazon', icon: '📦', desc: '测评推广' },
  { name: 'Instagram', icon: '📸', desc: '品牌合作' },
  { name: 'YouTube', icon: '▶️', desc: '深度评测' },
];

const TESTIMONIALS = [
  {
    name: 'Zhang Wei',
    role: 'CMO, ShineMax Beauty',
    avatar: 'ZW',
    text: 'NOMI helped us find 20 authentic US beauty creators in one week. Our TikTok Shop sales grew 4x in the first campaign. The bilingual team made everything seamless.',
    rating: 5,
  },
  {
    name: 'Ashley Rodriguez',
    role: 'Lifestyle Creator · 890K followers',
    avatar: 'AR',
    text: 'NOMI connected me with Chinese brands I genuinely love. They handle all translations and negotiations — I just create. Best partnership experience I\'ve had.',
    rating: 5,
  },
  {
    name: 'Li Hao',
    role: 'Founder, TechGear Pro',
    avatar: 'LH',
    text: '我们第一次进军美国市场就选择了NOMI，他们的AI匹配系统帮我们找到了完美的科技类创作者，ROI超出预期200%。',
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#070B24', color: 'white' }}>

      {/* Navbar */}
      <nav style={{ backgroundColor: 'rgba(7,11,36,0.9)', borderBottom: '1px solid rgba(229,62,47,0.2)', backdropFilter: 'blur(12px)' }}
        className="sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <NomiLogoSmall />
          <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#platforms" className="hover:text-white transition-colors">Platforms</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <button className="text-sm px-4 py-2 rounded-lg transition-colors"
                style={{ color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.2)' }}>
                Sign in
              </button>
            </Link>
            <Link href="/sign-up">
              <button className="text-sm px-4 py-2 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #E53E2F, #FF6B35)' }}>
                Get started →
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-32">
        {/* Background glow effects */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 70% 50%, rgba(229,62,47,0.12) 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(255,107,53,0.08) 0%, transparent 50%)'
        }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(229,62,47,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(229,62,47,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="container relative">
          <div className="mx-auto max-w-5xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
              style={{ border: '1px solid rgba(229,62,47,0.4)', backgroundColor: 'rgba(229,62,47,0.1)', color: '#FF8B74' }}>
              <Bot className="h-3.5 w-3.5" />
              AI-Powered Creator Matching · 纽约 · 双语团队
            </div>

            {/* Big logo */}
            <div className="flex justify-center mb-6">
              <NomiLogo size={60} />
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 leading-tight">
              Go Global,{' '}
              <span style={{ color: '#E53E2F' }}>Stay Local</span>
            </h1>
            <p className="text-2xl font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
              出海有声，品牌有信
            </p>
            <p className="text-lg mb-4 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: '1.8' }}>
              Connecting Chinese brands with authentic US creators on TikTok, Amazon & Instagram.
              <br />
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>连接中国品牌与美国本土创作者</span>
            </p>

            {/* Location tag */}
            <div className="flex items-center justify-center gap-2 mb-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <MapPin className="h-4 w-4" style={{ color: '#E53E2F' }} />
              <span className="text-sm">NYC Based · Bilingual Team · 纽约本土团队</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-up?role=BRAND">
                <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white text-base transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #E53E2F, #FF6B35)', boxShadow: '0 0 30px rgba(229,62,47,0.4)' }}>
                  我是品牌方 · I&apos;m a Brand <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/sign-up?role=CREATOR">
                <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.85)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  我是创作者 · I&apos;m a Creator
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((stat) => (
                <div key={stat.label} className="rounded-2xl p-5 text-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(229,62,47,0.15)' }}>
                  <div className="text-3xl font-extrabold mb-1" style={{ color: '#E53E2F' }}>{stat.value}</div>
                  <div className="text-sm font-medium text-white">{stat.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.labelCn}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section id="platforms" className="py-16" style={{ backgroundColor: 'rgba(229,62,47,0.06)', borderTop: '1px solid rgba(229,62,47,0.15)', borderBottom: '1px solid rgba(229,62,47,0.15)' }}>
        <div className="container">
          <p className="text-center text-sm font-medium mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
            PLATFORMS WE OPERATE ON · 覆盖平台
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {PLATFORMS.map((p) => (
              <div key={p.name} className="flex flex-col items-center gap-2 rounded-xl p-4"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-3xl">{p.icon}</span>
                <span className="font-bold text-white text-sm">{p.name}</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{p.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-3">Everything you need to go global</h2>
            <p className="text-lg" style={{ color: 'rgba(255,255,255,0.45)' }}>
              出海全链路解决方案 · Full-stack brand globalization
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl p-6 transition-all hover:translate-y-[-2px]"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(229,62,47,0.15)' }}>
                <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${f.color}20`, border: `1px solid ${f.color}40` }}>
                  <f.icon className="h-5 w-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-semibold text-white text-lg mb-0.5">{f.title}</h3>
                <p className="text-xs font-medium mb-3" style={{ color: '#E53E2F' }}>{f.titleCn}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-3">How NOMI works</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)' }}>三步开启品牌出海之旅 · Three steps to global success</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #E53E2F, transparent)' }} />

            {[
              { step: '01', title: 'Tell us your goal', titleCn: '描述您的需求', desc: 'Share your product, target audience, budget, and platform preference. Our team handles the rest bilingually.' },
              { step: '02', title: 'AI finds your match', titleCn: 'AI智能匹配达人', desc: 'Our AI ranks thousands of US creators by predicted ROI, niche fit, and audience authenticity for your specific brand.' },
              { step: '03', title: 'Launch & track', titleCn: '发布内容·追踪效果', desc: 'Go live on TikTok, Amazon, or Instagram. Track real-time performance, sales, and ROI in your unified dashboard.' },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="text-6xl font-extrabold mb-4" style={{
                  background: 'linear-gradient(135deg, #E53E2F, #FF6B35)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>{item.step}</div>
                <h3 className="font-semibold text-white text-xl mb-1">{item.title}</h3>
                <p className="text-sm font-medium mb-3" style={{ color: '#E53E2F' }}>{item.titleCn}</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container">
          <h2 className="text-4xl font-bold text-center text-white mb-3">Trusted by brands & creators</h2>
          <p className="text-center mb-16" style={{ color: 'rgba(255,255,255,0.4)' }}>品牌与创作者的共同选择</p>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl p-6"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(229,62,47,0.15)' }}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4" style={{ fill: '#E53E2F', color: '#E53E2F' }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ background: 'linear-gradient(135deg, #E53E2F, #FF6B35)' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, rgba(229,62,47,0.2) 0%, transparent 70%)'
        }} />
        <div className="container relative text-center">
          <div className="flex justify-center mb-6">
            <NomiLogo size={50} />
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">Ready to go global?</h2>
          <p className="text-xl mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>出海有声，品牌有信</p>
          <p className="mb-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Join 500+ brands already expanding into the US market with NOMI
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up?role=BRAND">
              <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white text-base transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #E53E2F, #FF6B35)', boxShadow: '0 0 40px rgba(229,62,47,0.5)' }}>
                Start as a Brand · 品牌注册 <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/sign-up?role=CREATOR">
              <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base transition-colors"
                style={{ border: '1px solid rgba(229,62,47,0.4)', color: 'rgba(255,255,255,0.8)', backgroundColor: 'rgba(229,62,47,0.08)' }}>
                Join as Creator · 创作者入驻
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(229,62,47,0.15)', backgroundColor: 'rgba(0,0,0,0.3)' }}
        className="py-12">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-start gap-1">
            <NomiLogoSmall />
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
              NYC Based · Bilingual Team · 纽约本土双语团队
            </p>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>© 2026 NOMI. All rights reserved.</p>
          <div className="flex gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
