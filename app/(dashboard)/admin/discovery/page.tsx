'use client';

import { useState, useEffect } from 'react';
import { Bot, RefreshCw, Loader2, ExternalLink, Target, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatNumber, getTierColor, getTierLabel, getPlatformIcon } from '@/lib/utils';

const PLATFORMS = ['ALL', 'YOUTUBE', 'TIKTOK', 'INSTAGRAM', 'TWITTER', 'TWITCH'];
const SCAN_PLATFORMS = ['YOUTUBE', 'TIKTOK', 'INSTAGRAM', 'TWITTER', 'TWITCH'];

const PLATFORM_COLORS: Record<string, string> = {
  YOUTUBE:   'bg-red-100 text-red-700 border-red-200',
  TIKTOK:    'bg-black/10 text-gray-800 border-gray-300',
  INSTAGRAM: 'bg-pink-100 text-pink-700 border-pink-200',
  TWITTER:   'bg-sky-100 text-sky-700 border-sky-200',
  TWITCH:    'bg-purple-100 text-purple-700 border-purple-200',
};

export default function DiscoveryPage() {
  const [allCreators, setAllCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [scanConfig, setScanConfig] = useState({
    platform: 'YOUTUBE',
    niche: '',
    hashtag: '',
    minFollowers: '10000',
  });

  function loadCreators() {
    setLoading(true);
    fetch('/api/discovery')
      .then(r => r.json())
      .then(d => {
        setAllCreators(d.creators || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => { loadCreators(); }, []);

  async function triggerScan() {
    setScanning(true);
    setScanResult(null);
    try {
      const res = await fetch('/api/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scanConfig),
      });
      const data = await res.json();
      const newCreators: any[] = data.creators || [];

      setAllCreators(prev => {
        const existingIds = new Set(prev.map((c: any) => c.id));
        const fresh = newCreators.filter((c: any) => !existingIds.has(c.id));
        return [...fresh, ...prev];
      });

      // Switch to the tab that was just scanned
      setActiveTab(scanConfig.platform);
      setScanResult(`Found ${data.discovered ?? newCreators.length} new creators on ${scanConfig.platform}`);
    } catch (e) {
      setScanResult('Scan failed — check your API keys in Vercel settings');
    } finally {
      setScanning(false);
    }
  }

  const displayed = activeTab === 'ALL'
    ? allCreators
    : allCreators.filter(c => c.platform === activeTab);

  const countByPlatform = (p: string) =>
    p === 'ALL' ? allCreators.length : allCreators.filter(c => c.platform === p).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Creator Discovery</h1>
        <p className="text-gray-500 mt-1">Scan social platforms to discover and categorize creators</p>
      </div>

      {/* Scan config */}
      <Card className="border-0 shadow-sm mb-6 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Configure AI Scan</h3>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            <select
              className="border border-purple-200 rounded-lg px-3 py-2 text-sm bg-white"
              value={scanConfig.platform}
              onChange={e => setScanConfig(c => ({ ...c, platform: e.target.value }))}
            >
              {SCAN_PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
            <Input
              placeholder="Niche (e.g. Fitness)"
              className="border-purple-200 bg-white"
              value={scanConfig.niche}
              onChange={e => setScanConfig(c => ({ ...c, niche: e.target.value }))}
            />
            <Input
              placeholder="#hashtag"
              className="border-purple-200 bg-white"
              value={scanConfig.hashtag}
              onChange={e => setScanConfig(c => ({ ...c, hashtag: e.target.value }))}
            />
            <Input
              placeholder="Min followers"
              type="number"
              className="border-purple-200 bg-white"
              value={scanConfig.minFollowers}
              onChange={e => setScanConfig(c => ({ ...c, minFollowers: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={triggerScan}
              disabled={scanning}
              className="gradient-purple-pink text-white border-0"
            >
              {scanning
                ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Scanning {scanConfig.platform}...</>
                : <><Target className="h-4 w-4 mr-2" />Start AI Discovery Scan</>
              }
            </Button>
            {scanResult && (
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Wifi className="h-4 w-4 text-green-500" /> {scanResult}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Platform tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {PLATFORMS.map(p => (
          <button
            key={p}
            onClick={() => setActiveTab(p)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeTab === p
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
            }`}
          >
            {p === 'ALL' ? '🌐' : getPlatformIcon(p)} {p}
            <span className="ml-1 text-xs opacity-70">({countByPlatform(p)})</span>
          </button>
        ))}
        <div className="ml-auto">
          <Button variant="outline" size="sm" onClick={loadCreators}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">{displayed.length} creators</p>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      )}

      {!loading && displayed.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Target className="h-12 w-12 mx-auto mb-4 opacity-40" />
          <p className="text-gray-600 font-medium">No creators found for {activeTab}</p>
          <p className="text-sm mt-1">Select {activeTab === 'ALL' ? 'a platform above' : activeTab} in the scan config and click Start AI Discovery</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {displayed.map((creator) => (
          <Card key={creator.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-3">
                {creator.profileImage ? (
                  <img src={creator.profileImage} alt="" className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
                    {creator.displayName?.charAt(0) || creator.handle.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${PLATFORM_COLORS[creator.platform] || 'bg-gray-100 text-gray-600'}`}>
                      {getPlatformIcon(creator.platform)} {creator.platform}
                    </span>
                    {creator.verified && <span className="text-blue-500 text-xs">✓</span>}
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate mt-1">{creator.displayName || creator.handle}</h3>
                  <p className="text-xs text-gray-500">@{creator.handle}</p>
                  <Badge className={`mt-1 ${getTierColor(creator.tier)}`}>{getTierLabel(creator.tier)}</Badge>
                </div>
              </div>

              {creator.bio && <p className="text-xs text-gray-600 mb-3 line-clamp-2">{creator.bio}</p>}

              <div className="flex flex-wrap gap-1 mb-3">
                {(creator.niches || []).slice(0, 3).map((n: string) => (
                  <span key={n} className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full text-xs">{n}</span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="bg-gray-50 rounded p-2">
                  <div className="text-sm font-bold">{formatNumber(creator.followers)}</div>
                  <div className="text-xs text-gray-400">Followers</div>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <div className="text-sm font-bold">{(creator.avgEngagement ?? 0).toFixed(1)}%</div>
                  <div className="text-xs text-gray-400">Engagement</div>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <div className="text-sm font-bold">{(creator.brandSafetyScore ?? 0).toFixed(0)}</div>
                  <div className="text-xs text-gray-400">Brand Safety</div>
                </div>
              </div>

              {creator.aiSummary && (
                <div className="p-2 bg-purple-50 rounded text-xs text-purple-700 mb-3">
                  🤖 {creator.aiSummary}
                </div>
              )}

              <div className="flex gap-2 items-center">
                <Badge className={
                  creator.status === 'CATEGORIZED' ? 'bg-green-100 text-green-700' :
                  creator.status === 'ANALYZED' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }>{creator.status}</Badge>
                {creator.profileUrl && (
                  <a
                    href={creator.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-gray-400 hover:text-gray-600"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
