'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, X, ArrowLeft, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const NICHES = ['Fashion', 'Beauty', 'Tech', 'Gaming', 'Fitness', 'Food', 'Travel', 'Music', 'Lifestyle', 'Sports', 'Entertainment', 'Education'];
const PLATFORMS = ['TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'TWITTER', 'TWITCH', 'LINKEDIN'];
const POST_TYPES = ['REEL', 'STORY', 'POST', 'VIDEO', 'LIVE', 'SHORT', 'TWEET'];
const TIERS = ['NANO', 'MICRO', 'MID', 'MACRO', 'MEGA'];

export default function NewCampaignPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [campaign, setCampaign] = useState({
    title: '', description: '', productName: '', productUrl: '',
    budget: '', budgetPerPost: '', timeline: '',
    postTypes: [] as string[], platforms: [] as string[], niches: [] as string[],
    hashtags: [] as string[], contentBrief: '',
    preferredTiers: [] as string[], minFollowers: '', maxFollowers: '',
    minEngagement: '', audienceGender: '', audienceAge: '', audienceLocations: '',
  });

  function toggleArray(field: keyof typeof campaign, value: string) {
    setCampaign(c => {
      const arr = c[field] as string[];
      return { ...c, [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  }

  async function handleSubmit() {
    if (!campaign.title || !campaign.description || !campaign.budget) {
      toast({ title: 'Missing fields', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...campaign,
          budget: parseFloat(campaign.budget),
          budgetPerPost: campaign.budgetPerPost ? parseFloat(campaign.budgetPerPost) : undefined,
          minFollowers: campaign.minFollowers ? parseInt(campaign.minFollowers) : undefined,
          maxFollowers: campaign.maxFollowers ? parseInt(campaign.maxFollowers) : undefined,
          minEngagement: campaign.minEngagement ? parseFloat(campaign.minEngagement) : undefined,
          timeline: campaign.timeline || undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to create campaign');
      const data = await res.json();
      toast({ title: 'Campaign created!', description: 'AI is now finding the best creator matches.' });
      router.push(`/brand/campaigns`);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Campaign</h1>
        <p className="text-gray-500 mt-1">Set up your campaign and let AI find the perfect creators</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {['Campaign Details', 'Requirements', 'Audience'].map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div onClick={() => i < step - 1 && setStep(i + 1)}
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold cursor-pointer transition-all ${
                step === i + 1 ? 'gradient-purple-pink text-white' :
                step > i + 1 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'
              }`}>{i + 1}</div>
            <span className={`text-sm ${step === i + 1 ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{label}</span>
            {i < 2 && <div className={`h-px w-8 ${step > i + 1 ? 'bg-purple-300' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Campaign Details */}
      {step === 1 && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle>Campaign Basics</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Campaign Title *</Label>
                <Input className="mt-1" placeholder="e.g. Summer 2026 Product Launch"
                  value={campaign.title} onChange={e => setCampaign(c => ({ ...c, title: e.target.value }))} />
              </div>
              <div>
                <Label>Campaign Description *</Label>
                <textarea className="mt-1 w-full border border-input rounded-lg px-3 py-2 text-sm min-h-[120px] focus:ring-2 focus:ring-ring focus:outline-none"
                  placeholder="Describe what this campaign is about, the goals, and what creators need to do..."
                  value={campaign.description} onChange={e => setCampaign(c => ({ ...c, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Product Name</Label>
                  <Input className="mt-1" placeholder="e.g. AcneAway Serum"
                    value={campaign.productName} onChange={e => setCampaign(c => ({ ...c, productName: e.target.value }))} />
                </div>
                <div>
                  <Label>Product URL</Label>
                  <Input className="mt-1" placeholder="https://..."
                    value={campaign.productUrl} onChange={e => setCampaign(c => ({ ...c, productUrl: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Budget ($) *</Label>
                  <Input className="mt-1" type="number" placeholder="10000"
                    value={campaign.budget} onChange={e => setCampaign(c => ({ ...c, budget: e.target.value }))} />
                </div>
                <div>
                  <Label>Budget per Creator ($)</Label>
                  <Input className="mt-1" type="number" placeholder="2000"
                    value={campaign.budgetPerPost} onChange={e => setCampaign(c => ({ ...c, budgetPerPost: e.target.value }))} />
                </div>
              </div>
              <div>
                <Label>Campaign Deadline</Label>
                <Input className="mt-1" type="date"
                  value={campaign.timeline} onChange={e => setCampaign(c => ({ ...c, timeline: e.target.value }))} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => setStep(2)} className="gradient-purple-pink text-white border-0" disabled={!campaign.title || !campaign.description || !campaign.budget}>
              Next: Requirements →
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Requirements */}
      {step === 2 && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Content Requirements</CardTitle>
              <CardDescription>What kind of content do you need?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block">Platforms</Label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map(p => (
                    <button key={p} onClick={() => toggleArray('platforms', p)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${campaign.platforms.includes(p) ? 'bg-purple-600 text-white border-purple-600' : 'text-gray-600 border-gray-200 hover:border-purple-300'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Post Types</Label>
                <div className="flex flex-wrap gap-2">
                  {POST_TYPES.map(t => (
                    <button key={t} onClick={() => toggleArray('postTypes', t)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${campaign.postTypes.includes(t) ? 'bg-purple-600 text-white border-purple-600' : 'text-gray-600 border-gray-200 hover:border-purple-300'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Creator Niches</Label>
                <div className="flex flex-wrap gap-2">
                  {NICHES.map(n => (
                    <button key={n} onClick={() => toggleArray('niches', n)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${campaign.niches.includes(n) ? 'bg-purple-600 text-white border-purple-600' : 'text-gray-600 border-gray-200 hover:border-purple-300'}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Preferred Creator Tiers</Label>
                <div className="flex flex-wrap gap-2">
                  {TIERS.map(t => (
                    <button key={t} onClick={() => toggleArray('preferredTiers', t)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${campaign.preferredTiers.includes(t) ? 'bg-purple-600 text-white border-purple-600' : 'text-gray-600 border-gray-200 hover:border-purple-300'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Content Brief / Instructions</Label>
                <textarea className="mt-1 w-full border border-input rounded-lg px-3 py-2 text-sm min-h-[100px] focus:ring-2 focus:ring-ring focus:outline-none"
                  placeholder="Hashtags to use, talking points, brand guidelines, dos and don'ts..."
                  value={campaign.contentBrief} onChange={e => setCampaign(c => ({ ...c, contentBrief: e.target.value }))} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
            <Button onClick={() => setStep(3)} className="gradient-purple-pink text-white border-0">Next: Audience →</Button>
          </div>
        </div>
      )}

      {/* Step 3: Audience & Submit */}
      {step === 3 && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Target Audience</CardTitle>
              <CardDescription>Help AI find creators whose audience matches your target market</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Min Followers</Label>
                  <Input className="mt-1" type="number" placeholder="10000"
                    value={campaign.minFollowers} onChange={e => setCampaign(c => ({ ...c, minFollowers: e.target.value }))} />
                </div>
                <div>
                  <Label>Max Followers</Label>
                  <Input className="mt-1" type="number" placeholder="1000000"
                    value={campaign.maxFollowers} onChange={e => setCampaign(c => ({ ...c, maxFollowers: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Min Engagement Rate (%)</Label>
                  <Input className="mt-1" type="number" step="0.1" placeholder="2.5"
                    value={campaign.minEngagement} onChange={e => setCampaign(c => ({ ...c, minEngagement: e.target.value }))} />
                </div>
                <div>
                  <Label>Audience Gender</Label>
                  <select className="mt-1 w-full border border-input rounded-lg px-3 py-2 text-sm"
                    value={campaign.audienceGender} onChange={e => setCampaign(c => ({ ...c, audienceGender: e.target.value }))}>
                    <option value="">Any</option>
                    <option value="female">Mostly Female</option>
                    <option value="male">Mostly Male</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Audience Age Range</Label>
                  <select className="mt-1 w-full border border-input rounded-lg px-3 py-2 text-sm"
                    value={campaign.audienceAge} onChange={e => setCampaign(c => ({ ...c, audienceAge: e.target.value }))}>
                    <option value="">Any</option>
                    {['13-17', '18-24', '25-34', '35-44', '45-54', '55+'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Target Locations</Label>
                  <Input className="mt-1" placeholder="e.g. USA, UK, Canada"
                    value={campaign.audienceLocations} onChange={e => setCampaign(c => ({ ...c, audienceLocations: e.target.value }))} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Notice */}
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 flex gap-3">
            <Bot className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-purple-900">AI will start matching immediately</p>
              <p className="text-sm text-purple-700">After creating this campaign, our AI broker will automatically rank and recommend the best creators — and discover new ones if needed.</p>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>← Back</Button>
            <Button onClick={handleSubmit} disabled={saving} className="gradient-purple-pink text-white border-0 px-8">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Bot className="h-4 w-4 mr-2" />}
              Create Campaign & Start Matching
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
