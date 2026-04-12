'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, RefreshCw, Loader2, ExternalLink, Target, Search, Database, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatNumber, getTierColor, getTierLabel, getPlatformIcon } from '@/lib/utils';

const PLATFORMS = ['ALL', 'YOUTUBE', 'TIKTOK', 'INSTAGRAM', 'TWITTER', 'TWITCH'];
const SCAN_PLATFORMS = ['YOUTUBE', 'TIKTOK', 'INSTAGRAM', 'TWITTER', 'TWITCH'];

const PLATFORM_COLORS: Record<string, string> = {
  YOUTUBE:   'bg-red-100 text-red-700 border-red-200',
  TIKTOK:    'bg-gray-100 text-gray-800 border-gray-300',
  INSTAGRAM: 'bg-pink-100 text-pink-700 border-pink-200',
  TWITTER:   'bg-sky-100 text-sky-700 border-sky-200',
  TWITCH:    'bg-purple-100 text-purple-700 border-purple-200',
};

export default function DiscoveryPage() {
  const [allCreators, setAllCreators]     = useState<any[]>([]);
  const [loading, setLoading]             = useState(true);
  const [scanning, setScanning]           = useState(false);
  const [importing, setImporting]         = useState(false);
  const [scanResult, setScanResult]       = useState<string | null>(null);
  const [importResult, setImportResult]   = useState<string | null>(null);
  const [activeTab, setActiveTab]         = useState('ALL');
  const [searchQuery, setSearchQuery]     = useState('');
  const [searchInput, setSearchInput]     = useState('');
  const [totalInDb, setTotalInDb]         = useState<number | null>(null);
  const searchTimeout = useRef<any>(null);

  const [scanConfig, setScanConfig] = useState({
    platform: 'YOUTUBE',
    niche: '',
    hashtag: '',
    minFollowers: '10000',
  });

  function loadCreators(q = searchQuery, platform = activeTab) {
    setLoading(true);
    const params = new URLSearchParams();
    if (platform !== 'ALL') params.set('platform', platform);
    if (q) params.set('q', q);
    fetch(`/api/discovery?${params}`)
      .then(r => r.json())
      .then(d => {
        setAllCreators(d.creators || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  function loadTotal() {
    fetch('/api/discovery/seed').then(r => r.json()).then(d => setTotalInDb(d.total ?? null));
  }

  useEffect(() => {
    loadCreators();
    loadTotal();
  }, []);

  // Debounce search
  function handleSearchChange(val: string) {
    setSearchInput(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearchQuery(val);
      loadCreators(val, activeTab);
    }, 400);
  }

  function clearSearch() {
    setSearchInput('');
    setSearchQuery('');
    loadCreators('', activeTab);
  }

  function switchTab(tab: string) {
    setActiveTab(tab);
    loadCreators(searchQuery, tab);
  }

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
        return [...newCreators.filter((c: any) => !existingIds.has(c.id)), ...prev];
      });
      setActiveTab(scanConfig.platform);
      setScanResult(`✅ Found ${data.discovered ?? newCreators.length} new creators on ${scanConfig.platform}`);
      loadTotal();
    } catch {
      setScanResult('❌ Scan failed — check your API keys in Vercel settings');
    } finally {
      setScanning(false);
    }
  }

  async function bulkImport(batchSize: number) {
    setImporting(true);
    setImportResult(null);
    try {
      const res = await fetch('/api/discovery/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchSize }),
      });
      const data = await res.json();
      setImportResult(`✅ ${data.inserted} creators added — ${data.totalInDatabase.toLocaleString()} total in database`);
      setTotalInDb(data.totalInDatabase);
      loadCreators();
    } catch {
      setImportResult('❌ Import failed');
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Creator Discovery</h1>
        <p className="text-gray-500 mt-1">
          Search and discover creators across all platforms
          {totalInDb !== null && (
            <span className="ml-2 text-purple-600 font-medium">
              · {totalInDb.toLocaleString()} creators in database
            </span>
          )}
        </p>
      </div>

      {/* Search bar — prominent at top */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, handle, or niche (e.g. fitness, @emma, cooking...)"
          value={searchInput}
          onChange={e => handleSearchChange(e.target.value)}
          className="w-full pl-12 pr-10 py-3.5 text-sm border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
        />
        {searchInput && (
          <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Bulk import panel */}
      <Card className="border-0 shadow-sm mb-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Bulk Creator Import</h3>
                <p className="text-xs text-gray-500">Generate thousands of diverse creators instantly — all niches, all tiers, all platforms</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[500, 1000, 5000, 10000].map(n => (
                <Button
                  key={n}
                  size="sm"
                  variant="outline"
                  disabled={importing}
                  onClick={() => bulkImport(Math.min(n, 1000))}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  {importing ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Users className="h-3.5 w-3.5 mr-1" />}
                  +{n >= 1000 ? `${n/1000}k` : n}
                </Button>
              ))}
            </div>
          </div>
          {importResult && <p className="text-sm mt-3 text-gray-700">{importResult}</p>}
          <p className="text-xs text-gray-400 mt-2">Note: each button imports up to 1,000 creators per click (Vercel limit). Click multiple times to build up to 50k+.</p>
        </CardContent>
      </Card>

      {/* Live scan panel */}
      <Card className="border-0 shadow-sm mb-6 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900 text-sm">Live Social Media Scan</h3>
            <span className="text-xs text-gray-500">— scans real YouTube, TikTok & Instagram profiles</span>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-3">
            <select
              className="border border-purple-200 rounded-lg px-3 py-2 text-sm bg-white"
              value={scanConfig.platform}
              onChange={e => setScanConfig(c => ({ ...c, platform: e.target.value }))}
            >
              {SCAN_PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
            <Input placeholder="Niche (e.g. Fitness)" className="border-purple-200 bg-white"
              value={scanConfig.niche} onChange={e => setScanConfig(c => ({ ...c, niche: e.target.value }))} />
            <Input placeholder="#hashtag" className="border-purple-200 bg-white"
              value={scanConfig.hashtag} onChange={e => setScanConfig(c => ({ ...c, hashtag: e.target.value }))} />
            <Input placeholder="Min followers" type="number" className="border-purple-200 bg-white"
              value={scanConfig.minFollowers} onChange={e => setScanConfig(c => ({ ...c, minFollowers: e.target.value }))} />
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={triggerScan} disabled={scanning} className="gradient-purple-pink text-white border-0">
              {scanning
                ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Scanning {scanConfig.platform}...</>
                : <><Target className="h-4 w-4 mr-2" />Scan Live</>}
            </Button>
            {scanResult && <span className="text-sm text-gray-600">{scanResult}</span>}
          </div>
        </CardContent>
      </Card>

      {/* Platform tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {PLATFORMS.map(p => (
          <button key={p} onClick={() => switchTab(p)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeTab === p ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
            }`}>
            {getPlatformIcon(p)} {p}
          </button>
        ))}
        <div className="ml-auto">
          <Button variant="outline" size="sm" onClick={() => loadCreators()}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {loading ? 'Loading...' : `${allCreators.length} creators shown`}
        {searchQuery && <span className="ml-1 text-purple-600">· searching "{searchQuery}"</span>}
      </p>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      )}

      {!loading && allCreators.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-40" />
          <p className="text-gray-600 font-medium">
            {searchQuery ? `No creators found for "${searchQuery}"` : `No creators in ${activeTab} yet`}
          </p>
          <p className="text-sm mt-1">
            {searchQuery ? 'Try a different search term or clear the search' : 'Use Bulk Import above to populate the database, or run a Live Scan'}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {allCreators.map((creator) => (
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${PLATFORM_COLORS[creator.platform] || 'bg-gray-100 text-gray-600'}`}>
                      {getPlatformIcon(creator.platform)} {creator.platform}
                    </span>
                    {creator.verified && <span className="text-blue-500 text-xs">✓ Verified</span>}
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
                  creator.status === 'ANALYZED'    ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }>{creator.status}</Badge>
                {creator.location && (
                  <span className="text-xs text-gray-400 ml-1">📍 {creator.location}</span>
                )}
                {creator.profileUrl && (
                  <a href={creator.profileUrl} target="_blank" rel="noopener noreferrer"
                    className="ml-auto text-gray-400 hover:text-purple-600 transition-colors">
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
