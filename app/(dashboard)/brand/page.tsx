import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatNumber, getStatusColor } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Megaphone, Users, TrendingUp, DollarSign, ArrowRight, Plus, Bot, Target } from 'lucide-react';

export default async function BrandDashboard() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'BRAND') redirect('/sign-in');

  const brand = await prisma.brand.findUnique({
    where: { userId: session.user.id },
    include: {
      campaigns: {
        include: {
          collaborations: true,
          matches: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!brand) redirect('/sign-in');

  const allCampaigns = brand.campaigns;
  const totalSpent = allCampaigns.reduce((sum, c) =>
    sum + c.collaborations.reduce((s, col) => s + (col.agreedRate || 0), 0), 0);
  const activeCount = allCampaigns.filter(c => c.status === 'ACTIVE' || c.status === 'IN_PROGRESS').length;
  const totalMatches = allCampaigns.reduce((sum, c) => sum + c.matches.length, 0);
  const completedCount = allCampaigns.filter(c => c.status === 'COMPLETED').length;

  const stats = [
    { label: 'Active Campaigns', value: activeCount.toString(), icon: Megaphone, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'AI Matches Found', value: totalMatches.toString(), icon: Bot, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Spent', value: formatCurrency(totalSpent), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Campaigns Completed', value: completedCount.toString(), icon: Target, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {brand.companyName} 👋</h1>
          <p className="text-gray-500 mt-1">Manage your influencer campaigns and discover top creators</p>
        </div>
        <Link href="/brand/campaigns/new">
          <Button className="gradient-purple-pink text-white border-0">
            <Plus className="h-4 w-4 mr-2" /> New Campaign
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Campaigns */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Recent Campaigns</CardTitle>
              <Link href="/brand/campaigns">
                <Button variant="ghost" size="sm" className="text-purple-600">View all <ArrowRight className="h-3 w-3 ml-1" /></Button>
              </Link>
            </CardHeader>
            <CardContent>
              {allCampaigns.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Megaphone className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-medium text-gray-600">No campaigns yet</p>
                  <p className="text-xs mt-1">Create your first campaign to find the perfect influencers</p>
                  <Link href="/brand/campaigns/new">
                    <Button size="sm" className="mt-4 gradient-purple-pink text-white border-0">Create Campaign</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {allCampaigns.map((campaign) => (
                    <Link key={campaign.id} href={`/brand/campaigns/${campaign.id}`}>
                      <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
                          <Megaphone className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{campaign.title}</p>
                          <p className="text-xs text-gray-500">
                            {campaign.matches.length} matches · {campaign.collaborations.length} collaborations · {formatCurrency(campaign.budget)} budget
                          </p>
                        </div>
                        <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/brand/campaigns/new">
                <Button variant="outline" className="w-full justify-start border-purple-100 text-gray-700 hover:bg-purple-50">
                  <Plus className="h-4 w-4 mr-2 text-purple-500" /> Create new campaign
                </Button>
              </Link>
              <Link href="/brand/search">
                <Button variant="outline" className="w-full justify-start border-blue-100 text-gray-700 hover:bg-blue-50">
                  <Users className="h-4 w-4 mr-2 text-blue-500" /> Search creators
                </Button>
              </Link>
              <Link href="/brand/analytics">
                <Button variant="outline" className="w-full justify-start border-green-100 text-gray-700 hover:bg-green-50">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-500" /> View analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* AI Status */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">AI Broker Active</h3>
              </div>
              <p className="text-sm text-gray-600">Our AI is continuously scanning for creators that match your brand profile.</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-700 font-medium">Matching engine online</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
