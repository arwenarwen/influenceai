import Link from 'next/link';
import { ArrowRight, Bot, BarChart3, Users, Zap, Star, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const FEATURES = [
  {
    icon: Bot,
    title: 'AI-Powered Matching',
    description: 'Our AI analyzes 50+ signals — niche, audience demographics, engagement quality — to surface the perfect creator for every campaign.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Users,
    title: 'Auto-Discovery',
    description: 'Can\'t find the right creator? Our AI scans TikTok, Instagram, YouTube & more in real-time to discover and categorize unregistered talent.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    description: 'Track campaign performance, engagement rates, and ROI across all platforms in a unified dashboard.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: Zap,
    title: 'Instant Collaboration',
    description: 'Send and manage collaboration requests, negotiate rates, and track deliverables all in one place.',
    gradient: 'from-green-500 to-teal-500',
  },
  {
    icon: Shield,
    title: 'Brand Safety',
    description: 'AI content moderation screens creators for brand safety issues before any recommendation is made.',
    gradient: 'from-red-500 to-rose-500',
  },
  {
    icon: TrendingUp,
    title: 'ROI Prediction',
    description: 'Predict campaign ROI before you commit a budget, using historical performance data from similar campaigns.',
    gradient: 'from-violet-500 to-indigo-500',
  },
];

const STATS = [
  { value: '50K+', label: 'Verified Creators' },
  { value: '2K+', label: 'Brand Partners' },
  { value: '98%', label: 'Match Accuracy' },
  { value: '$12M+', label: 'Paid to Creators' },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Marketing Director, TechVibe',
    avatar: 'SC',
    text: 'InfluenceHub found us micro-influencers we never would have discovered on our own. Our campaign engagement was 3x industry average.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Content Creator, 2.4M followers',
    avatar: 'MJ',
    text: 'The platform connects me with brands that actually fit my audience. My earnings doubled in the first 3 months.',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    role: 'CMO, FitFlow',
    avatar: 'PP',
    text: 'The AI matching is uncanny. It suggested creators in fitness niches I hadn\'t even considered for our wellness brand.',
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-purple-pink flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">InfluenceHub</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-purple-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-purple-600 transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-purple-600 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="gradient-purple-pink text-white border-0 hover:opacity-90">
                Get started free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-pink-200/40 blur-3xl" />

        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 bg-purple-100 text-purple-700 hover:bg-purple-100 border-0 px-4 py-1">
              <Bot className="h-3 w-3 mr-1" /> AI-Powered Influencer Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
              Connect brands with{' '}
              <span className="gradient-text">perfect creators</span>
              {' '}instantly
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              InfluenceHub uses AI to match companies with the ideal influencers across TikTok, Instagram, YouTube & more — or discovers new ones automatically.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="gradient-purple-pink text-white border-0 hover:opacity-90 px-8 h-12 text-base">
                  Start for free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-up?role=BRAND">
                <Button size="lg" variant="outline" className="px-8 h-12 text-base border-gray-200">
                  I&apos;m a brand
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-extrabold gradient-text">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need to run influencer campaigns</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">From AI discovery to performance tracking, InfluenceHub handles the entire collaboration lifecycle.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4`}>
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How InfluenceHub works</h2>
            <p className="text-lg text-gray-500">Three steps to a successful influencer campaign</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Post your campaign', desc: 'Tell us your product, budget, target audience, and preferred creator type. Takes under 5 minutes.' },
              { step: '02', title: 'AI finds your match', desc: 'Our AI scans the creator pool — and discovers new ones in real-time — ranking them by predicted ROI and fit.' },
              { step: '03', title: 'Collaborate & track', desc: 'Send requests, negotiate rates, approve content, and track live performance all in one dashboard.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-6xl font-extrabold gradient-text mb-4">{item.step}</div>
                <h3 className="font-semibold text-gray-900 text-xl mb-3">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="container">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Loved by brands & creators</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full gradient-purple-pink flex items-center justify-center text-white font-semibold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 gradient-purple-pink">
        <div className="container text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to transform your influencer marketing?</h2>
          <p className="text-purple-100 mb-8 text-lg">Join 2,000+ brands already using InfluenceHub</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="px-8 h-12 text-base font-semibold">
                Get started free
              </Button>
            </Link>
            <Link href="/sign-up?role=CREATOR">
              <Button size="lg" variant="outline" className="px-8 h-12 text-base border-white text-white hover:bg-white/10">
                Join as creator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-white">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded gradient-purple-pink flex items-center justify-center">
              <Zap className="h-3 w-3 text-white" />
            </div>
            <span className="font-bold gradient-text">InfluenceHub</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 InfluenceHub. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-600">Privacy</a>
            <a href="#" className="hover:text-gray-600">Terms</a>
            <a href="#" className="hover:text-gray-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
