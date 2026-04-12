import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatNumber, getTierColor, getTierLabel, getStatusColor, formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  DollarSign, Users, TrendingUp, Clock, ArrowRight, Star,
  CheckCircle2, XCircle, MessageSquare, Eye
} from 'lucide-react';

export default async function CreatorDashboard() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'CREATOR') redirect('/sign-in');

  const creator = await prisma.creator.findUnique({
    where: { userId: session.user.id },
    include: {
      socialProfiles: true,
      collaborations: {
        include: { campaign: { include: { brand: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!creator) redirect('/onboarding');

  const stats = [
    { label: 'Total Earnings', value: formatCurrency(creator.totalEarnings), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Followers', value: formatNumber(creator.totalFollowers), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Avg Engagement', value: `${creator.avgEngagementRate.toFixed(1)}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pending Requests', value: creator.collaborations.filter(c => c.status === 'PENDING').length.toString(), icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {session.user.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your creator account</p>
      </div>

      {/* Profile completion banner */}
      {!creator.profileComplete && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
          <div>
            <p className="font-medium text-amber-800">Complete your profile to get more matches</p>
            <p className="text-sm text-amber-600">Add your social handles, niche, and audience demographics</p>
          </div>
          <Link href="/creator/profile">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white border-0">Complete Profile</Button>
          </Link>
        </div>
      )}

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
        {/* Recent Collaborations */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Recent Collaborations</CardTitle>
              <Link href="/creator/collaborations">
                <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                  View all <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {creator.collaborations.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Clock className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No collaboration requests yet</p>
                  <p className="text-xs mt-1">Complete your profile to start receiving requests</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {creator.collaborations.map((collab) => (
                    <div key={collab.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {collab.campaign.brand.companyName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{collab.campaign.title}</p>
                        <p className="text-xs text-gray-500">{collab.campaign.brand.companyName}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {collab.agreedRate && (
                          <span className="text-sm font-medium text-green-600">{formatCurrency(collab.agreedRate)}</span>
                        )}
                        <Badge className={getStatusColor(collab.status)}>{collab.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Creator tier */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Your Tier</h3>
                <Badge className={getTierColor(creator.tier)}>{creator.tier}</Badge>
              </div>
              <p className="text-sm text-gray-500 mb-3">{getTierLabel(creator.tier)}</p>
              <div className="space-y-2">
                {creator.niches.slice(0, 3).map((n) => (
                  <span key={n} className="inline-block mr-2 mb-1 px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs">{n}</span>
                ))}
              </div>
              {creator.rating > 0 && (
                <div className="flex items-center gap-1 mt-3">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-gray-900">{creator.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">({creator.reviewCount} reviews)</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Connected Platforms */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Connected Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              {creator.socialProfiles.length === 0 ? (
                <div className="text-center py-4 text-gray-400">
                  <p className="text-sm">No platforms connected</p>
                  <Link href="/creator/profile">
                    <Button size="sm" variant="outline" className="mt-3 border-purple-200 text-purple-600">+ Add platforms</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {creator.socialProfiles.map((sp) => (
                    <div key={sp.id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{sp.platform}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{formatNumber(sp.followers)} followers</span>
                        <span className="text-xs text-green-600">{sp.engagementRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
