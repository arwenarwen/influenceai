'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Save, Plus, Trash2, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const PLATFORMS = ['TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'TWITTER', 'TWITCH', 'LINKEDIN', 'SNAPCHAT', 'PINTEREST'];
const NICHES = ['Fashion', 'Beauty', 'Tech', 'Gaming', 'Fitness', 'Food', 'Travel', 'Music', 'Parenting', 'Finance', 'Education', 'Lifestyle', 'Sports', 'Entertainment', 'Business'];
const PLATFORM_ICONS: Record<string, string> = {
  TIKTOK: '🎵', INSTAGRAM: '📸', YOUTUBE: '▶️', TWITTER: '🐦',
  TWITCH: '🎮', LINKEDIN: '💼', SNAPCHAT: '👻', PINTEREST: '📌',
};

export default function CreatorProfilePage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>({
    bio: '', location: '', website: '', niches: [], languages: [],
    audienceAgeRange: '', audienceGender: '', audienceLocations: [],
    minRatePerPost: '', maxRatePerPost: '', socialProfiles: [],
  });
  const [newPlatform, setNewPlatform] = useState({ platform: 'INSTAGRAM', handle: '', followers: '', engagementRate: '' });

  useEffect(() => {
    fetch('/api/creators/me').then(r => r.json()).then(data => {
      if (data.creator) setProfile({ ...data.creator, socialProfiles: data.creator.socialProfiles || [] });
      setLoading(false);
    });
  }, []);

  function toggleNiche(niche: string) {
    setProfile((p: any) => ({
      ...p,
      niches: p.niches.includes(niche) ? p.niches.filter((n: string) => n !== niche) : [...p.niches, niche],
    }));
  }

  function addSocialProfile() {
    if (!newPlatform.handle) return;
    setProfile((p: any) => ({
      ...p,
      socialProfiles: [...p.socialProfiles, { ...newPlatform, id: Date.now().toString() }],
    }));
    setNewPlatform({ platform: 'INSTAGRAM', handle: '', followers: '', engagementRate: '' });
  }

  function removeSocialProfile(id: string) {
    setProfile((p: any) => ({ ...p, socialProfiles: p.socialProfiles.filter((sp: any) => sp.id !== id) }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/creators/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast({ title: 'Profile saved!', description: 'Your creator profile has been updated.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save profile. Please try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="p-8 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
    </div>
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Creator Profile</h1>
          <p className="text-gray-500 mt-1">Complete your profile to improve your AI match score</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gradient-purple-pink text-white border-0">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Tell brands about yourself</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Bio</Label>
              <textarea className="mt-1 w-full border border-input rounded-lg px-3 py-2 text-sm min-h-[100px] resize-none focus:ring-2 focus:ring-ring focus:outline-none"
                placeholder="Describe yourself, your content style, and what makes you unique..."
                value={profile.bio} onChange={e => setProfile((p: any) => ({ ...p, bio: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Location</Label>
                <Input className="mt-1" placeholder="e.g. Los Angeles, CA" value={profile.location}
                  onChange={e => setProfile((p: any) => ({ ...p, location: e.target.value }))} />
              </div>
              <div>
                <Label>Website / Portfolio URL</Label>
                <Input className="mt-1" placeholder="https://..." value={profile.website}
                  onChange={e => setProfile((p: any) => ({ ...p, website: e.target.value }))} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Niches */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Niches & Interests</CardTitle>
            <CardDescription>Select all niches that apply to your content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {NICHES.map((niche) => (
                <button key={niche} onClick={() => toggleNiche(niche)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    profile.niches.includes(niche)
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                  }`}>
                  {profile.niches.includes(niche) && <CheckCircle2 className="h-3 w-3 inline mr-1" />}
                  {niche}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audience Demographics */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Audience Demographics</CardTitle>
            <CardDescription>Help brands understand your audience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Age Range</Label>
                <select className="mt-1 w-full border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  value={profile.audienceAgeRange} onChange={e => setProfile((p: any) => ({ ...p, audienceAgeRange: e.target.value }))}>
                  <option value="">Select...</option>
                  {['13-17', '18-24', '25-34', '35-44', '45-54', '55+'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <Label>Primary Gender</Label>
                <select className="mt-1 w-full border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  value={profile.audienceGender} onChange={e => setProfile((p: any) => ({ ...p, audienceGender: e.target.value }))}>
                  <option value="">Select...</option>
                  <option value="female">Mostly Female</option>
                  <option value="male">Mostly Male</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <div>
                <Label>Primary Location</Label>
                <Input className="mt-1" placeholder="e.g. United States"
                  value={profile.audienceLocations?.[0] || ''}
                  onChange={e => setProfile((p: any) => ({ ...p, audienceLocations: [e.target.value] }))} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rates */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Rate Card</CardTitle>
            <CardDescription>Set your collaboration rates per post</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Minimum Rate per Post ($)</Label>
                <Input className="mt-1" type="number" placeholder="500"
                  value={profile.minRatePerPost}
                  onChange={e => setProfile((p: any) => ({ ...p, minRatePerPost: e.target.value }))} />
              </div>
              <div>
                <Label>Maximum Rate per Post ($)</Label>
                <Input className="mt-1" type="number" placeholder="5000"
                  value={profile.maxRatePerPost}
                  onChange={e => setProfile((p: any) => ({ ...p, maxRatePerPost: e.target.value }))} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Profiles */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Social Media Profiles</CardTitle>
            <CardDescription>Add your social accounts for verification</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Existing profiles */}
            {profile.socialProfiles.map((sp: any) => (
              <div key={sp.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2">
                <span className="text-xl">{PLATFORM_ICONS[sp.platform] || '🌐'}</span>
                <span className="font-medium text-sm text-gray-900">{sp.platform}</span>
                <span className="text-sm text-gray-600">@{sp.handle}</span>
                {sp.followers && <Badge variant="outline">{Number(sp.followers).toLocaleString()} followers</Badge>}
                <button onClick={() => removeSocialProfile(sp.id)} className="ml-auto text-gray-400 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            {/* Add new */}
            <div className="grid grid-cols-5 gap-2 mt-3">
              <select className="border border-input rounded-lg px-2 py-2 text-sm"
                value={newPlatform.platform} onChange={e => setNewPlatform(p => ({ ...p, platform: e.target.value }))}>
                {PLATFORMS.map(p => <option key={p}>{p}</option>)}
              </select>
              <Input placeholder="@handle" value={newPlatform.handle}
                onChange={e => setNewPlatform(p => ({ ...p, handle: e.target.value }))} />
              <Input placeholder="Followers" type="number" value={newPlatform.followers}
                onChange={e => setNewPlatform(p => ({ ...p, followers: e.target.value }))} />
              <Input placeholder="Eng. Rate %" type="number" step="0.1" value={newPlatform.engagementRate}
                onChange={e => setNewPlatform(p => ({ ...p, engagementRate: e.target.value }))} />
              <Button onClick={addSocialProfile} variant="outline" className="border-purple-200 text-purple-600">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
