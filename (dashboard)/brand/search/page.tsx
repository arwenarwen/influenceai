'use client';

import { useState, useCallback } from 'react';
import { Search, Filter, Users, Star, TrendingUp, Loader2, Bot, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatNumber, getTierColor, getTierLabel, getPlatformIcon } from '@/lib/utils';

const NICHES = ['Fashion', 'Beauty', 'Tech', 'Gaming', 'Fitness', 'Food', 'Travel', 'Music', 'Lifestyle', 'Sports'];
const TIERS = ['NANO', 'MICRO', 'MID', 'MACRO', 'MEGA'];
const PLATFORMS = ['TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'TWITTER', 'TWITCH'];

export default function BrandSearchPage() {
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [filters, setFilters] = useState({
    query: '', niche: '', tier: '', platform: '', minFollowers: '', maxFollowers: '',
    audienceGender: '', location: '',
  });

  const search = useCallback(async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v)));
      const res = await fetch(`/api/creators?${params}`);
      const data = await res.json();
      setCreators(data.creators || []);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  async function sendRequest(creatorId: string) {
    // Would open campaign selection modal in full implementation
    alert(`Collaboration request feature: Select a campaign to send a request to this creator (creatorId: ${creatorId})`);
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Find Creators</h1>
        <p className="text-gray-500 mt-1">Search our creator pool or let AI discover new talent for you</p>
      </div>

      {/* Search & Filters */}
      <Card className="border-0 shadow-sm mb-6">
        <CardContent className="p-6">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search by name, niche, or keyword..." className="pl-10"
                value={filters.query} onChange={e => setFilters(f => ({ ...f, query: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && search()} />
            </div>
            <Button onClick={search} className="gradient-purple-pink text-white border-0 px-6">
              <Search className="h-4 w-4 mr-2" /> Search
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select className="border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
              value={filters.niche} onChange={e => setFilters(f => ({ ...f, niche: e.target.value }))}>
              <option value="">All Niches</option>
              {NICHES.map(n => <option key={n}>{n}</option>)}
            </select>
            <select className="border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
              value={filters.tier} onChange={e => setFilters(f => ({ ...f, tier: e.target.value }))}>
              <option value="">All Tiers</option>
              {TIERS.map(t => <option key={t} value={t}>{getTierLabel(t)}</option>)}
            </select>
            <select className="border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
              value={filters.platform} onChange={e => setFilters(f => ({ ...f, platform: e.target.value }))}>
              <option value="">All Platforms</option>
              {PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
            <select className="border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
              value={filters.audienceGender} onChange={e => setFilters(f => ({ ...f, audienceGender: e.target.value }))}>
              <option value="">Any Gender</option>
              <option value="female">Mostly Female</option>
              <option value="male">Mostly Male</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-3 text-gray-500">Searching creators...</span>
        </div>
      )}

      {!loading && hasSearched && creators.length === 0 && (
        <div className="text-center py-16">
          <Bot className="h-12 w-12 mx-auto mb-4 text-purple-400" />
          <h3 className="font-semibold text-gray-900 text-lg mb-2">No creators found in our pool</h3>
          <p className="text-gray-500 mb-6">Our AI can automatically discover and categorize creators across social media platforms.</p>
          <Button className="gradient-purple-pink text-white border-0" onClick={async () => {
            alert('AI Discovery triggered! The system will scan TikTok, Instagram, YouTube and return recommendations within minutes.');
          }}>
            <Bot className="h-4 w-4 mr-2" /> Trigger AI Discovery
          </Button>
        </div>
      )}

      {!loading && creators.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-4">{creators.length} creators found</p>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {creators.map((creator) => (
              <Card key={creator.id} className="border-0 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {creator.user?.name?.charAt(0) || 'C'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{creator.user?.name || 'Creator'}</h3>
                      <p className="text-xs text-gray-500 truncate">{creator.location || 'Global'}</p>
                      <Badge className={`mt-1 ${getTierColor(creator.tier)}`}>{getTierLabel(creator.tier)}</Badge>
                    </div>
                    {creator.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{creator.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {/* Niches */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {creator.niches.slice(0, 3).map((n: string) => (
                      <span key={n} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs">{n}</span>
                    ))}
                    {creator.niches.length > 3 && <span className="text-xs text-gray-400">+{creator.niches.length - 3}</span>}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-bold text-gray-900">{formatNumber(creator.totalFollowers)}</div>
                      <div className="text-xs text-gray-500">Followers</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-bold text-gray-900">{creator.avgEngagementRate.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">Engagement</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-bold text-gray-900">{creator.socialProfiles?.length || 0}</div>
                      <div className="text-xs text-gray-500">Platforms</div>
                    </div>
                  </div>

                  {/* Platforms */}
                  <div className="flex gap-1 mb-4">
                    {creator.socialProfiles?.map((sp: any) => (
                      <span key={sp.id} className="text-base" title={sp.platform}>{getPlatformIcon(sp.platform)}</span>
                    ))}
                  </div>

                  {/* Rate */}
                  {creator.minRatePerPost && (
                    <p className="text-xs text-gray-500 mb-3">Rate: ${creator.minRatePerPost} – ${creator.maxRatePerPost || '?'} per post</p>
                  )}

                  <Button onClick={() => sendRequest(creator.id)} className="w-full gradient-purple-pink text-white border-0 h-9 text-sm">
                    Send Collaboration Request
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!hasSearched && (
        <div className="text-center py-16 text-gray-400">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-40" />
          <p className="text-gray-500">Search for creators above, or use filters to narrow results</p>
          <p className="text-sm mt-2">Tip: Leave the search empty and click Search to browse all available creators</p>
        </div>
      )}
    </div>
  );
}
