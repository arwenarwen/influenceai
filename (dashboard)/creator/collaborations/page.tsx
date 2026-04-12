import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatCurrency, getStatusColor, formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, Calendar, DollarSign, ExternalLink } from 'lucide-react';

export default async function CollaborationsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'CREATOR') redirect('/sign-in');

  const creator = await prisma.creator.findUnique({ where: { userId: session.user.id } });
  if (!creator) redirect('/creator/profile');

  const collaborations = await prisma.collaboration.findMany({
    where: { creatorId: creator.id },
    include: { campaign: { include: { brand: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const grouped = {
    PENDING: collaborations.filter(c => c.status === 'PENDING'),
    ACTIVE: collaborations.filter(c => ['ACCEPTED', 'NEGOTIATING', 'IN_PROGRESS'].includes(c.status)),
    COMPLETED: collaborations.filter(c => ['COMPLETED', 'DECLINED', 'CANCELLED'].includes(c.status)),
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Collaborations</h1>
        <p className="text-gray-500 mt-1">Manage your brand collaboration requests</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Pending', count: grouped.PENDING.length, color: 'bg-amber-50 border-amber-200 text-amber-700' },
          { label: 'Active', count: grouped.ACTIVE.length, color: 'bg-green-50 border-green-200 text-green-700' },
          { label: 'Completed', count: grouped.COMPLETED.length, color: 'bg-gray-50 border-gray-200 text-gray-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <div className="text-3xl font-bold">{s.count}</div>
            <div className="text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Collaboration sections */}
      {Object.entries(grouped).map(([group, items]) => (
        items.length > 0 && (
          <div key={group} className="mb-8">
            <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span>{group === 'PENDING' ? '⏳' : group === 'ACTIVE' ? '🚀' : '✅'}</span>
              {group === 'PENDING' ? 'Pending Requests' : group === 'ACTIVE' ? 'Active Collaborations' : 'Past Collaborations'}
            </h2>
            <div className="space-y-3">
              {items.map((collab) => (
                <Card key={collab.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {collab.campaign.brand.companyName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{collab.campaign.title}</h3>
                            <p className="text-sm text-gray-500">{collab.campaign.brand.companyName} · {collab.campaign.industry}</p>
                          </div>
                          <Badge className={getStatusColor(collab.status)}>{collab.status.replace('_', ' ')}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{collab.campaign.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          {collab.agreedRate && (
                            <span className="flex items-center gap-1 text-green-600 font-medium">
                              <DollarSign className="h-3.5 w-3.5" />{formatCurrency(collab.agreedRate)}
                            </span>
                          )}
                          {collab.proposedRate && !collab.agreedRate && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3.5 w-3.5" />Offered: {formatCurrency(collab.proposedRate)}
                            </span>
                          )}
                          {collab.deadline && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />{formatDate(collab.deadline)}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5" />{collab.campaign.postTypes.join(', ')}
                          </span>
                        </div>

                        {/* Actions for pending */}
                        {collab.status === 'PENDING' && (
                          <div className="flex items-center gap-2 mt-4">
                            <form action={`/api/collaborations/${collab.id}/accept`} method="POST">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white border-0">Accept</Button>
                            </form>
                            <Button size="sm" variant="outline" className="border-blue-200 text-blue-600">Negotiate</Button>
                            <form action={`/api/collaborations/${collab.id}/decline`} method="POST">
                              <Button size="sm" variant="outline" className="border-red-200 text-red-600">Decline</Button>
                            </form>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      ))}

      {collaborations.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-40" />
          <h3 className="font-medium text-gray-600 mb-1">No collaborations yet</h3>
          <p className="text-sm">Complete your profile to start receiving collaboration requests from brands.</p>
          <Link href="/creator/profile"><Button className="mt-4 gradient-purple-pink text-white border-0">Complete Profile</Button></Link>
        </div>
      )}
    </div>
  );
}
