import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatCurrency, getStatusColor } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Megaphone, Bot, Target, TrendingUp, Activity, ArrowRight, RefreshCw } from 'lucide-react';

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/sign-in');

  const [
    creatorCount,
    brandCount,
    campaignCount,
    matchCount,
    discoveredCount,
    recentCampaigns,
    recentMatches,
  ] = await Promise.all([
    prisma.creator.count(),
    prisma.brand.count(),
    prisma.campaign.count(),
    prisma.campaignMatch.count(),
    prisma.discoveredCreator.count(),
    prisma.campaign.findMany({
      include: { brand: true, collaborations: true, matches: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.campaignMatch.findMany({
      include: { campaign: { include: { brand: true } } },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
  ]);

  const stats = [
    { label: 'Registered Creators', value: creatorCount.toString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Brand Partners', value: brandCount.toString(), icon: Megaphone, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Campaigns', value: campaignCount.toString(), icon: Target, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'AI Matches Made', value: matchCount.toString(), icon: Bot, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Discovered Creators', value: discoveredCount.toString(), icon: TrendingUp, color: 'text-pink-600', bg: 'bg-pink-50' },
    { label: 'Active Now', value: recentCampaigns.filter(c => c.status === 'ACTIVE').length.toString(), icon: Activity, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">AI Broker overview — manage campaigns, matches, and platform health</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/discovery">
            <Button variant="outline" className="border-purple-200 text-purple-600">
              <Target className="h-4 w-4 mr-2" /> Run Discovery
            </Button>
          </Link>
          <Link href="/admin/matches">
            <Button className="gradient-purple-pink text-white border-0">
              <Bot className="h-4 w-4 mr-2" /> AI Matches
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Campaigns */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Campaigns</CardTitle>
            <Link href="/admin/campaigns">
              <Button variant="ghost" size="sm" className="text-purple-600">View all <ArrowRight className="h-3 w-3 ml-1" /></Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentCampaigns.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                    {c.brand.companyName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{c.title}</p>
                    <p className="text-xs text-gray-500">{c.brand.companyName} · {c.matches.length} matches</p>
                  </div>
                  <Badge className={getStatusColor(c.status)}>{c.status}</Badge>
                </div>
              ))}
              {recentCampaigns.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No campaigns yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent AI Matches */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent AI Matches</CardTitle>
            <Link href="/admin/matches">
              <Button variant="ghost" size="sm" className="text-purple-600">View all <ArrowRight className="h-3 w-3 ml-1" /></Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentMatches.map(m => (
                <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{m.campaign.title}</p>
                    <p className="text-xs text-gray-500">{m.campaign.brand.companyName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-purple-600">{m.score.toFixed(0)}%</div>
                    <div className="text-xs text-gray-400">match score</div>
                  </div>
                </div>
              ))}
              {recentMatches.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No matches yet — create a campaign to trigger matching</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
